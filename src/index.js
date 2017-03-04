let fs = require('fs');
let express = require('express');
let proxy = require('http-proxy-middleware');
let babel = require('babel-core');

let TestServer = require("./TestServer");
let App = require("./App");

let testServer = new TestServer(express, proxy);
let app = new App(fs, babel, testServer);

app.workingDirectory(process.cwd()).run();