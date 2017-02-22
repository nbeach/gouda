class TestServer {

    constructor(express, proxy) {
        this._express = express;
        this._proxy = proxy;
        this._server = null;
        this._port = null;
        this._testingEndpoint = null;
        this._targetUrl = null;
    }

    setTargetUrl(targetUrl) {
        this._targetUrl = targetUrl;
        return this;
    }

    setPort(port) {
        this._port = port;
        return this;
    }

    setTestingEndpoint(testingEndpoint) {
        this._testingEndpoint = testingEndpoint;
        return this;
    }

    start() {
        let app = this._express();
        app.use(this._testingEndpoint, this._express.static("test.html"));
        app.use('/', this._proxy({target: this._targetUrl, changeOrigin: true}));
        this._server = app.listen(this._port);
    }

    shutdown() {
        this._server.close();
    }

}

module.exports = TestServer;