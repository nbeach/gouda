module.exports = {
    target: "http://www.test.com",
    endpoint: "/test-endpoint",
    port: "8000",
    plugins: [
        hooks => hooks.tests.before("console.log('before');"),
        hooks => hooks.tests.after("console.log('after');")
    ],
    files: ["fooSpec.js", "barSpec.js"]
};