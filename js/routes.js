var appRouter = function (app) {
  app.get("/", function(req, res) {
    res.status(200).send("Welcome to our restful API");
  });

  app.get("/LOL", function (req, res) {
    var data = ({
      firstName: "jason",
      lastName: "tan"
    });
    res.status(200).send(data);
  });
}

module.exports = appRouter;
