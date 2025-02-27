const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/database");
const routes = require("./routes");

const app = express();
const PORT = 4000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100mb" })); // Adjusted limit
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// API Routes
app.use("/api", routes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
