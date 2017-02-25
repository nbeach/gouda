let fs = require('fs');
let express = require('express');
let proxy = require('http-proxy-middleware');
let TestServer = require("./../src/TestServer");
let ScriptLoader = require("./../src/ScriptLoader");

let scriptLoader = new ScriptLoader(fs);
let testJs = scriptLoader
    .workingDirectory("./scripts/")
    .load(["foo.js", "bar.js"]);

let testServer = new TestServer(express, proxy);
testServer
    .port(8000)
    .testingEndpoint("/test")
    .testScript(testJs)
    .targetUrl("http://www.nicholasbeach.com")
    .start();