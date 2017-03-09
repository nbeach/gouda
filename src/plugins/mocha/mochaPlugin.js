module.exports = (hooks) => {
    hooks.beforeSpecs.include(`${__dirname}/../../../node_modules/mocha/mocha.js`);
    hooks.beforeSpecs.include(`${__dirname}/../../../node_modules/axios/dist/axios.min.js`);
    hooks.beforeSpecs.include(`${__dirname}/before.js`);
    hooks.afterSpecs.include(`${__dirname}/after.js`);
};