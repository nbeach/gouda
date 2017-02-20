var config = {
    basePath: "",
    singleRun: true,
    colors: true,
    autoWatch: false,
    files: [
        "node_modules/jquery/dist/jquery.js",
        "src/Framer.js",
        "test/lib/**/*.js",
        "test/**/*Spec.js"
    ],
    reporters: ["progress"],
    browsers: ["Chrome", "Firefox", "Safari", "PhantomJS"],
    frameworks: ["mocha", "chai"],
    proxies: {
        '/target': 'http://localhost:8080'
    },
    client: {
        mocha: {
            timeout: 30000
        }
    }
    // customLaunchers: {
    //     "chrome-no-security": {
    //         base: 'Chrome',
    //         flags: ['--disable-web-security']
    //     }
    // },

};

module.exports = function (karmaConfig) {
    config.logLevel = karmaConfig.LOG_ERROR;
    karmaConfig.set(config);
};
