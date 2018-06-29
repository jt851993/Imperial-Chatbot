require('dotenv').config({silent: true});

var watson = require('./WatsonAssistant');
var functions = require('./js/functions');
var xlsx = require('node-xlsx');

async function main(){
  var userInput = await functions.askQuestion('Hello what is your question?\n');
  while ( userInput != 'exit' ){
    var response = await watson.getResponse( userInput ),
        data = functions.createKVPair( functions, response );
        sheet = functions.getSheet( xlsx.parse(process.env.EXCEL_PATH), data.intents );
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
      console.log("I do not have an answer to your questions, question has been logged.");
      functions.writeToFile(process.env.SAVE_FOLDER,process.env.SAVE_FILE,data);
    }
    else{
      console.log(answer);
    }

    userInput = await functions.askQuestion('Anything Else? \n');
  }
  process.exit();
}

main();
