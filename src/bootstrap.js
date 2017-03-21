const _ = require('lodash');
const path = require('path');

module.exports = function(fs, babel, runner, server, browserLauncher, config, workingDirectory) {
    const _scripts = { before: [], after: [] };
    // const _reporters = [];
    const _hooks = {
        beforeSpecs: {
            include: (file) => _scripts.before.push(_readContents(file))
        },
        afterSpecs: {
            include: (file) => _scripts.after.push(_readContents(file))
        },
        // reporter: (reporter) => _reporters.push(reporter),
        // launcher: (name, constructor) => browserLauncher[name] = constructor
    };
    const _initPlugins = () => config.plugins.forEach(plugin => plugin(_hooks));

    const _transpile = (script) =>  babel.transform(script, { presets: ['es2015'] }).code;
    const _readContents = (file) => fs.readFileSync(file.startsWith("/") ? file : path.join(workingDirectory, file));

    const _getBrowserLaunchers = () => {
        let constructors = [browserLauncher.phantomjs];
        if(config.browsers && config.browsers.length > 0) {
            constructors = config.browsers.map(name => browserLauncher[name]);
        }

        return constructors.map(constructor => new constructor(`http://localhost:${config.port}${config.endpoint}`));
    };

    const _loadScripts = () => {
        let specs = _.chain(config.specs)
            .map(file => _readContents(file))
            .map(script => _transpile(script))
            .value();

        let simulant = _readContents(`${__dirname}/../node_modules/simulant/dist/simulant.umd.js`);
        let frameScript = _readContents(`${__dirname}/browser/test-frame.js`);
        return [].concat(simulant, frameScript, _scripts.before, specs, _scripts.after);
    };

    this.run = () => {
        _initPlugins();
        let scripts = _loadScripts();
        let browserLaunchers = _getBrowserLaunchers();

        server
            .port(config.port)
            .endpoint(config.endpoint)
            .target(config.target)
            .scripts(scripts);

        runner
            .launchers(browserLaunchers)
            .reporters([require('./reporter/simple-reporter')])
            .server(server)
            .run();
    };
};