import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/cart">Cart</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/checkout">Checkout</Link>
        <Link to="/order-success">Order Success</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;