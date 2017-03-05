module.exports = {
    target: "http://www.nicholasbeach.com",
    endpoint: "/test",
    port: "8000",
    plugins: [
        require('../src/plugins/jqueryPlugin'),
        require('../src/plugins/mocha/mochaPlugin'),
        require('../src/plugins/chaiPlugin')
    ],
    specs: [
      'scripts/bar.js',
      'scripts/foo.js'
    ]
};