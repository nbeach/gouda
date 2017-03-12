const childProcess = require('child_process');

module.exports = function(url) {
    this._childProcess = childProcess;
    let _process;

    this.start = () => {
        _process = this._childProcess.spawn("google-chrome", [
            "--user-data-dir=/tmp/chrome-launcher",
            "--no-default-browser-check",
            "--no-first-run",
            "--disable-default-apps",
            "--disable-translate",
            "--disable-background-timer-throttling",
            "--disable-device-discovery-notifications",
            url]
        );
    };

    this.stop = () => {
        _process.kill();
    };

};




