import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1.4" />
      <circle cx="18" cy="21" r="1.4" />
      <path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-7-4.35-9.5-8.5C.8 8 2 4 6 4c2 0 3.5 1.2 4 2.5C10.5 5.2 12 4 14 4c4 0 5.2 4 3.5 7.5C19 15.65 12 20 12 20z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-4 5-5.5 7.5-5.5s6 1.5 7.5 5.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = [
    "navbar",
    isHome ? "navbar-floating" : "navbar-solid",
    scrolled ? "navbar-scrolled" : "",
  ]
    .join(" ")
    .trim();

  return (
    <nav className={navClass}>
      <NavLink to="/" end className="navbar-logo">
        <span className="logo-mark" />
        NEXTGEAR
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/shop" className="nav-link">Products</NavLink>
        <NavLink to="/compare" className="nav-link">Compare</NavLink>
        <NavLink to="/tech-lab" className="nav-link">AI Advisor</NavLink>
        <NavLink to="/about" className="nav-link">About</NavLink>
        <NavLink to="/contact" className="nav-link">Contact</NavLink>
        {isAuthenticated && (
          <NavLink to="/my-orders" className="nav-link">My Orders</NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" className="nav-link">Admin</NavLink>
        )}
      </div>

      <div className="navbar-actions">
        <button
          className="nav-icon-btn"
          onClick={() => setSearchOpen((prev) => !prev)}
          aria-label="Search"
        >
          <SearchIcon />
        </button>
        {searchOpen && (
          <input
            className="navbar-search"
            type="text"
            placeholder="Search products..."
            autoFocus
          />
        )}
        <NavLink to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
          <HeartIcon />
        </NavLink>
        <NavLink to="/cart" className="nav-icon-btn" aria-label="Cart">
          <CartIcon />
        </NavLink>
        <NavLink to={isAuthenticated ? "/profile" : "/login"} className="nav-icon-btn" aria-label="Account">
          <UserIcon />
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
