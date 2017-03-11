module.exports = {
    target: "http://localhost:3000",
    endpoint: "/test",
    port: "8000",
    plugins: [
        require('../src/plugins/jquery-plugin'),
        require('../src/plugins/mocha/mocha-plugin'),
        require('../src/plugins/chai-plugin')
    ],
    specs: [
      'tests/browser-compatibility.spec.js'
    ]
};