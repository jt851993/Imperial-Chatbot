var converse = require('./converse');

var appRouter = function (env,app) {
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

  app.post('/converse', async function(req, res) {
    var reply = await converse.getReply(env,req.body);
    res.send(reply);
  });
}

module.exports = appRouter;
