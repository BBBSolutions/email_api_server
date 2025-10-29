import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError";

// Import your routes
import contactRoute from "./routes/contact.route";
import fundstarRoute from "./routes/fundstar.route";
import bbbsolutionsRoute from "./routes/bbbsolutions.route";

// Create the express app
const app = express();

// --- CORS Configuration ---
// (We moved dotenv.config() to server.ts, so process.env is available)
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim());

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman) or if origin is in allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// --- Core Middleware ---
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// --- Routes ---
app.use("/api", contactRoute);
app.use("/api/fundstar", fundstarRoute);
app.use("/api/bbbsolutions", bbbsolutionsRoute);

// --- Utility Routes ---
app.get("/", (req, res) => {
  res.send({ message: "Hello, World!" });
});

app.get("/health", (req, res) => {
  res.status(200).send({ status: "OK" });
});

// --- Global Error Handler ---
// This MUST be the last middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
    });
  }
  console.error("Unhandled Error:", err);
  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

export default app;
