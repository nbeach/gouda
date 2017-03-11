const _ = require('lodash');

module.exports = function() {
    let _reporters = [];
    let _launchers = [];
    let _server = null;

    const _onResult = (result) => {
        _reporters.forEach(reporter => reporter(result));
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

};