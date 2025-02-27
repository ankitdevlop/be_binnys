const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./utils/database");
const routes = require("./routes");

const app = express();
const PORT = 4000;

connectDB();

// Debugging Middleware (Check if CORS is applied)
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// CORS Setup
app.use(cors({
  origin: "https://binnysjewelleryfe.netlify.app/", 
  credentials: true, 
}));

// Handle Preflight Requests
app.options("*", cors());

// Additional CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: "100mb" }));

const router = express.Router();
app.use("/api", router);
routes(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
