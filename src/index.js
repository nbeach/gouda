const fs = require('fs'),
    express = require('express'),
    proxy = require('http-proxy-middleware'),
    bodyParser = require('body-parser'),
    babel = require('babel-core'),
    Server = require("./server"),
    Bootstrap = require("./bootstrap");
    Runner = require("./runner");

const testServer = new Server(express, proxy, bodyParser);
const runner = new Runner();
const bootstrap = new Bootstrap(fs, babel, runner, testServer);

bootstrap.workingDirectory(process.cwd()).run();