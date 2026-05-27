import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { generalLimiter } from "./Middleware/rateLimiter.js";

// Import all routes
import authRoutes    from "./routes/authRoutes.js";
import menuRoutes    from "./routes/menuRoutes.js";
import orderRoutes   from "./routes/orderRoutes.js";
import reviewRoutes  from "./routes/reviewRoutes.js";
import profileRoutes from "./routes/profileRoute.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";

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
    "https://medjo-fastfood.netlify.app"
  ],
  credentials: true
}));

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





// // import dotenv from "dotenv";
// // import express from "express";
// // import cors from "cors";

// // import notesRoutes from "./routes/notesRoutes.js";
// // import { connectDB } from "./config/db.js";
// // import ratelimit from "./config/upstash.js";
// // import rateLimiter from "./Middleware/rateLimiter.js";


// // dotenv.config();

// // console.log(process.env.MONGO_URI);

// // console.log("URL:", process.env.UPSTASH_REDIS_REST_URL);
// // console.log("TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN?.slice(0, 10));

// // const app = express();
// // const PORT = process.env.PORT || 5001;

// // //middleware
// // app.use(cors({
// //   origin:"http://localhost:5173",
// // }));
// // app.use(express.json()); // this is for parsing the body of the request to json format, so that we can access it in the controller
// // app.use(rateLimiter); // this is for rate limiting, to prevent abuse of the API
// // //our simple custom middleware 
// // // app.use((req, res, next) => {
// // //   console.log(`Req Method is ${req.method} & Req URL is ${req.url}`);
// // //   next();
// // // });

// // app.use("/api/notes", notesRoutes);

// // connectDB().then(() => {  
// // app.listen(PORT, () => {
// //   console.log("Server start on  PORT:", PORT);
// //   }); 
// // });
// // // F9Jvqbu3gpQZQnIZ
// // // mongodb+srv://aejoshcaringal_db_user:F9Jvqbu3gpQZQnIZ@cluster0.vojodag.mongodb.net/?appName=Cluster0