# 🚀 NextGear — Premium Tech E-Commerce

A full-stack, high-fidelity e-commerce experience tailored for tech enthusiasts and power users. NextGear is designed to offer a premium interface with real-time specification comparison, an interactive specs lab, dynamic visuals, and robust role-based user management.

🔗 **Live Demo:** [weintern-ecommerce.vercel.app](https://weintern-ecommerce.vercel.app)

---

## ✨ Features

### 🎨 Frontend & Design Aesthetics
*   **Vibrant & Modern UI**: Built with dark-mode optimized colors, custom typography, glassmorphism, and smooth micro-animations.
*   **Dynamic Visuals**: Features custom particle effects (`smoke-layer`, `grain-overlay`) and reactive cursor-glow gradients.
*   **Interactive Tech Lab**: Customize or view component setups interactively (`TechLab.jsx`).
*   **Specs Comparison Engine**: Compare up to 3 products side-by-side with CPU, GPU, and overall performance rating bars.
*   **Browsing History**: Tracks and displays "Recently Viewed" items via local storage caching.
*   **Rocket Back-to-Top**: Custom animated scrolling rocket helper.

### ⚙️ Backend & API Capabilities
*   **Authentication & Security**: User registration and login utilizing secure JWT tokens and password hashing via `bcryptjs`.
*   **Shopping Cart**: Complete backend persistence for carts, allowing users to add, update, or remove items.
*   **Checkout & Orders**: Secure order creation with order history tracking.
*   **Admin Dashboard**: Restricted dashboard for administrators to monitor site statistics, user states, and inventory data.
*   **Database Seeding**: Easily populates the initial product catalog using an automated seeding script.

---

## 🛠️ Technology Stack

*   **Frontend**: React (v19), Vite, React Router (v7), Framer Motion, Axios
*   **Backend**: Node.js, Express.js, Mongoose ODM
*   **Database**: MongoDB
*   **Styling**: Custom CSS (Vanilla CSS for maximum control and styling fidelity)
*   **Deployment**: Vercel (Frontend), Render/Railway/Render (Backend)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or MongoDB Atlas connection URI)

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Shama-N-22/weintern-ecommerce.git
    cd weintern-ecommerce
    ```

2.  **Setup Backend**:
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
    Populate/seed the database:
    ```bash
    node seed/seedProducts.js
    ```
    Start the backend dev server:
    ```bash
    npm run dev
    ```

3.  **Setup Frontend**:
    ```bash
    cd ../frontend
    npm install
    ```
    Start the Vite development server:
    ```bash
    npm run dev
    ```

---

## 📁 Repository Structure

```text
weintern-ecommerce/
├── backend/                  # Node.js & Express REST API
│   ├── config/               # DB connections configuration
│   ├── controllers/          # Business logic controllers
│   ├── middleware/           # Route guards and JWT validation
│   ├── models/               # Mongoose MongoDB schemas
│   ├── routes/               # API Router setup
│   └── seed/                 # DB Seeding scripts
└── frontend/                 # React & Vite application
    ├── src/
    │   ├── components/       # Shared UI components
    │   ├── context/          # React State Providers (Auth & Theme)
    │   ├── pages/            # Application views/screens
    │   └── services/         # Axios wrapper client functions
```
