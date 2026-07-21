import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { generalLimiter } from "./Middleware/rateLimiter.js";
import { getSettings, updateSettings } from "./controllers/settingsController.js";
import { authMiddleware, adminMiddleware } from "./Middleware/authMiddleware.js";

// Import all routes
import authRoutes    from "./routes/authRoutes.js";
import menuRoutes    from "./routes/menuRoutes.js";
import orderRoutes   from "./routes/orderRoutes.js";
import reviewRoutes  from "./routes/reviewRoutes.js";
import profileRoutes from "./routes/profileRoute.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import settingsRoutes from "./routes/settingRoutes.js";
dotenv.config();

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mernfoodapp12.netlify.app" 
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve static images ──────────────────────────────────────
// Place your food images in: backend/public/images/
// Access them at: http://localhost:5001/images/burger1.png
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// General rate limiter on all routes
app.use(generalLimiter);

// All routes
app.use("/api/auth",     authRoutes);     // /api/auth/register, /api/auth/login
app.use("/api/menu",     menuRoutes);     // /api/menu, /api/menu/:id
app.use("/api/orders",   orderRoutes);    // /api/orders, /api/orders/:id
app.use("/api/reviews",  reviewRoutes);   // /api/reviews, /api/reviews/:orderId
app.use("/api/profile",  profileRoutes);  // /api/profile
app.use("/api/checkout", checkoutRoutes); // /api/checkout, /api/checkout/order/:orderId
app.use("/api/settings", settingsRoutes); // GET and UPDATE settings


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error.",
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server start on PORT:", PORT);
  });
});




