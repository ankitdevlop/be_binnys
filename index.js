const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./utils/database");
const routes = require("./routes");

const app = express();
const PORT = 3000;

connectDB();

app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
}));

app.options("*", cors()); // Handle preflight requests

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: "100mb" }));

const router = express.Router();
app.use("/api", router);
routes(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
