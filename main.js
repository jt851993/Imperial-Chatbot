require('dotenv').config({silent: true});

var watson = require('./js/WatsonAssistant');
var functions = require('./js/functions');
var xlsx = require('node-xlsx');
var stringBundle = require('./js/StringBundle');
var enviroment = process.env;

async function main(){
  var userInput = await functions.askQuestion( stringBundle.greeting_text );
  while ( userInput != stringBundle.exit_text ){
    var response = await watson.getResponse( enviroment , userInput ),
        data = functions.createKVPair( functions, response );
        sheet = functions.getSheet( xlsx.parse( enviroment.EXCEL_PATH ), data.intents );
        answer = null;
    if( sheet ){
      data = await functions.converse(sheet, data, functions, function(array, index, query){
        if(!functions.isAllEmpty(array, index)){
          return functions.filter(array, index, query);
        }
        return array;
      });
      answer = functions.constructAnswer(data.result);
    }

    if(answer== null){
      console.log(stringBundle.default_answer_text);
      functions.writeToFile(enviroment.SAVE_FOLDER,enviroment.SAVE_FILE,data);
    }
    else{
      console.log(answer);
    }

    userInput = await functions.askQuestion( stringBundle.anything_else_text );
  }
  process.exit();
}

main();
