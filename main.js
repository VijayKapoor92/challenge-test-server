const bodyParser = require("body-parser");
const routes = require("./routes")
const port = 8080;

module.exports = app => {
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );

  routes(app);

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  });
}