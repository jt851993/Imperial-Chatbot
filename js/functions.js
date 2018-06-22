var readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

module.exports = {
  getSheet:function(sheetArray, intent){
    if(intent && intent[0]){
      for( var counter = 0 ; counter < sheetArray.length ; counter++){
        if(sheetArray[counter].name === intent[0].intent){
          return sheetArray[counter];
        }
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
      if(twoDimentionArrayToBeFiltered[counter][index] == criteria){
        newArray.push(twoDimentionArrayToBeFiltered[counter]);
      }
    }
    return newArray;
  },

  getEntityMatch:function(listOfEntity, searchString){
    if(listOfEntity && searchString){
      for(var counter = 0 ; counter < listOfEntity.length ; counter++ ){
        if(listOfEntity[counter].entity == searchString){
          return listOfEntity[counter].value;
        }
      }
    }
    return null;
  },

  converse:function(sheet, arguments, functions, callback){
    return new Promise( async (resolve) => {
      var resultArray = sheet.data,
          questions = sheet.data[0];
      for(var counter = 0; counter < questions.length ; counter++){
        var match = functions.getEntityMatch(arguments, questions[counter]);
        if(!questions[counter] || functions.isAllEmpty(resultArray, counter) ){
          continue;
        }
        else if(match){
          resultArray = callback(resultArray, counter , match);
        }
        else if( questions[counter] == 'Answer'){
          resolve(resultArray);
          break;
        }
        else{
          var answer =  await functions.askQuestion(functions.constructQuestion(questions[counter]));
          resultArray = callback(resultArray, counter , answer);
        }
      }
      resolve(resultArray);
    })
  },

  askQuestion:function(question) {
    return new Promise((resolve) => {
      rl.question(question, (name) => { resolve(name) })
    })
  },
  constructQuestion:function(string){
    return "What is the "+ string.split('_').join(' ') + "?\n";
  },

  constructAnswer:function(array){
    var firstRow = array[0];
        answer = '';
    if(array.length == 1){
      return "No answer found";
    }
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
