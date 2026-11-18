/**
 * @swagger
 * {
 *   "/": {
 *     "get": {
 *       "tags": [
 *         "Utilities"
 *       ],
 *       "summary": "API welcome message",
 *       "description": "Returns links to documentation and application health.",
 *       "security": [],
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation.",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "success": {
 *                     "type": "boolean"
 *                   },
 *                   "message": {
 *                     "type": "string"
 *                   },
 *                   "documentation": {
 *                     "type": "string",
 *                     "example": "/api-docs"
 *                   },
 *                   "health": {
 *                     "type": "string",
 *                     "example": "/health"
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         },
 *         "429": {
 *           "$ref": "#/components/responses/Error429"
 *         },
 *         "500": {
 *           "$ref": "#/components/responses/Error500"
 *         }
 *       }
 *     }
 *   },
 *   "/health": {
 *     "get": {
 *       "tags": [
 *         "Utilities"
 *       ],
 *       "summary": "Application health",
 *       "description": "Returns application status, timestamp, and environment. Does not verify database connectivity.",
 *       "security": [],
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation.",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "success": {
 *                     "type": "boolean"
 *                   },
 *                   "message": {
 *                     "type": "string"
 *                   },
 *                   "timestamp": {
 *                     "type": "string",
 *                     "format": "date-time"
 *                   },
 *                   "environment": {
 *                     "type": "string",
 *                     "example": "development"
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         },
 *         "429": {
 *           "$ref": "#/components/responses/Error429"
 *         },
 *         "500": {
 *           "$ref": "#/components/responses/Error500"
 *         }
 *       }
 *     }
 *   },
 *   "/api-docs": {
 *     "get": {
 *       "tags": [
 *         "Utilities"
 *       ],
 *       "summary": "Swagger UI",
 *       "description": "Interactive API documentation. Open this URL in a browser.",
 *       "security": [],
 *       "responses": {
 *         "200": {
 *           "description": "Swagger UI HTML page.",
 *           "content": {
 *             "text/html": {
 *               "schema": {
 *                 "type": "string"
 *               }
 *             }
 *           }
 *         },
 *         "301": {
 *           "description": "Redirect to the trailing-slash documentation URL."
 *         },
 *         "429": {
 *           "$ref": "#/components/responses/Error429"
 *         }
 *       }
 *     }
 *   }
 * }
 */
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
const connectDB = require("./config/db");
const auth = require("./routes/auth");
const equipment = require("./routes/equipment");
const rentals = require("./routes/rentals");

dotenv.config({ path: "./config/config.env" });

if (process.env.MONGO_URI) {
  connectDB().catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
  });
}

const app = express();

// Vercel overwrites X-Forwarded-For at its proxy. Trust that one hop so
// Express uses the client address for rate limiting instead of the proxy IP.
if (process.env.VERCEL === "1") app.set("trust proxy", 1);

app.use(helmet());
// Include CORS headers on rejected requests too, including rate-limit errors.
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:3000",
  credentials: true,
}));
app.use(hpp());
app.use(rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later.",
  },
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api/v1", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(503).json({
      success: false,
      error: "Database unavailable. Please try again later.",
    });
  }
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/equipment", equipment);
app.use("/api/v1/rentals", rentals);

const swaggerDocs = process.env.VERCEL === "1" ? undefined : require("./config/swagger")();
app.get(/^\/api-docs$/, (req, res) => res.redirect(301, "/api-docs/"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs,
  process.env.VERCEL === "1" ? { swaggerOptions: { url: "/api-docs/openapi.json" } } : {}));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Equipment Rental API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Equipment Rental API",
    documentation: "/api-docs",
    health: "/health",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, process.env.HOST || "0.0.0.0", () => {
  console.log(`Equipment Rental API running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.error(`Unhandled rejection: ${error.message}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
  console.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

// Vercel's CommonJS entry point expects the Express function itself.
// Keep named properties for the local demo runner and startup test.
module.exports = app;
module.exports.app = app;
module.exports.server = server;
