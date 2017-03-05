const _ = require('lodash');
function App(fs, babel, testServer) {
    let _workingDirectory = "";
    let _scripts = {
        before: [],
        after: []
    };

    const BABEL_CONFIG = {
        presets: ['es2015']
    };

    const _loadConfiguration = () => require(`${_workingDirectory}/app.config.js`);
    const _transpile = (script) =>  babel.transform(script, BABEL_CONFIG).code;

    const _readContents = (file) => {
        let path = file.startsWith("/") ? file : `${_workingDirectory}/${file}`;
        return fs.readFileSync(path);
    };

    const _hooks = {
        beforeSpecs: {
            include: (file) => _scripts.before.push(_readContents(file))
        },
        afterSpecs: {
            include: (file) => _scripts.after.push(_readContents(file))
        }
    };

    const _initPlugins = (plugins) => {
        plugins.forEach(plugin => plugin(_hooks));
        return this;
    };

    this.workingDirectory = (workingDirectory) => {
        _workingDirectory = workingDirectory;
        return this;
    };

    this.run = () => {
        let config = _loadConfiguration();
        _initPlugins(config.plugins);

        let specs = _.chain(config.specs)
            .map(file => _readContents(file))
            .map(script => _transpile(script))
            .value();

        let simulant = _readContents(`${__dirname}/../node_modules/simulant/dist/simulant.umd.js`);
        let frameScript = _readContents(`${__dirname}/browser/testFrame.js`);
        let scripts = [].concat(simulant, frameScript, _scripts.before, specs, _scripts.after);

        testServer
            .port(config.port)
            .endpoint(config.endpoint)
            .target(config.target)
            .scripts(scripts)
            .start();
    };
}

module.exports = App;
