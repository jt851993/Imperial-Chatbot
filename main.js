require('dotenv').config({silent: true});

var watson = require('./WatsonAssistant');
var functions = require('./js/functions');
var xlsx = require('node-xlsx');

async function main(){
  var userInput = await functions.askQuestion('Hello what is your question?\n');
  while (userInput != 'exit'){
    var response = await watson.getResponse(userInput),
        data = functions.createKVPair( functions, response );
        sheet = functions.getSheet( xlsx.parse(process.env.EXCEL_PATH), data.intents )

    if(!sheet){
      console.log("I do not have an answer to your questions, question has been logged.");
      functions.writeToFile(process.env.SAVE_FOLDER,process.env.SAVE_FILE,data);
    }
    else{
      data = await functions.converse(sheet, data, functions, function(array, index, query){
        if(!functions.isAllEmpty(array, index)){
          return functions.filter(array, index, query);
        }
        return array;
      });
      var answer = functions.constructAnswer(data);
      if(answer=="No answer found"){
          functions.writeToFile('./dump','./dump/questions.csv',data);
      }
      console.log(answer);
    }
    userInput = await functions.askQuestion('Anything Else? \n');
  }
  process.exit();
}

main();
