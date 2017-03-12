const childProcess = require('child_process');

module.exports = function(url) {
    this._childProcess = childProcess;
    let _process;

    this.start = () => {
        _process = this._childProcess.spawn("firefox", [url]
        );
    };

    this.stop = () => {
        _process.kill();
    };

};