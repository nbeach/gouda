const fs = require('fs'),
    express = require('express'),
    proxy = require('http-proxy-middleware'),
    bodyParser = require('body-parser'),
    babel = require('babel-core'),
    TestServer = require("./TestServer"),
    Bootstrap = require("./Bootstrap");
    Runner = require("./Runner");

const testServer = new TestServer(express, proxy, bodyParser);
const runner = new Runner();
const bootstrap = new Bootstrap(fs, babel, runner, testServer);

bootstrap.workingDirectory(process.cwd()).run();