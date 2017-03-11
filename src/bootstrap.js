const _ = require('lodash');

module.exports = function(fs, babel, runner, server, workingDirectory) {
    let _scripts = {
        before: [],
        after: []
    };

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
        }
    };

    const _initPlugins = (plugins) => {
        plugins.forEach(plugin => plugin(_hooks));
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
        let frameScript = _readContents(`${__dirname}/browser/test-frame.js`);
        let scripts = [].concat(simulant, frameScript, _scripts.before, specs, _scripts.after);

        runner
            .config(config)
            .server(server)
            .tests(scripts)
            .run();
    };
};