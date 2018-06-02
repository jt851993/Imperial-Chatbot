require('dotenv').config({silent: true});

var watson = require('./WatsonAssistant');
var readline = require('readline');
var functions = require('./js/functions');
var functions2 = require('./js/functions2');
var xlsx = require('node-xlsx');

async function main(){
  var userInput = await functions2.askQuestion('Hello what is your question?\n');
  var intent = await watson.getIntent(userInput);

  var sheetArray = xlsx.parse(process.env.EXCEL_PATH);

  var sheet = functions.getSheet(sheetArray,intent);
  var resultArray = functions.converse(sheet, function(array, index, query){
    if(!functions.isAllEmpty(array, index)){
      return functions.filter(array, index, query);
    }
    return array;
  });
  var answer = functions.constructAnswer(resultArray);
  console.log(answer);
  process.exit();
}

main();
