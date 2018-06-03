var readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

module.exports = {
  getSheet:function(sheetArray, sheetName){
    for( var counter = 0 ; counter < sheetArray.length ; counter++){
      if(sheetArray[counter].name === sheetName){
        return sheetArray[counter];
      }
    }
    return null;
  },

  isAllEmpty:function(twoDimensionArray, index){
    var startCheckIndex = 1;
    for( var counter = startCheckIndex ; counter < twoDimensionArray.length ; counter++ ){
      if(twoDimensionArray[counter][index] != undefined && twoDimensionArray[counter][index] != null ){
        return false;
      }
    }
    return true;
  },

  filter:function(twoDimentionArrayToBeFiltered, index, criteria){
    var newArray = [twoDimentionArrayToBeFiltered[0]];
    for( var counter = 1 ; counter < twoDimentionArrayToBeFiltered.length ; counter++ ){
      if(twoDimentionArrayToBeFiltered[counter][index] === criteria){
        newArray.push(twoDimentionArrayToBeFiltered[counter]);
      }
    }
    return newArray;
  },

  converse:function(sheet, functions, callback){
    return new Promise( async (resolve) => {
      var resultArray = sheet.data;
      var questions = sheet.data[0];
      for(var counter = 0; counter < questions.length ; counter++){
        if(!questions[counter] ){
          continue;
        }
        else if( questions[counter] == 'Answer'){
          resolve(resultArray);
          break;
        }
        var answer =  await functions.askQuestion(questions[counter] + "\n");
        resultArray = callback(resultArray, counter , answer);
      }
      resolve(resultArray);
    })
  },

  askQuestion:function(question) {
    return new Promise((resolve) => {
      rl.question(question, (name) => { resolve(name) })
    })
  },

  constructAnswer:function(array){
    var firstRow = array[0];
        answer = '';
    for(var counter = 0 ; counter < firstRow.length; counter++){
      if(firstRow[counter] === 'Answer'){
        for(var counter2 = 1 ; counter2 < array.length; counter2++){
          if(answer == ''){
            answer = array[counter2][counter];
          }
          else{
            answer = answer + " or " + array[counter2][counter]
          }
        }
        return answer;
      }
    }
  }
};
