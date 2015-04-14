/**
@author Michael Murphy
*/
if (!process.execArgv.some(function(a){ return a === '--harmony'})) {
   var childArgs = process.argv;
   childArgs[0] = '--harmony';
   var spawn = require('child_process').spawn;
   var child = spawn(process.execPath, childArgs, {stdio:'inherit', detached:true});
   //child.unref();
   process.exit();
}