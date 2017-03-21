const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    proxy = require('http-proxy-middleware'),
    bodyParser = require('body-parser'),
    babel = require('babel-core'),
    Server = require("./server"),
    Bootstrap = require("./bootstrap"),
    Runner = require("./runner");

const browserLaunchers = {
    'chrome': require('./launcher/chrome-launcher'),
    'firefox': require('./launcher/firefox-launcher'),
    'safari': require('./launcher/safari-launcher'),
    'phantomjs': require('./launcher/phantomjs/phantomjs-launcher')
};

const config = require(path.join(process.cwd(), 'app.config.js'));

const testServer = new Server(express, proxy, bodyParser);
const runner = new Runner(process);
const bootstrap = new Bootstrap(fs, babel, runner, testServer, browserLaunchers, config, process.cwd());

bootstrap.run();