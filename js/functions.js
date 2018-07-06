var readline = require('readline');
var fs = require('fs');
var csvWriter = require('csv-write-stream');
var stringBundle = require('./StringBundle');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

module.exports = {
  createKVPair:function(functions, response){
    var data ={};
    data.intents = response.intents;
    data.input = response.input.text;
    data.rawEntities = response.entities;

    var formattedEntities = [];
    for(var counter = 0 ; counter < response.entities.length ; counter++){
      var entity = {};
      entity.entity = response.entities[counter].entity;
      entity.value = response.entities[counter].value;
      formattedEntities.push(entity);
    }
    data.entities = formattedEntities;
    return data;
  },

  writeToFile:function(location,file,args){
    if (!fs.existsSync(location)){
      fs.mkdirSync(location);
    }
    fs.stat(file, function(err, stat) {
      var writer = null;
      if(err == null) {
          var writer = csvWriter({sendHeaders: false})
      } else if(err.code == stringBundle.error_code_ENOENT) {
          var writer = csvWriter()
      } else {
          console.log(stringBundle.error_text, err.code);
          return;
      }
      writer.pipe(fs.createWriteStream(file, {flags: stringBundle.csv_flag }))
      writer.write({Question: args.input, Entities: JSON.stringify(args.entities), Intent:JSON.stringify(args.intents), Comments: ""})
      writer.end()
    });
  },

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

  converse:function(sheet, data, functions, callback){
    return new Promise( async (resolve) => {
      var resultArray = sheet.data,
          questions = sheet.data[0];
      for(var counter = 0; counter < questions.length ; counter++){
        var match = functions.getEntityMatch(data.rawEntities, questions[counter]);
        if(!questions[counter] || functions.isAllEmpty(resultArray, counter) ){
          continue;
        }
        else if(match){
          resultArray = callback(resultArray, counter , match);
        }
        else if( questions[counter] == stringBundle.answer_sheetname){
          data.result = resultArray;
          resolve(data);
          break;
        }
        else{
          var answer =  await functions.askQuestion(functions.constructQuestion(questions[counter]));
          var entity = {};
          entity.entity = questions[counter];
          entity.value = answer;
          data.entities.push(entity);
          resultArray = callback(resultArray, counter , answer);
        }
      }
      data.result = resultArray;
      resolve(data);
    })
  },

  askQuestion:function(question) {
    return new Promise((resolve) => {
      rl.question(question, (name) => { resolve(name) })
    })
  },
  constructQuestion:function(string){
    return stringBundle.question_starter_text +
          string.split(stringBundle.sheet_columnName_seperator).join(stringBundle.space_text) +
          stringBundle.question_ender_text;
  },

  constructAnswer:function(array){
    var answer = '';
        firstRow = array[0];

    if(!array || array.length == 1){
      return null;
    }
    for(var counter = 0 ; counter < firstRow.length; counter++){
      if(firstRow[counter] === stringBundle.answer_sheetname){
        for(var counter2 = 1 ; counter2 < array.length; counter2++){
          if(array[counter2][counter] == undefined){
            continue;
          }
          else if(answer == ''){
            answer = array[counter2][counter];
          }
          else{
            answer = answer + stringBundle.or_text + array[counter2][counter]
          }
        }
        if(answer == ''){
            return null;
        }
        return answer;
      }
    }
  }
};
