module.exports = (hooks) => {
    hooks.beforeSpecs.include(`${__dirname}/../../node_modules/jquery/dist/jquery.js`);
};