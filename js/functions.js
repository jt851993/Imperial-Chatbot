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
    var newArray = [];
    console.log("find " + criteria);
    for( var counter = 0 ; counter < twoDimentionArrayToBeFiltered.length ; counter++ ){
      if(twoDimentionArrayToBeFiltered[counter][index] === criteria){
        newArray.push(twoDimentionArrayToBeFiltered[counter]);
      }
    }
    console.log("found " + criteria);
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
  converse:function(sheet, filter, callback){
    var firstRow = sheet.data[0];
        resultArray = [],
        answer = null;

    resultArray = filter(sheet.data, 0, 'Benelux');
    resultArray = filter(sheet.data, 1, '0007');

    for(var counter = 0 ; counter < firstRow.length; counter++){
      if(firstRow[counter] === 'Answer'){
        for(var counter2 = 0 ; counter2 < resultArray.length; counter2++){
          if(answer == null){
            answer = resultArray[counter2][counter];
          }
          else{
            answer = answer + " or " + resultArray[counter2][counter]
          }
        }
        console.log(answer);
      }
    }
  }
};
