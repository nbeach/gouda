module.exports = class AbstractLauncher {

    constructor(process, childProcess, rimraf, uuid) {
        this._childProcess = childProcess;
        this._process = process;
        this._rimraf = rimraf;

        this._tempDirectory = `/tmp/${uuid()}`;
        this._browserProcess = null;
    }

    _tempDir() {
        return this._tempDirectory;
    }

    start() {
        let bin = this._binaryPaths[this._process.platform];
        this._browserProcess = this._childProcess.spawn(bin, this._options);
    }

    stop() {
        this._browserProcess.kill('SIGKILL');
        this._rimraf.sync(this._tempDir())
    }

};

