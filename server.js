require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const routes = require("./routes")
routes(app);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});