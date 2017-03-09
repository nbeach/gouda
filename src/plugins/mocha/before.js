(function () {
    mocha.setup('bdd');
    beforeEach(testFrame.setup);
    afterEach(testFrame.teardown);

    var reporter = function (runner) {
        var sendResult = function(data) {
            axios.post('/test/result', data);
        };

        var _passes = 0;
        var _failures = 0;

        runner.on('pass', function (test) {
            _passes++;
            sendResult({ state: test.state, name: test.fullTitle() });
        });

        runner.on('fail', function (test, err) {
            _failures++;
            sendResult({ state: test.state, name: test.fullTitle() });
        });

        runner.on('end', function () {
            sendResult({ state: 'finished', passes: _passes, failures: _failures });
        });
    };

    mocha.reporter(reporter, {});
})();
