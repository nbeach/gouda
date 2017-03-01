const _ = require('lodash');

function Testinator(scriptLoader, testServer) {
    let _workingDirectory = "";

    let _loadConfiguration = () => {
        return require(`${_workingDirectory}/testinator.config.js`);
    };

    this.workingDirectory = (workingDirectory) => {
        _workingDirectory = workingDirectory;
        return this;
    };

    this.run = () => {
        let config = _loadConfiguration();
        let scripts = scriptLoader.load(config.files);

        testServer
            .port(config.port)
            .endpoint(config.endpoint)
            .target(config.target)
            .script(scripts)
            .run();
    };
}

module.exports = Testinator;
