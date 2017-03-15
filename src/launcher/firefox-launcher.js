const childProcess = require('child_process');
const AbstractLauncher = require('./abstract-launcher');
const rimraf = require('rimraf');
const uuid = require('uuid/v4');

module.exports = class FirefoxLauncher extends AbstractLauncher{

    constructor(url) {
        super(process, childProcess, rimraf, uuid);

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

    }

};