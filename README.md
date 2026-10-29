# 🎂 Sweet Bliss Bakery - Backend REST API

This is the Node.js, Express, and MongoDB backend for the Sweet Bliss Bakery Custom Order Portal.

---

## 🚀 Features

- **Product Catalog API**: Full CRUD, category filtering, search, and featured item flags.
- **Order Management API**:
  - Regular shopping cart checkout with server-side price validation & delivery fee calculation.
  - Custom cake orders with dynamic price calculation based on size, flavor, frosting, and messages.
  - Order tracking by Order ID and Customer Phone number.
- **Admin Authentication**: JWT-based authentication with bcrypt password hashing.
- **Admin Dashboard & Management**:
  - Dashboard statistics (total orders, pending orders, products count, messages count, recent orders).
  - Order status updates (`Pending` -> `Confirmed` -> `Preparing` -> `Ready` -> `Completed`).
  - Product catalog management (Create, Update, Delete).
  - Customer contact inquiry management.
- **Database Seeding**: Pre-loaded with 16 signature bakery products across 5 categories and default admin user credentials.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (>= 16.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation**: `express-validator`
- **Unique IDs**: `nanoid` (v3)
- **Security & Utilities**: `cors`, `dotenv`

---

## 📁 Project Structure

```
backend/
├── .env                  # Local environment variables
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore file
├── middleware/
│   └── authMiddleware.js # JWT verification middleware
├── models/
│   ├── AdminUser.js      # Admin user schema
│   ├── ContactMessage.js # Customer inquiry schema
│   ├── Order.js          # Regular & custom order schema
│   └── Product.js        # Bakery item schema
├── routes/
│   ├── adminRoutes.js    # Protected admin operations
│   ├── authRoutes.js     # Admin login endpoint
│   ├── contactRoutes.js  # Contact inquiry submission
│   ├── orderRoutes.js    # Cart, custom orders, & tracking
│   └── productRoutes.js  # Public catalog browsing
├── seed/
│   └── seed.js           # Database seeding script (16 products + admin)
├── package.json          # Dependencies and scripts
└── server.js             # Main server setup & DB connection
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of `backend/`:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/bakery
JWT_SECRET=your_very_long_random_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:5173

ADMIN_SEED_USERNAME=admin
ADMIN_SEED_EMAIL=admin@sweetbliss.com
ADMIN_SEED_PASSWORD=Admin@123
```

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Make sure MongoDB is running, then execute:
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```
Or for production:
```bash
npm start
```

---

## 📡 API Endpoints Overview

### Health Check
- `GET /api/health` - Check API status

### Public Products
- `GET /api/products` - Fetch products (supports `?category=...`, `?search=...`, `?featured=true`)
- `GET /api/products/:id` - Fetch single product

### Orders
- `POST /api/orders` - Place regular cart order
- `POST /api/orders/custom` - Place custom cake order
- `GET /api/orders/track?orderId=...&phone=...` - Track order status

### Auth
- `POST /api/auth/login` - Admin login (returns JWT token)

### Contact
- `POST /api/contact` - Submit customer inquiry

### Protected Admin Routes (`Bearer <token>`)
- `GET /api/admin/stats` - Dashboard metrics & 5 recent orders
- `GET /api/admin/orders` - List orders (pagination: `?page=1&limit=10&status=...`)
- `GET /api/admin/orders/:id` - Order details
- `PATCH /api/admin/orders/:id/status` - Update status (`Pending`, `Confirmed`, `Preparing`, `Ready`, `Completed`)
- `GET /api/admin/products` - All products for management
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/contacts` - Inquiries list (auto-marks unread as read)
