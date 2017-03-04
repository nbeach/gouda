module.exports = {
    target: "http://www.nicholasbeach.com",
    endpoint: "/test",
    port: "8000",
    plugins: [
        require('../src/plugins/mochaPlugin'),
        require('../src/plugins/chaiPlugin')
    ],
    files: [
      'scripts/foo.js',
      'scripts/bar.js'
    ]
};