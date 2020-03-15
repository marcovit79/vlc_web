

var fs = require('fs');

const path = __dirname + '/../node_modules/cloudcmd/dist/modules/operation.js';

console.log("PATCHING", path);
fs.readFile( path, function (err, data) {
  if (err) {
    throw err; 
  }

  let content = data.toString();
  let newContent = content.replace('fileop({prefix:e', 'fileop({prefix:\'\'');
  

  fs.writeFile(path, newContent, function(err) {
    if(err) {
        throw err; 
    }
    console.log("DONE");
  }); 

});

