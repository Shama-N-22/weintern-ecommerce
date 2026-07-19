import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import products from "../data/products";
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
  const [priceRange, setPriceRange] = useState(150000);
  const [brandFilter, setBrandFilter] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], []);
  const brands = useMemo(() => ["All", ...new Set(products.map((p) => brandFor(p)))], []);
  const metaMap = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.id] = metaFor(p); });
    return map;
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (activeCategory !== "All" && p.category !== activeCategory) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (p.price > priceRange) return false;
      if (brandFilter !== "All" && metaMap[p.id].brand !== brandFilter) return false;
      if (metaMap[p.id].rating < minRating) return false;
      if (inStockOnly && metaMap[p.id].stock === "Out of Stock") return false;
      if (activeQuickFilters.length > 0 && !activeQuickFilters.every((f) => metaMap[p.id].quickTags.includes(f))) return false;
      return true;
    });

    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Rating") list = [...list].sort((a, b) => metaMap[b.id].rating - metaMap[a.id].rating);
    if (sort === "Newest") list = [...list].sort((a, b) => b.id - a.id);

    return list;
  }, [activeCategory, search, priceRange, brandFilter, minRating, inStockOnly, activeQuickFilters, sort, metaMap]);

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
        }, 500);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  const addToCart = (item, opts = {}) => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const alreadyExists = savedCart.find((c) => c.id === item.id && c.color === item.color);
    let updatedCart;
    if (alreadyExists) {
      updatedCart = savedCart.map((c) => (c.id === item.id && c.color === item.color ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      updatedCart = [...savedCart, { ...item, quantity: 1 }];
    }
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    trackRecentlyViewed(item);
    if (!opts.silent) alert(`${item.name} added to cart`);
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

  const recommendedForYou = useMemo(() => {
    const sourceCategories = new Set(recentlyViewed.map((r) => r.category));
    const pool = products.filter((p) => sourceCategories.size === 0 || sourceCategories.has(p.category));
    return (pool.length > 0 ? pool : products).slice(0, 6);
  }, [recentlyViewed.length]);

  const compareItemsData = products.filter((p) => compareIds.includes(p.id));

  return (
    <div className="page-container shop-page">
      <h1>Shop</h1>

      {/* Sticky category tabs with sliding underline */}
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

      {/* Premium control bar */}
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
          <input type="range" min="1000" max="150000" step="5000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} />
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

      {/* Product grid */}
      <div className="product-grid premium-product-grid">
        <AnimatePresence>
          {visibleProducts.map((item, i) => {
            const meta = metaMap[item.id];
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
                transition={{ duration: 0.35, delay: (i % PAGE_SIZE) * 0.04 }}
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
      {filtered.length === 0 && <h2 className="empty-state">No products match these filters.</h2>}

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

      <section className="rail-section" style={{ padding: "0 0 40px" }}>
        <h1 className="rail-title">Recommended For You</h1>
        <div className="product-rail">
          {recommendedForYou.map((item) => (
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

      {/* Sticky compare tray */}
      {compareIds.length > 0 && (
        <div className="compare-tray">
          <span>Compare ({compareIds.length}/{MAX_COMPARE})</span>
          <div className="compare-tray-thumbs">
            {compareItemsData.map((item) => (
              <img key={item.id} src={item.image} alt={item.name} title={item.name} />
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/compare")}>Compare Now</button>
        </div>
      )}

      <ProductModal item={activeProduct} onClose={() => setActiveProduct(null)} onAddToCart={addToCart} />
    </div>
  );
}

export default Shop;
