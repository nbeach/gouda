module.exports = function(express, proxy, bodyParser) {
    let _server = null,
    _port = null,
    _testingEndpoint = null,
    _targetUrl = null,
    _script = null,
    _onResult = null;

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

    this.onResult = (callback) => {
        _onResult = callback;
        return this;
    };

    this.scripts = (scripts) => {
      _script = scripts.map((script) => `<script>${script}</script>`).join("\n");
      return this;
    };

    let _respond = (req, res) => {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Gouda</title>
                <style>
                    html, body, iframe {
                        height: 100%;
                        width: 100%;
                        border: 0;
                        margin: 0;
                        padding: 0;
                    }
                </style>
            </head>
            <body>
            ${_script}
            </body>
            </html>
        `);
    };

    const _result = (req, res) => {
        _onResult(req.body);
        res.send('OK');
    };

    this.start = () => {
        let app = express();
        app.use(bodyParser.json());

        app.use(`${_testingEndpoint}/result`, _result);
        app.use(_testingEndpoint, _respond);
        app.use('/', proxy({target: _targetUrl, changeOrigin: true}));
        _server = app.listen(_port);
    };

    this.shutdown = () => {
        _server.close();
    };

};