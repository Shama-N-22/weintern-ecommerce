function ProductSkeleton() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton-block skeleton-image" />
      <div className="skeleton-block skeleton-line" style={{ width: "40%" }} />
      <div className="skeleton-block skeleton-line" style={{ width: "80%" }} />
      <div className="skeleton-block skeleton-line" style={{ width: "50%" }} />
    </div>
  );
}

export default ProductSkeleton;
