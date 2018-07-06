var watson = require('watson-developer-cloud');
var stringBundle = require('./StringBundle');
var text_string = stringBundle.watson_text_text;
module.exports ={
    getResponse:function(env, text) {
      return new Promise((resolve) =>{
                      var assistant = new watson.AssistantV1({
                        username: env.ASSISTANT_USERNAME,
                        password: env.ASSISTANT_PASSWORD,
                        version: env.ASSISTANT_VERSION
                      });
                      assistant.message({
                        workspace_id: process.env.WORKSPACE_ID,
                        input: {text_string: text}
                      },
                      function(err, response)
                          {
                            if (err){
                              resolve(err);
                            }
                            else{
                              resolve(response);
                            }
                          }
                      )});
                    }
}
