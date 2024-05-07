const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(moragan("dev"));
app.use("/admin", require("./routes/adminRoutes"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.DEV_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});
