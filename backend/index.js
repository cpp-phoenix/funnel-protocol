const express = require("express");
require('dotenv').config();

const app = express();
const port = 3000;

const bridgeRouter = require("./routes/bridgeRouter")

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/bridge", bridgeRouter);

app.listen(port, () => {
  console.log(`up and running on port ${port}!`);
});

