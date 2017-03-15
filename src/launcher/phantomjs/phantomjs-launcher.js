const childProcess = require('child_process');
const AbstractLauncher = require('../abstract-launcher');
const rimraf = require('rimraf');
const path = require('path');
const uuid = require('uuid/v4');
const phantomjs = require('phantomjs-prebuilt');

module.exports = class PhantomJsLauncher extends AbstractLauncher {

    constructor(url) {
        super(process, childProcess, rimraf, uuid);

        this._binaryPaths = {
            darwin: phantomjs.path,
            linux: phantomjs.path
        };

        this._options = [
            path.join(__dirname, 'script.js'),
            url
        ];
    }

};