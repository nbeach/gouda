let fs = require('fs');

module.exports = (hooks) => {
    hooks.tests.before(fs.readFileSync(`${__dirname}/../../node_modules/chai/chai.js`));
};