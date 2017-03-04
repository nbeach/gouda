let fs = require('fs');

module.exports = (hooks) => {
    hooks.tests.before(fs.readFileSync(`${__dirname}/../../node_modules/mocha/mocha.js`));
    hooks.tests.before(`
        mocha.setup('bdd');
    `);
    hooks.tests.after(`
        mocha.checkLeaks();
        mocha.run();
    `);
};