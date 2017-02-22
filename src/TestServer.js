function TestServer(express, proxy) {
    let _server = null,
    _port = null,
    _testingEndpoint = null,
    _targetUrl = null;

    this.setTargetUrl = (targetUrl) => {
        _targetUrl = targetUrl;
        return this;
    };

    this.setPort = (port) => {
        _port = port;
        return this;
    };

    this.setTestingEndpoint = (testingEndpoint) => {
        _testingEndpoint = testingEndpoint;
        return this;
    };

    this.start = () => {
        let app = express();
        app.use(_testingEndpoint, express.static("test.html"));
        app.use('/', proxy({target: _targetUrl, changeOrigin: true}));
        _server = app.listen(_port);
    };

    this.shutdown = () => {
        _server.close();
    };

}

module.exports = TestServer;