const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const http = require("http"); // Import http module
const { Server } = require("socket.io"); // Import Server from socket.io
require("dotenv").config();

const { sequelize } = require("./models");
const routes = require("./routes");
const logger = require("./utils/logger");
const errorHandler = require("./utils/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:8080",
      "http://localhost:8081",
      "http://localhost:5173",
    ], // Add your frontend URL
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  },
});

// Make the Socket.IO instance available globally to your Express app
app.set("socketio", io);

// Socket.IO connection handling (for logging/debugging)
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  // You can add more socket listeners here if needed for specific functionalities
  // For example, socket.on('joinRoom', (roomId) => { ... });
});

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// CORS configuration (for Express routes)
const corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:5173",
  ], // Ensure your frontend URL is here
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use(logger);

// Routes
app.use("/api", routes);

// Static files for uploaded content
app.use("/uploads", express.static("uploads"));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Issue Reporting System API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      issues: "/api/issues",
      categories: "/api/categories",
      feedback: "/api/feedback",
      health: "/api/health",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync database (only in development)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("Database synchronized successfully.");
    }

    // Use server.listen instead of app.listen
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
