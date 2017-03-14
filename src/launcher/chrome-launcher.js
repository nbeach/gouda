const childProcess = require('child_process');
const AbstractLauncher = require('./abstract-launcher');
const rimraf = require('rimraf');
const uuid = require('uuid/v4');

let launcher = function(url) {

    this._binaryPaths =  {
        darwin: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
        linux: "google-chrome"
    };

    this._options = [
        `--user-data-dir=${this._tempDir()}`,
        "--no-default-browser-check",
        "--no-first-run",
        "--disable-default-apps",
        "--disable-translate",
        "--disable-background-timer-throttling",
        "--disable-device-discovery-notifications",
        url
    ];

};

launcher.prototype = new AbstractLauncher(process, childProcess, rimraf, uuid);
module.exports = launcher;