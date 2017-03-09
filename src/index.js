const fs = require('fs'),
    express = require('express'),
    proxy = require('http-proxy-middleware'),
    bodyParser = require('body-parser'),
    babel = require('babel-core'),
    TestServer = require("./TestServer"),
    App = require("./App");

const testServer = new TestServer(express, proxy, bodyParser);
const app = new App(fs, babel, testServer);

app.workingDirectory(process.cwd()).run();