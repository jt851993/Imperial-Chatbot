var fs = require('fs');
var csvWriter = require('csv-write-stream');
var stringBundle = require('./StringBundle');

module.exports = {
  createKVPair:function(functions, response){
    var data ={};
    if(response.intents && response.intents[0]){
      data.intent = response.intents[0].intent;
    }
    else{
      data.intent = null;
    }
    data.input = response.input.text;
    data.entities = functions.getEntitiesFromResponse(response);
    return data;
  },

  getEntitiesFromResponse:function(res){
    var formattedEntities = [];
    for(var counter = 0 ; counter < res.entities.length ; counter++){
      var entity = {};
      entity.entity = res.entities[counter].entity;
      entity.value = res.entities[counter].value;
      formattedEntities.push(entity);
    }
    return formattedEntities;
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
      writer.write({Question: args.input, Entities: JSON.stringify(args.entities), Intent:JSON.stringify(args.intent), Comments: ""})
      writer.end()
    });
  },

  getSheet:function(sheetArray, intent){
    if(intent){
      for( var counter = 0 ; counter < sheetArray.length ; counter++){
        if(sheetArray[counter].name === intent){
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

  getAnswer:function(functions,sheet,data){
    return new Promise(
      async (resolve) => {
          var sheetEntities = sheet.data[0],
              resultArray = sheet.data;
          for(var counter = 0; counter < sheetEntities.length ; counter++){
            var match = functions.getEntityMatch(data.entities, sheetEntities[counter]);
            if(!sheetEntities[counter] || functions.isAllEmpty(resultArray, counter) ){
              continue;
            }
            else if(match){
              if(!functions.isAllEmpty(resultArray, counter)){
                resultArray = functions.filter(resultArray, counter , match);
              }
            }
            else if( sheetEntities[counter] == stringBundle.answer_sheetname){
              var answer = functions.constructAnswer(resultArray);
              if(answer){
                var ret = {};
                ret.output = answer + '\n' + stringBundle.anything_else_text;
                resolve(ret);
              }
              break;
            }
            else{
              var ret = {};
              ret.output = functions.constructQuestion(sheetEntities[counter]);
              data.getInputAs = sheetEntities[counter];
              ret.data = data;
              resolve(ret);
              break;
            }
          }
          resolve(null);
      }
    );
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
