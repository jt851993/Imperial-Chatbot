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
  prompt:function(question, callback) {
    var stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    stdin.once('data', function (data) {
        callback(data.toString().trim());
    });
  },
  converse:function(sheet, filter, isEmpty, callback){
    var firstRow = sheet.data[0];
        resultArray = sheet.data,
        answer = '';

    if(!isEmpty(resultArray,0)){
      resultArray = filter(resultArray, 0, 'Benelux');
    }
    if(!isEmpty(resultArray,1)){
      resultArray = filter(resultArray, 1, '0007');
    }
    if(!isEmpty(resultArray,2)){
      resultArray = filter(resultArray, 2, 'WHAT');
    }
    console.log(resultArray);
    for(var counter = 0 ; counter < firstRow.length; counter++){
      if(firstRow[counter] === 'Answer'){
        for(var counter2 = 1 ; counter2 < resultArray.length; counter2++){
          if(answer == ''){
            answer = resultArray[counter2][counter];
          }
          else{
            answer = answer + " or " + resultArray[counter2][counter]
          }
        }
        return answer;
      }
    }
  }
};
