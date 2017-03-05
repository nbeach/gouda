var express = require('express');
var port = process.argv[2];

console.log("Starting server to on port " + port + "...");

var app = express();
app.use('/', express.static('target/'));

app.listen(port);


