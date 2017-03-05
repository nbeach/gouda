module.exports = {
    target: "http://localhost:3000",
    endpoint: "/test",
    port: "8000",
    plugins: [
        require('../src/plugins/jqueryPlugin'),
        require('../src/plugins/mocha/mochaPlugin'),
        require('../src/plugins/chaiPlugin')
    ],
    specs: [
      'tests/domReadWriteSpec.js'
    ]
};