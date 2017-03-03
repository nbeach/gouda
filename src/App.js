const _ = require('lodash');
function App(babel, scriptLoader, testServer) {
    let _workingDirectory = "";
    const babelConfig = {
        presets: ['es2015']
    };

    scriptLoader.transform((source) => {
        return babel.transform(source, babelConfig).code;
    });

    let _loadConfiguration = () => {
        return require(`${_workingDirectory}/app.config.js`);
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
            .start();
    };
}

module.exports = App;
