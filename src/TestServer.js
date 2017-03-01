function TestServer(express, proxy) {
    let _server = null,
    _port = null,
    _testingEndpoint = null,
    _targetUrl = null,
    _testJs = null;

    this.target = (targetUrl) => {
        _targetUrl = targetUrl;
        return this;
    };

    this.port = (port) => {
        _port = port;
        return this;
    };

    this.endpoint = (testingEndpoint) => {
        _testingEndpoint = testingEndpoint;
        return this;
    };

    this.script = (testJs) => {
      _testJs = testJs;
      return this;
    };

    this.respond = (req, res) => {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Test Server</title>
            </head>
            <body>
            <h1>TEST SERVER</h1>
            <script>
                ${_testJs}
            </script>
            </body>
            </html>
        `);
    };

    this.start = () => {
        let app = express();
        app.use(_testingEndpoint, this.respond);
        app.use('/', proxy({target: _targetUrl, changeOrigin: true}));
        _server = app.listen(_port);
    };

    this.shutdown = () => {
        _server.close();
    };

}

module.exports = TestServer;