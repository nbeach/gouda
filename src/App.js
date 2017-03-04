const _ = require('lodash');
function App(fs, babel, testServer) {
    const BABEL_CONFIG = {
        presets: ['es2015']
    };

    let _workingDirectory = "";
    let _scripts = {
        before: [],
        after: []
    };

    const _loadConfiguration = () => require(`${_workingDirectory}/app.config.js`);
    const _readContents = (file) => fs.readFileSync(`${_workingDirectory}/${file}`);
    const _transpile = (script) =>  babel.transform(script, BABEL_CONFIG).code;

    const _beforeScript = (script) => {
        _scripts.before.push(script);
        return this;
    };

    const _afterScript = (script) => {
        _scripts.after.push(script);
        return this;
    };

    const _initPlugins = (plugins) => {
        plugins.forEach(plugin => plugin({
            tests: {
                before: _beforeScript,
                after: _afterScript
            }
        }));
        return this;
    };

    this.workingDirectory = (workingDirectory) => {
        _workingDirectory = workingDirectory;
        return this;
    };

    this.run = () => {
        let config = _loadConfiguration();

        let tests = _.chain(config.files)
            .map(file => _readContents(file))
            .map(script => _transpile(script))
            .value();

        _initPlugins(config.plugins);

        let scripts = [].concat(_scripts.before, tests, _scripts.after);

        testServer
            .port(config.port)
            .endpoint(config.endpoint)
            .target(config.target)
            .scripts(scripts)
            .start();
    };
}

module.exports = App;
