var stringBundle = require('./StringBundle');
var functions = require('./functions');
var xlsx = require('node-xlsx');
var watson = require('./WatsonAssistant');

var converse = {
  getReply:async function(env,req){
        if( !req.userInput ){
          var ret = {};
          ret.output = stringBundle.greeting_text;
          return ret;
        }
        else if ( req.userInput && !req.data ){
          var response = await watson.getResponse( env , req.userInput )
              keyValue = functions.createKVPair( functions, response );

          return formatAnswer(env, keyValue.intent, keyValue);
        }
        else{
          var response = await watson.getResponse( env , req.userInput );
              entities = functions.getEntitiesFromResponse(response);
              entity = {};

          entity.entity = req.data.getInputAs;
          entity.value = getMatchedEntity(req);
          req.data.entities.push(entity);

          return formatAnswer(env, req.data.intent, req.data);
        }
      }
    }

function getMatchedEntity(req){
  var matchedEntity = functions.getEntityMatch(entities,req.data.getInputAs);
  if(matchedEntity){
    return matchedEntity;
  }
  return req.userInput;
}

async function formatAnswer(env,intent,data){
    var sheet = functions.getSheet( xlsx.parse( env.EXCEL_PATH ), intent );
    if(!sheet){
      return saveToFile(env,data);
    }
    var answer = await functions.getAnswer(functions, sheet , data);
    if(!answer){
      return saveToFile(env,data);
    }

    return answer;
}

function saveToFile(env, data){
  var ret ={};
  functions.writeToFile(env.SAVE_FOLDER,env.SAVE_FILE,data);
  ret.output = stringBundle.default_answer_text + '\n' + stringBundle.anything_else_text;
  return ret;
}

module.exports = converse;
