var readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

module.exports={
  askQuestion:function(question) {
    return new Promise((resolve) => {
      rl.question(question, (name) => { resolve(name) })
    })
  }
}
