module.exports = (hooks) => {
    hooks.before.specs.includeFile(`${__dirname}/../../node_modules/mocha/mocha.js`);
    hooks.before.specs.includeScript(`
        mocha.setup('bdd');
    `);
    hooks.tests.after(`
        mocha.checkLeaks();
        mocha.run();
    `);
};