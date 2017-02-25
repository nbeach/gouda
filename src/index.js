let express = require('express');
let proxy = require('http-proxy-middleware');
let TestServer = require("./TestServer");

let testServer = new TestServer(express, proxy);

testServer
    .setPort(8000)
    .setTestingEndpoint("/test")
    .setTestJs('console.log("HELLO WORLD!");')
    .setTargetUrl("http://www.nicholasbeach.com")
    .start();