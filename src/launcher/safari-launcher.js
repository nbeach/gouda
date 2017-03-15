const childProcess = require('child_process');
const AbstractLauncher = require('./abstract-launcher');
const rimraf = require('rimraf');
const uuid = require('uuid/v4');

module.exports = class SafariLauncher extends AbstractLauncher{

    constructor(url) {
        super(process, childProcess, rimraf, uuid);

        this._binaryPaths =  {
            darwin: "open"
        };

        this._options = [
            "-a",
            "Safari",
            url]
        ;
    }

    //TODO: Dehackify this
    stop() {
        this._childProcess.spawn("killall", ["Safari"]);
    };
};