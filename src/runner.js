const _ = require('lodash');

module.exports = function(process) {
    let _reporters = [];
    let _launchers = [];
    let _server = null;
    let _failures = 0;

    const _onResult = (result) => {
        _reporters.forEach(reporter => reporter(result));

        if(result.state === 'failed') {
            _failures++;
        } else if(result.state === "finished") {
            _server.shutdown();
            process.exit(_failures > 0 ? 1 : 0);
        }
    };

    this.server = (server) => {
        _server = server;
        return this;
    };

    this.launchers = (launchers) => {
        _launchers = launchers;
        return this;
    };

    this.reporters = (reporters) => {
        _reporters = reporters;
        return this;
    };

    this.run = () => {
        _server
            .onResult(_onResult)
            .start();
    };

    // _server.close();
    // process.exit(req.body.failures > 0 ? 1 : 0);

};