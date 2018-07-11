var stringBundle = require('./StringBundle');
var functions = require('./functions');
var xlsx = require('node-xlsx');

var converse = {
  getReply:async function(env,req){
        var ret = {};
        if( !req.userInput ){
          ret.output = stringBundle.greeting_text;
          return ret;
        }
        else if ( req.userInput && !req.data ){
          var watson = require('./WatsonAssistant');
              response = await watson.getResponse( env , req.userInput )
              keyValue = functions.createKVPair( functions, response );

          if(!keyValue.intent){
            functions.writeToFile(env.SAVE_FOLDER,env.SAVE_FILE,keyValue);
            ret.output = stringBundle.default_answer_text;
            return ret;
          }

          var sheet = functions.getSheet( xlsx.parse( env.EXCEL_PATH ), keyValue.intent );
          if(!sheet){
            functions.writeToFile(env.SAVE_FOLDER,env.SAVE_FILE,keyValue);
            ret.output = stringBundle.default_answer_text;
            return ret;
          }

          var answer = await functions.getAnswer(functions,sheet, keyValue);
          if(!answer){
            functions.writeToFile(env.SAVE_FOLDER,env.SAVE_FILE,keyValue);
            ret.output = stringBundle.default_answer_text;
            return ret;
          }
          return answer;
        }
        else{
          var watson = require('./WatsonAssistant'),
              response = await watson.getResponse( env , req.userInput );
              entities = functions.getEntitiesFromResponse(response);
              matchedEntity = functions.getEntityMatch(entities,req.data.getInputAs);

          var entity = {};
          entity.entity = req.data.getInputAs;
          if(matchedEntity){
            entity.value = matchedEntity;
          }
          else{
            entity.value = req.userInput;
          }
          req.data.entities.push(entity);

          var sheet = functions.getSheet( xlsx.parse( env.EXCEL_PATH ), req.data.intent );
          if(!sheet){
            functions.writeToFile(env.SAVE_FOLDER,env.SAVE_FILE,req.data);
            ret.output = stringBundle.default_answer_text;
            return ret;
          }

          var answer = await functions.getAnswer(functions,sheet, req.data);
          if(!answer){
            functions.writeToFile(env.SAVE_FOLDER,env.SAVE_FILE,req.data);
            ret.output = stringBundle.default_answer_text;
            return ret;
          }
          return answer;
        }
      }
    }

module.exports = converse;
