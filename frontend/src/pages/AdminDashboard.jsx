import { useEffect, useState } from "react";
import {
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetUsers, adminUpdateUserRole, adminDeleteUser,
} from "../services/adminService";
import { adminGetAllOrders, adminUpdateOrderStatus } from "../services/orderService";

const ORDER_STATUSES = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

const CATEGORIES = ["Laptops", "Phones", "PCs", "Audio", "Displays", "Accessories", "Wearables"];
const TABS = ["Products", "Users", "Orders"];

const EMPTY_FORM = { name: "", price: "", category: CATEGORIES[0], image: "", colors: "", stock: 20 };

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    adminGetProducts().then(setProducts).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      colors: form.colors ? form.colors.split(",").map((c) => c.trim()) : [],
    };
    try {
      if (editingId) {
        await adminUpdateProduct(editingId, payload);
      } else {
        await adminCreateProduct(payload);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product — are you logged in as an admin?");
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name, price: p.price, category: p.category,
      image: p.image, colors: (p.colors || []).join(", "), stock: p.stock,
    });
  };

  const cancelEdit = () => { setEditingId(null); setForm(EMPTY_FORM); };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await adminDeleteProduct(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div>
      {error && <p className="auth-error" style={{ maxWidth: 480 }}>{error}</p>}

      <form className="checkout-form" onSubmit={handleSubmit} style={{ maxWidth: 480, marginBottom: 30 }}>
        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
        <input name="colors" placeholder="Colors (comma separated)" value={form.colors} onChange={handleChange} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">{editingId ? "Save Changes" : "Add Product"}</button>
          {editingId && <button type="button" className="btn btn-outline" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      {loading ? (
        <p className="lab-note">Loading products…</p>
      ) : (
        <div className="premium-compare-table-wrapper">
          <table className="premium-compare-table">
            <thead>
              <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price.toLocaleString("en-IN")}</td>
                  <td>{p.stock}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-outline" onClick={() => startEdit(p)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    adminGetUsers().then(setUsers).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRoleChange = async (id, role) => {
    try {
      await adminUpdateUserRole(id, role);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await adminDeleteUser(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <p className="lab-note">Loading users…</p>;

  return (
    <div>
      {error && <p className="auth-error" style={{ maxWidth: 480 }}>{error}</p>}
      <div className="premium-compare-table-wrapper">
        <table className="premium-compare-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    adminGetAllOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await adminUpdateOrderStatus(orderId, status);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    }
  };

  if (loading) return <p className="lab-note">Loading orders…</p>;

  return (
    <div>
      {error && <p className="auth-error" style={{ maxWidth: 480 }}>{error}</p>}
      {orders.length === 0 ? (
        <p className="lab-note">No orders placed yet.</p>
      ) : (
        <div className="premium-compare-table-wrapper">
          <table className="premium-compare-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name || "Unknown"} ({o.user?.email || "—"})</td>
                  <td>₹{o.totalAmount.toLocaleString("en-IN")}</td>
                  <td>
                    <select value={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                      {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>
      <div className="filter-bar">
        {TABS.map((t) => (
          <button key={t} className={`filter-chip ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === "Products" && <ProductsTab />}
      {tab === "Users" && <UsersTab />}
      {tab === "Orders" && <OrdersTab />}
    </div>
  );
}

export default AdminDashboard;
