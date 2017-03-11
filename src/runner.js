const _ = require('lodash');

module.exports = function() {
    let _reporters = [];
    let _launchers = [];
    let _tests = [];
    let _server = null;
    let _config = null;

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

    this.tests = (tests) => {
        _tests = tests;
        return this;
    };

    this.config = (config) => {
        _config = config;
        return this;
    };

    this.run = () => {
        _server
            .port(_config.port)
            .endpoint(_config.endpoint)
            .target(_config.target)
            .onResult(_onResult)
            .scripts(_tests)
            .start();
    };

};