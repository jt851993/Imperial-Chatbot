var converse = require('./converse');

var appRouter = function (env,app) {
  app.get("/", function(req, res) {
    res.status(200).send("Welcome to Imperial ChatBot RESTful API");
  });

  app.post('/converse', async function(req, res) {
    var reply = await converse.getReply(env,req.body);
    res.send(reply);
  });
}

module.exports = appRouter;
