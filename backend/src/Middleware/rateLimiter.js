import rateLimit from "express-rate-limit";

// ─── GENERAL LIMITER ────────────────────────────────
// Applies to all routes
// Max 100 requests per 15 minutes per user
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests
  message: {
    message: "Too many requests, please try again later."
  },
  standardHeaders: true,     // sends rate limit info in headers
  legacyHeaders: false,
});

// ─── AUTH LIMITER ────────────────────────────────────
// Stricter — applies only to login and register
// Prevents brute force attacks (guessing passwords)
// Max 5 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // only 10 login/register attempts
  message: {
    message: "Too many login attempts, please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── ORDER LIMITER ───────────────────────────────────
// Prevents users from spamming orders
// Max 30 orders per hour
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,                   // max 30 orders per hour
  message: {
    message: "Too many orders placed, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});