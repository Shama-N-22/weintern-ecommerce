import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProducts } from "../services/productService";
import { addToCart as addToCartAPI } from "../services/cartService";
import ProductModal from "../components/ProductModal";
import ProductSkeleton from "../components/ProductSkeleton";
import { metaFor, brandFor } from "../components/productMeta";
import { overallScores } from "../components/compareSpecs";

const MAX_COMPARE = 3;
const PAGE_SIZE = 9;
const QUICK_FILTERS = ["Best Seller", "New Launch", "Gaming", "Student Pick", "Budget", "Premium", "Editor's Choice"];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Rating", "Newest"];

function PromoBanner({ title, subtitle }) {
  return (
    <div className="promo-banner">
      <span className="promo-eyebrow">Limited Time</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function Shop() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeProduct, setActiveProduct] = useState(null);
  const [compareIds, setCompareIds] = useState(() => JSON.parse(localStorage.getItem("compareItems")) || []);
  const [wishlistIds, setWishlistIds] = useState(() => (JSON.parse(localStorage.getItem("wishlistItems")) || []).map((w) => w.id));

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Featured");
  const [priceRange, setPriceRange] = useState(200000);
  const [brandFilter, setBrandFilter] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  // ---- Load products from the backend ----
  useEffect(() => {
    let cancelled = false;
    setLoadingProducts(true);
    setFetchError("");

    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        console.error("fetchProducts failed:", err);
        if (!cancelled) {
          setFetchError(
            err.message === "Network Error"
              ? "Can't reach the backend at localhost:5000 — is it running?"
              : `Failed to load products: ${err.message}`
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });

    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products]);
  const brands = useMemo(() => ["All", ...new Set(products.map((p) => brandFor(p)))], [products]);
  const metaMap = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.id] = metaFor(p); });
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const meta = metaMap[p.id];
      if (!meta) return true; // don't hide a product just because meta failed
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (p.price > priceRange) return false;
      if (brandFilter !== "All" && meta.brand !== brandFilter) return false;
      if (meta.rating < minRating) return false;
      if (inStockOnly && meta.stock === "Out of Stock") return false;
      if (activeQuickFilters.length > 0 && !activeQuickFilters.every((f) => meta.quickTags.includes(f))) return false;
      return true;
    });

    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Rating") list = [...list].sort((a, b) => (metaMap[b.id]?.rating || 0) - (metaMap[a.id]?.rating || 0));
    if (sort === "Newest") list = [...list].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return list;
  }, [products, activeCategory, search, priceRange, brandFilter, minRating, inStockOnly, activeQuickFilters, sort, metaMap]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, search, priceRange, brandFilter, minRating, inStockOnly, activeQuickFilters, sort]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + PAGE_SIZE);
          setLoadingMore(false);
        }, 400);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  const addToCart = async (item, opts = {}) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    try {
      await addToCartAPI(item.id, 1);
      trackRecentlyViewed(item);
      if (!opts.silent) alert(`${item.name} added to cart`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const trackRecentlyViewed = (item) => {
    const recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const updated = [item, ...recent.filter((p) => p.id !== item.id)].slice(0, 6);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      let updated;
      if (prev.includes(id)) updated = prev.filter((c) => c !== id);
      else {
        if (prev.length >= MAX_COMPARE) { alert(`You can compare up to ${MAX_COMPARE} products at a time.`); return prev; }
        updated = [...prev, id];
      }
      localStorage.setItem("compareItems", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleWishlist = (item) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    let updated;
    if (wishlist.some((w) => w.id === item.id)) updated = wishlist.filter((w) => w.id !== item.id);
    else updated = [...wishlist, item];
    localStorage.setItem("wishlistItems", JSON.stringify(updated));
    setWishlistIds(updated.map((w) => w.id));
  };

  const toggleQuickFilter = (f) => {
    setActiveQuickFilters((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  return (
    <div className="page-container shop-page">
      <h1>Shop</h1>

      {fetchError && (
        <div className="auth-error" style={{ maxWidth: 600, marginBottom: 20 }}>
          {fetchError}
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-outline" onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      )}

      {loadingProducts && !fetchError && (
        <p className="lab-note" style={{ marginBottom: 20 }}>Loading products from the server…</p>
      )}

      {!loadingProducts && !fetchError && products.length === 0 && (
        <p className="lab-note" style={{ marginBottom: 20 }}>
          The server responded but sent back 0 products — check your database has products seeded.
        </p>
      )}

      {products.length > 0 && (
        <>
          <div className="sticky-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`sticky-tab ${activeCategory === cat ? "sticky-tab-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.span className="sticky-tab-underline" layoutId="tab-underline" />
                )}
              </button>
            ))}
          </div>

          <div className="control-bar">
            <input
              className="control-search"
              type="text"
              placeholder="🔍 AI Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select className="control-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>

            <select className="control-select" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
              {brands.map((b) => <option key={b}>{b}</option>)}
            </select>

            <div className="control-range">
              <label>Max ₹{priceRange.toLocaleString("en-IN")}</label>
              <input type="range" min="1000" max="200000" step="5000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} />
            </div>

            <div className="control-rating">
              {[3, 3.5, 4, 4.5].map((r) => (
                <button key={r} className={`filter-chip ${minRating === r ? "active" : ""}`} onClick={() => setMinRating(minRating === r ? 0 : r)}>
                  {r}★+
                </button>
              ))}
            </div>

            <label className="compare-check">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
              In stock only
            </label>
          </div>

          <div className="filter-bar">
            {QUICK_FILTERS.map((f) => (
              <button key={f} className={`filter-chip ${activeQuickFilters.includes(f) ? "active" : ""}`} onClick={() => toggleQuickFilter(f)}>
                {f}
              </button>
            ))}
          </div>

          <div className="product-grid premium-product-grid">
            <AnimatePresence>
              {visibleProducts.map((item, i) => {
                const meta = metaMap[item.id] || { badges: [], brand: "NextGear", rating: 4, reviewCount: 0, discountPercent: 0, stock: "In Stock", deliveryDays: 3, emiMonthly: Math.round(item.price / 12) };
                const perfScore = ["Laptops", "Phones", "PCs"].includes(item.category)
                  ? Math.round((overallScores(item).cpu + overallScores(item).gpu) / 2)
                  : null;

                return (
                  <motion.div
                    className="premium-product-card"
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: (i % PAGE_SIZE) * 0.03 }}
                    onClick={() => { trackRecentlyViewed(item); setActiveProduct(item); }}
                  >
                    <div className="premium-card-badges">
                      {meta.badges.map((b) => <span className={`product-badge badge-${b.replace(/\s/g, "-").toLowerCase()}`} key={b}>{b}</span>)}
                    </div>

                    <div className="premium-card-media">
                      <img src={item.image} alt={item.name} className="product-image" />
                      <div className="premium-card-actions" onClick={(e) => e.stopPropagation()}>
                        <button title="Quick View" onClick={() => setActiveProduct(item)}>👁</button>
                        <button title="Compare" onClick={() => toggleCompare(item.id)} className={compareIds.includes(item.id) ? "action-active" : ""}>⇄</button>
                        <button title="Wishlist" onClick={() => toggleWishlist(item)} className={wishlistIds.includes(item.id) ? "action-active" : ""}>♡</button>
                        <button title="Add to Cart" onClick={() => addToCart({ ...item, color: item.colors?.[0] })}>🛒</button>
                      </div>
                    </div>

                    <span className="product-category">{item.category} · {meta.brand}</span>
                    <h2>{item.name}</h2>

                    <div className="premium-card-rating">
                      <span className="testimonial-stars">{"★".repeat(Math.round(meta.rating))}{"☆".repeat(5 - Math.round(meta.rating))}</span>
                      <span className="review-count">{meta.rating} ({meta.reviewCount})</span>
                    </div>

                    <div className="premium-card-price-row">
                      <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>
                      {meta.discountPercent > 0 && <span className="discount-badge">-{meta.discountPercent}%</span>}
                    </div>

                    <p className="emi-line">EMI from ₹{meta.emiMonthly.toLocaleString("en-IN")}/mo</p>

                    <div className="premium-card-meta">
                      <span className={`stock-tag stock-${meta.stock.replace(/\s/g, "-").toLowerCase()}`}>{meta.stock}</span>
                      <span>🚚 {meta.deliveryDays} day delivery</span>
                    </div>

                    <label className="compare-check" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={compareIds.includes(item.id)}
                        onChange={() => toggleCompare(item.id)}
                      />
                      Add to Compare
                    </label>

                    {perfScore !== null && (
                      <div className="perf-score-bar">
                        <span>Performance</span>
                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: `${perfScore}%` }} /></div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {loadingMore && Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={`sk-${i}`} />)}
          </div>

          {hasMore && <div ref={sentinelRef} style={{ height: 20 }} />}
          {!hasMore && filtered.length > PAGE_SIZE && (
            <p className="lab-note" style={{ textAlign: "center", marginTop: 20 }}>You've reached the end of the catalog.</p>
          )}
          {filtered.length === 0 && (
            <h2 className="empty-state">No products match these filters — try widening the price range or clearing filters.</h2>
          )}

          <PromoBanner title="Season Sale — up to 25% off Laptops" subtitle="Ends soon, while stock lasts." />

          {recentlyViewed.length > 0 && (
            <section className="rail-section" style={{ padding: "0 0 40px" }}>
              <h1 className="rail-title">Recently Viewed</h1>
              <div className="product-rail">
                {recentlyViewed.map((item) => (
                  <div className="rail-item" key={item.id}>
                    <div className="product-card" onClick={() => setActiveProduct(item)}>
                      <img src={item.image} alt={item.name} className="product-image" />
                      <h2>{item.name}</h2>
                      <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {compareIds.length > 0 && (
            <div className="compare-tray">
              <span>Compare ({compareIds.length}/{MAX_COMPARE})</span>
              <div className="compare-tray-thumbs">
                {products.filter((p) => compareIds.includes(p.id)).map((item) => (
                  <img key={item.id} src={item.image} alt={item.name} title={item.name} />
                ))}
              </div>
              <button className="btn btn-primary" onClick={() => navigate("/compare")}>Compare Now</button>
            </div>
          )}
        </>
      )}

      <ProductModal item={activeProduct} onClose={() => setActiveProduct(null)} onAddToCart={addToCart} />
    </div>
  );
}

export default Shop;
