function TestServer(express, proxy) {
    let _server = null,
    _port = null,
    _testingEndpoint = null,
    _targetUrl = null,
    _script = null;

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

    this.scripts = (scripts) => {
      _script = scripts.map((script) => `<script>${script}</script>`).join("\n");
      return this;
    };

    this.respond = (req, res) => {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Test Server</title>
                  <link href="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css" rel="stylesheet" />
            </head>
            <body>
            <div id="mocha"></div>
            
            ${_script}
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