module.exports = (hooks) => {
    hooks.beforeSpecs.include(`${__dirname}/../../node_modules/chai/chai.js`);
};