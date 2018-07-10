var stringBundle = require('./StringBundle');
var functions = require('./functions');
var xlsx = require('node-xlsx');

var converse = {
  getReply:async function(env,req){
        if( !req.userInput ){
          return stringBundle.greeting_text;
        }
        else if ( req.userInput && !req.data ){
          var watson = require('./WatsonAssistant');
              response = await watson.getResponse( env , req.userInput )
              keyValue = functions.createKVPair( functions, response );
              sheet = functions.getSheet( xlsx.parse( env.EXCEL_PATH ), keyValue.intent );
          if(!sheet){
            console.log(stringBundle.default_answer_text);
            functions.writeToFile(env.SAVE_FOLDER,env.SAVE_FILE,keyValue);
          }
          var answer = await functions.getAnswer(functions,sheet, keyValue);

          return answer;
        }
        else{
          return "lol" ;
        }
      }
    }

module.exports = converse;
