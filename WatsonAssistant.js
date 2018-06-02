require('dotenv').config({silent: true});

var watson = require('watson-developer-cloud');
var functions = require('./js/functions');

var assistant = new watson.AssistantV1({
  username: process.env.ASSISTANT_USERNAME,
  password: process.env.ASSISTANT_PASSWORD,
  version: process.env.ASSISTANT_VERSION
});

module.exports ={
    getIntent:function(text) {
      return new Promise((resolve) =>{
                      assistant.message({
                        workspace_id: process.env.WORKSPACE_ID,
                        input: {'text': text}
                      },
                      function(err, response)
                          {
                            if (err){
                              resolve(err);
                            }
                            else{
                              resolve(JSON.parse(response.output.text[0]).type);
                            }
                          }
                      )});
                    }
}
