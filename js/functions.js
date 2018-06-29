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
    if(criteria.length==0){
        criteria=undefined;
    }
    var newArray = [twoDimentionArrayToBeFiltered[0]];
    for( var counter = 1 ; counter < twoDimentionArrayToBeFiltered.length ; counter++ ){
      var data = twoDimentionArrayToBeFiltered[counter][index];
      if(criteria == undefined &&  data == criteria){
        newArray.push(twoDimentionArrayToBeFiltered[counter]);
      }
      else if( data != undefined && criteria != undefined){
        var item = String(data);
        var item2 = criteria.toString().toLowerCase().trim();
        if( item && item.toLowerCase().trim() == item2){
          newArray.push(twoDimentionArrayToBeFiltered[counter]);
        }
      }
    }
    return newArray;
  },

  getEntityMatch:function(listOfEntity, searchString){
    var answer = null;
    if(listOfEntity && searchString){
      for(var counter = 0 ; counter < listOfEntity.length ; counter++ ){
        if(listOfEntity[counter].entity == searchString){
          if(answer == null){
            answer = listOfEntity[counter].value;
          }
          else{
            return null;
          }
        }
      }
    }
    return answer;
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
          if(array[counter2][counter] == undefined){
            continue;
          }
          else if(answer == ''){
            answer = array[counter2][counter];
          }
          else{
            answer = answer + " or " + array[counter2][counter]
          }
        }
        if(answer == ''){
            return "No answer found";
        }
        return answer;
      }
    }
  }
};
