require('dotenv').config({silent: true});

var xlsx = require('node-xlsx');
var functions = require('./js/functions');
var watson = require('watson-developer-cloud');

var assistant = new watson.AssistantV1({
  username: process.env.ASSISTANT_USERNAME,
  password: process.env.ASSISTANT_PASSWORD,
  version: process.env.ASSISTANT_VERSION
});

var sheetArray = xlsx.parse(process.env.EXCEL_PATH); // parses a file to array of sheets

functions.prompt('Hello what is your question?\n', function (input) {
  assistant.message({
                      workspace_id: process.env.WORKSPACE_ID,
                      input: {'text': input}
                    },
                    function(err, response)
                        {
                          if (err){
                            console.log('error:', err);
                          }
                          else{
                            var json = JSON.parse(response.output.text[0]);
                            var sheet = functions.getSheet(sheetArray,json.type);
                            var resultArray = functions.converse(sheet,functions.filter,functions.isAllEmpty, null);
                            var answer = functions.constructAnswer(resultArray);
                            console.log(answer);
                          }
                          process.exit();
                        }
                    );
});


//console.log(functions.filter(sheetDataArray, 0, 'Benelux'));
//console.log(functions.isAllEmpty(functions.getSheet(sheetArray,'Org Unit').data, 3));
