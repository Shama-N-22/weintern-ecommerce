import { Link } from "react-router-dom";
import products from "../data/products";

function Compare() {
  const compareIds = JSON.parse(localStorage.getItem("compareItems")) || [];
  const items = products.filter((p) => compareIds.includes(p.id));

  const clearCompare = () => {
    localStorage.removeItem("compareItems");
    window.location.reload();
  };

  if (items.length === 0) {
    return (
      <div className="page-container">
        <h1>Compare Products</h1>
        <h2 className="empty-state">
          No products selected yet — go to the Shop page and check "Compare" on a few items.
        </h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>
          Go to Shop
        </Link>
      </div>
    );
  }

  const maxPrice = Math.max(...items.map((i) => i.price));

  return (
    <div className="page-container">
      <h1>Compare Products</h1>

      <table className="compare-table">
        <thead>
          <tr>
            <th>Product</th>
            {items.map((item) => (
              <th key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>{item.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Category</td>
            {items.map((item) => (
              <td key={item.id}>{item.category}</td>
            ))}
          </tr>
          <tr>
            <td>Price</td>
            {items.map((item) => (
              <td key={item.id}>₹{item.price.toLocaleString("en-IN")}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <h1 className="rail-title" style={{ marginTop: 48 }}>Price Comparison</h1>
      <div className="compare-chart">
        {items.map((item) => (
          <div className="compare-bar-row" key={item.id}>
            <span className="compare-bar-label">{item.name}</span>
            <div className="compare-bar-track">
              <div
                className="compare-bar-fill"
                style={{ width: `${(item.price / maxPrice) * 100}%` }}
              />
            </div>
            <span className="compare-bar-value">₹{item.price.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-outline" style={{ marginTop: 32 }} onClick={clearCompare}>
        Clear comparison
      </button>
    </div>
  );
}

export default Compare;
