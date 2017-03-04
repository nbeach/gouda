module.exports = {
    target: "http://www.test.com",
    endpoint: "/test-endpoint",
    port: "8000",
    plugins: [
        hooks => hooks.beforeSpecs.include("/before/file.js"),
        hooks => hooks.afterSpecs.include("/after/file.js")
    ],
    specs: ["fooSpec.js", "barSpec.js"]
};