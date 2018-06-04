require('dotenv').config({silent: true});

var watson = require('./WatsonAssistant');
var functions = require('./js/functions');
var xlsx = require('node-xlsx');

async function main(){
  var userInput = await functions.askQuestion('Hello what is your question?\n');
  while (userInput != 'exit'){
    var intent = await watson.getIntent(userInput);
    if(intent === "undefined"){
      console.log("Did not understand question");
    }
    else
    {
      var sheetArray = xlsx.parse(process.env.EXCEL_PATH);
      var sheet = functions.getSheet(sheetArray,intent);
      var resultArray = await functions.converse(sheet, functions, function(array, index, query){
        if(!functions.isAllEmpty(array, index)){
          return functions.filter(array, index, query);
        }
        return array;
      });
      var answer = functions.constructAnswer(resultArray);
      console.log(answer);
    }
    userInput = await functions.askQuestion('Anything Else? \n');
  }
  process.exit();
}

main();
