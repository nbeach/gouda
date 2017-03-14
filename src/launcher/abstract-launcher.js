module.exports = function(process, childProcess, rimraf, uuid) {
    this._childProcess = childProcess;
    this._process = process;
    this._rimraf = rimraf;

    let tempDir = `/tmp/${uuid()}`;
    let _browserProcess;

    this._tempDir = function() {
        return tempDir;
    };

    this.start = function() {
        let bin = this._binaryPaths[this._process.platform];
        _browserProcess = this._childProcess.spawn(bin, this._options);
    };

    this.stop = function() {
        _browserProcess.kill('SIGKILL');
        this._rimraf.sync(this._tempDir())
    };
};
