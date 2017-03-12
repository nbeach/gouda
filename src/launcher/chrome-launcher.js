module.exports = function(ChildProcess, url) {
    let _process;

    this.start = () => {
        _process = ChildProcess.spawn("google-chrome", [
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




