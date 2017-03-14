const childProcess = require('child_process');
const AbstractLauncher = require('./abstract-launcher');
const rimraf = require('rimraf');
const uuid = require('uuid/v4');

let launcher = function(url) {

    this._binaryPaths = {
        darwin: "/Applications/Firefox.app/Contents/MacOS/firefox",
        linux: "firefox"
    };

    this._options = [
        url,
        "-profile",
        this._tempDir(),
        "-no-remote"
    ];

};

launcher.prototype = new AbstractLauncher(process, childProcess, rimraf, uuid);
module.exports = launcher;