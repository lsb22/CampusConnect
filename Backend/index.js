const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("welcome to my website");
});

app.listen(3000, () => {
  console.log("server is running on 3000");
});
