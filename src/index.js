let fs = require('fs');
let express = require('express');
let proxy = require('http-proxy-middleware');
let babel = require('babel-core');

let TestServer = require("./TestServer");
let ScriptLoader = require("./ScriptLoader");
let App = require("./App");

let scriptLoader = new ScriptLoader(fs);
let testServer = new TestServer(express, proxy);
let app = new App(babel, scriptLoader, testServer);

app.workingDirectory(process.cwd()).run();