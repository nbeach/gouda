const _ = require('lodash');

module.exports = function(fs, babel, runner, server, workingDirectory) {
    let _scripts = {
        before: [],
        after: []
    };

    let _reporters = [];

    const _loadConfiguration = () => require(`${workingDirectory}/app.config.js`);
    const _transpile = (script) =>  babel.transform(script, { presets: ['es2015'] }).code;

    const _readContents = (file) => {
        let path = file.startsWith("/") ? file : `${workingDirectory}/${file}`;
        return fs.readFileSync(path);
    };

    const _hooks = {
        beforeSpecs: {
            include: (file) => _scripts.before.push(_readContents(file))
        },
        afterSpecs: {
            include: (file) => _scripts.after.push(_readContents(file))
        },
        reporter: (reporter) => {
           _reporters.push(reporter);
        }
    };

    const _initPlugins = (plugins) => {
        plugins.forEach(plugin => plugin(_hooks));
        return this;
    };

    const _loadScripts = (config) => {
        let specs = _.chain(config.specs)
            .map(file => _readContents(file))
            .map(script => _transpile(script))
            .value();

        let simulant = _readContents(`${__dirname}/../node_modules/simulant/dist/simulant.umd.js`);
        let frameScript = _readContents(`${__dirname}/browser/test-frame.js`);
        return [].concat(simulant, frameScript, _scripts.before, specs, _scripts.after);
    };

    this.run = () => {
        let config = _loadConfiguration();
        _initPlugins(config.plugins);
        let scripts = _loadScripts(config);

        server
            .port(config.port)
            .endpoint(config.endpoint)
            .target(config.target)
            .scripts(scripts);

        runner
            .reporters([require('./reporter/simple-reporter')])
            .server(server)
            .run();
    };
};