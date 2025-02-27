const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./utils/database");
const routes = require("./routes");

const app = express();
const PORT = 4000;

connectDB();

app.use(cors());
app.use(express.json({ limit: "1000mb" }))
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: "100mb" }));



const router = express.Router();
app.use("/api", router);
routes(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
