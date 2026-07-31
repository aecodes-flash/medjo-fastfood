import rateLimit from "express-rate-limit";

// ─── GENERAL LIMITER ────────────────────────────────
// Applies to all routes
// Max 500 requests per 15 minutes per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500,               // max 500 requests
  message: {
    message: "Too many requests, please try again later.",
  },
  standardHeaders: "draft-7", // modern RFC draft-7 RateLimit-* headers
  legacyHeaders: false,
});

// ─── AUTH LIMITER ────────────────────────────────────
// Stricter — applies only to login and register
// Prevents brute force attacks (guessing passwords)
// Max 10 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,                // max 10 login/register attempts
  message: {
    message: "Too many login attempts, please try again after 15 minutes.",
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// ─── ORDER LIMITER ───────────────────────────────────
// Prevents users from spamming orders
// Max 30 orders per hour
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 30,                // max 30 orders per hour
  message: {
    message: "Too many orders placed, please try again later.",
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});