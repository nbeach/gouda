const fs = require('fs'),
    express = require('express'),
    proxy = require('http-proxy-middleware'),
    bodyParser = require('body-parser'),
    babel = require('babel-core'),
    TestServer = require("./TestServer"),
    Bootstrap = require("./Bootstrap");

const testServer = new TestServer(express, proxy, bodyParser);
const bootstrap = new Bootstrap(fs, babel, testServer);

bootstrap.workingDirectory(process.cwd()).run();