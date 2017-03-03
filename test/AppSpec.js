const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./TestUtils").stubObject;
const App = require('../src/App');

describe("App", () => {
    let scriptLoader, testServer, babel, app;

    beforeEach(() => {
        scriptLoader = stubObject(["load", "transform"]);
        testServer = stubObject(["start", "port", "endpoint", "script", "target"], true);
        babel = stubObject(["transform"]);

        app = new App(babel, scriptLoader, testServer);
        app.workingDirectory("../test/");
    });

    describe("on construction", () => {

        it("adds an es6 to es5 transform to the script loader", () => {
            babel.transform.returns({ code: "var a = 10;"});

            let transform = scriptLoader.transform.firstCall.args[0];
            let result = transform("const a = 10;");

            expect(babel.transform.calledWith("const a = 10;", { presets: ['es2015'] }));
            expect(result).to.equal("var a = 10;");

        });

    });

    describe("run()", () => {

        it("runs the test server", () => {
            app.run();
            expect(testServer.start.called).to.be.true;
        });

        it("loads the configuration", () => {
            app.run();

            expect(testServer.start.called).to.be.true;
            expect(testServer.port.calledWith("8000")).to.be.true;
            expect(testServer.endpoint.calledWith("/test-endpoint")).to.be.true;
            expect(testServer.target.calledWith("http://www.test.com")).to.be.true;
        });

        it("loads the test files", () => {
            scriptLoader.load.returns("console.log('foo');");

            app.run();
            expect(scriptLoader.load.calledWith(["fooSpec.js", "barSpec.js"])).to.be.true;
            expect(testServer.script.calledWith("console.log('foo');")).to.be.true;
        });

    });

});