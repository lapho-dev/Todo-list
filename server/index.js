const express = require("express");
const app = express();
const cors = require("cors");


const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).send({
    message: "Hello World!",
  });
});

app.listen(port, () => {
  console.log("Listening on " + port);
});

module.exports = app;