# MEDJO FAST FOOD - A Food Ordering Platform

A full-stack food ordering platform built using the MERN stack, implemented with JWT-based authorization and role-based admin access for managing orders and payments.

---

## TEAM RAESYN

| Name                        | Role                           | Responsibilities                                                                                                   |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Aejosh Chrinze C. Sosa      | Team Leader                    | Full-stack development, backend setup, JWT auth, MongoDB models, REST API, GitHub management, React-API connection |
| Reyben S. Espora            | Frontend Dev                   | React pages and components, UI layout and styling                                                                  |
| Syntriche Drache V. Basañez | Backend Dev QA & Documentation | API route testing, Postman testing of endpoints, JWT implementation, README documentation                          |

---

## PROJECT OVERVIEW

**Medjo FastFood** is an online ordering platform where users can:

- Register and log in to their account
- Browse menu items and add them to cart
- Place orders and view order history
- Submit ratings and feedback
- Cancel pending orders

Admins can:

- View and manage all orders
- Update order statuses
- Verify or reject payments
- Add, edit, and delete menu items

---

## TECHNOLOGY STACK

| Technology             | Role                                                             | Install                          |
| ---------------------- | ---------------------------------------------------------------- | -------------------------------- |
| **MongoDB**            | Database — stores users, menu items, and orders via Mongoose ODM | —                                |
| **Express.js**         | Backend framework — defines REST API routes and controllers      | `npm install express`            |
| **React + Vite**       | Frontend UI — builds all pages (menu, cart, login, dashboard)    | `npm create vite@latest`         |
| **Node.js**            | Runtime — runs the backend server and handles JWT verification   | —                                |
| **Mongoose**           | ODM for MongoDB                                                  | `npm install mongoose`           |
| **bcryptjs**           | Password hashing                                                 | `npm install bcryptjs`           |
| **jsonwebtoken**       | JWT token generation and verification                            | `npm install jsonwebtoken`       |
| **Axios**              | HTTP client for React API calls                                  | `npm install axios`              |
| **dotenv**             | Environment variable management                                  | `npm install dotenv`             |
| **express-rate-limit** | Rate limiting middleware                                         | `npm install express-rate-limit` |
| **Postman**            | API testing                                                      | —                                |

---

## PROJECT STRUCTURE

```
medjo-fast-food/
├── backend/
│   ├── public/
│   │   └── images/                 # Served food images (static)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register & login logic
│   │   │   ├── checkoutController.js # Payment logic
│   │   │   ├── menuController.js   # Menu CRUD logic
│   │   │   ├── profileController.js  # Profile handling logic
│   │   │   ├── orderController.js  # Order CRUD logic
│   │   │   └── reviewController.js # Review logic
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT verification + admin guard
│   │   │   └── rateLimiter.js      # Rate limiting middleware
│   │   ├── models/
│   │   │   ├── User.js             # User schema
│   │   │   ├── MenuItem.js         # Menu item schema
│   │   │   ├── Order.js            # Order schema
│   │   │   ├── Checkout.js         # Checkout/payment schema
│   │   │   └── Review.js           # Review schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # /api/auth
│   │   │   ├── menuRoutes.js       # /api/menu
│   │   │   ├── orderRoutes.js      # /api/orders
│   │   │   ├── checkoutRoutes.js   # /api/checkout
│   │   │   ├── profileRoutes.js    # /api/profile
│   │   │   └── reviewRoutes.js     # /api/reviews
│   │   └── server.js               # Main server entry point
│   ├── .env                        # Environment variables (not in GitHub)
│   ├── .gitignore
│   └── package.json
|
├── frontend/
│   ├── src/
│   │   ├── assets/                 # Food images
│   │   ├── components/             # Reusable UI components
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   └── StarRating.jsx
│   │   ├── hooks/
│   │   │   └── useRequireAuth.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MenuPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── ReviewPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       ├── AdminPayments.jsx
│   │   │       └── AdminMenu.jsx
│   │   ├── store/
│   │   │   └── useAuthStore.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## FEATURES IMPLEMENTED

### Feature 1 — User Authorization

- JWT tokens with 7-day expiry
- bcrypt password hashing
- localStorage persistence
- Login modal for unauthorized users

### Feature 2 — Browse Menu

- Dynamic search by name or description
- Category filters: All, Burgers, Chicken, Sides, Drinks
- Food images served from backend static folder

### Feature 3 — Cart and Orders

- Add/remove items from cart
- Place orders with quantity validation (max 30 per item)
- View order history
- Cancel pending orders

### Feature 4 — Checkout and Payments

- Submit payment details linked to an order
- Backend blocks duplicate payment submissions

### Feature 5 — Reviews

- Submit star ratings and written feedback per order

### Feature 6 — Admin Panel

- Role-based access control (`user` / `admin`)
- Admin can view and update all orders
- Admin can verify or reject payments
- Admin can add, edit, and delete menu items

### Feature 7 — Rate Limiting

- Auth: 10 requests / 15 min
- Orders: 30 requests / hour
- General: 100 requests / 15 min

---

## JWT AUTHORIZATION FLOW

```
1. User logs in      →  POST /api/auth/login { email, password }
2. Password verified →  bcrypt.compare(password, hashedPassword)
3. Token issued      →  jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' })
4. Token stored      →  localStorage.setItem('token', token)
5. Token sent        →  Authorization: Bearer <token>
6. Token verified    →  jwt.verify(token, JWT_SECRET) → req.userId, req.userRole
7. Admin check       →  req.userRole === 'admin' → allowed / 403 Access Denied
```

---

## PREREQUISITES

| Tool                  | Link                              |
| --------------------- | --------------------------------- |
| Node.js v18+          | https://nodejs.org                |
| MongoDB Atlas account | https://www.mongodb.com/atlas     |
| Postman               | https://www.postman.com/downloads |

---

## SETUP INSTRUCTIONS

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medjo-fast-food.git
cd medjo-fast-food
```

### 2. Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3. Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

### 4. Run the Project

Open two separate terminals:

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

| Server   | URL                   |
| -------- | --------------------- |
| Backend  | http://localhost:5001 |
| Frontend | http://localhost:5173 |

---

## API ENDPOINTS

### Auth Routes

| Method | Endpoint             | Description                 | Auth Required |
| ------ | -------------------- | --------------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user         | No            |
| POST   | `/api/auth/login`    | Login and receive JWT token | No            |

### Profile Routes

| Method | Endpoint       | Description         | Auth Required |
| ------ | -------------- | ------------------- | ------------- |
| GET    | `/api/profile` | Get user profile    | Yes           |
| PUT    | `/api/profile` | Update user profile | Yes           |

### Menu Routes

| Method | Endpoint        | Description            | Auth Required |
| ------ | --------------- | ---------------------- | ------------- |
| GET    | `/api/menu`     | Get all menu items     | No            |
| GET    | `/api/menu/:id` | Get a single menu item | No            |
| POST   | `/api/menu`     | Add a new menu item    | Yes (Admin)   |
| PUT    | `/api/menu/:id` | Update a menu item     | Yes (Admin)   |
| DELETE | `/api/menu/:id` | Delete a menu item     | Yes (Admin)   |

### Order Routes

| Method | Endpoint                 | Description                 | Auth Required |
| ------ | ------------------------ | --------------------------- | ------------- |
| POST   | `/api/orders`            | Place an order              | Yes           |
| GET    | `/api/orders/history`    | Get logged-in user's orders | Yes           |
| GET    | `/api/orders/all`        | Get all orders              | Yes (Admin)   |
| GET    | `/api/orders/:id`        | Get one specific order      | Yes           |
| PUT    | `/api/orders/:id/status` | Update order status         | Yes (Admin)   |
| PATCH  | `/api/orders/:id/cancel` | Cancel a pending order      | Yes           |
| DELETE | `/api/orders/:id`        | Delete an order             | Yes           |

### Checkout Routes

| Method | Endpoint                       | Description                      | Auth Required |
| ------ | ------------------------------ | -------------------------------- | ------------- |
| POST   | `/api/checkout`                | Submit payment                   | Yes           |
| GET    | `/api/checkout/order/:orderId` | Get payment for a specific order | Yes           |
| GET    | `/api/checkout/all`            | Get all payments                 | Yes (Admin)   |
| PUT    | `/api/checkout/:id/status`     | Update payment status            | Yes (Admin)   |

### Review Routes

| Method | Endpoint                | Description          | Auth Required |
| ------ | ----------------------- | -------------------- | ------------- |
| POST   | `/api/reviews`          | Submit a review      | Yes           |
| GET    | `/api/reviews/:orderId` | Get reviews by order | No            |

---

## USING PROTECTED ROUTES IN POSTMAN

1. Call `POST /api/auth/login` to get a token
2. Copy the token from the response
3. In Postman, go to the **Headers** tab
4. Add the following header:

| Key           | Value                  |
| ------------- | ---------------------- |
| Authorization | Bearer your_token_here |

---

## CHALLENGES AND SOLUTIONS

| Challenge                                         | Solution                                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| CORS errors blocking React-Express communication  | Added `cors` middleware with `origin: 'http://localhost:5173'`                  |
| Rate limiter blocking dev requests during testing | Increased limits and added `NODE_ENV` check for development                     |
| MongoDB connection string formatting errors       | Removed quotes and extra spaces from `.env` file                                |
| Food images not loading in frontend               | Served `public/images/` as static files in Express and updated Atlas image URLs |
| Duplicate payment submissions                     | Backend checks for existing checkout before allowing new submission             |

---

## AI USAGE DISCLOSURE

| Tool               | Used For                       | How It Was Used                                                                                                                                                         |
| ------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude (Anthropic) | Planning, explanations, README | Used for understanding concepts (JWT, Axios, bcryptjs), debugging errors, and generating the README template. All code was written, tested, and understood by the team. |

> All AI-generated content was reviewed, modified, and validated by the team before use. Every team member can explain the submitted code.

---

**Course:** ITEC 60 – Integrated Programming and Technologies I  
**School:** Cavite State University Naic – BSIT
