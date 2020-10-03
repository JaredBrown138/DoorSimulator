/***
 *
 *  A watcher to recompile DoorSim you can use the Live Server VSCode
 *  extension to live reload the html file or extend this file to
 *  provide a simple server.
 *
 *  Jared Brown | 2020
 */


hound = require('hound');
childProcess = require('child_process');

const OCTO_FILE = "./doorsim.8o";
const OCTO_CLI = "./local_packages/Octo/octo"
const OCTO_COMPILE_TARGET = "./doorsim.html"

function compileProgram(cli, octoFile, target, callback){
    var invoked = false;
    var process = childProcess.fork(cli, [octoFile, target]);

    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });
}

watcher = hound.watch(OCTO_FILE);

watcher.on('change', function(file, stats) {
    compileProgram(OCTO_CLI, OCTO_FILE, OCTO_COMPILE_TARGET, function(err){
        if (err){
            console.log(err)
        }else{
            console.log('compile complete');
        }

    })
});
