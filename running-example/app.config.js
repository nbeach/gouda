module.exports = {
    target: "http://localhost:3000",
    endpoint: "/test",
    port: "8000",
    plugins: [
        require('../src/plugin/jquery-plugin'),
        require('../src/plugin/mocha/mocha-plugin'),
        require('../src/plugin/chai-plugin')
    ],
    specs: [
      'tests/browser-compatibility.spec.js'
    ]
};