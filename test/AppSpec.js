const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./TestUtils").stubObject;
const App = require('../src/App');

describe("App", () => {
    let fs, testServer, babel, app;

    beforeEach(() => {
        fs = stubObject(["readFileSync"]);
        testServer = stubObject(["start", "port", "endpoint", "scripts", "target"], true);
        babel = stubObject(["transform"]);

        app = new App(fs, babel, testServer);
        app.workingDirectory("../test/");
    });


    describe("run()", () => {

        beforeEach(() => {
            babel.transform.returns({ code: ""});
        });

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

        it("loads the test files and transforms from ES5 to ES6", () => {
            fs.readFileSync.withArgs(["fooSpec.js", "barSpec.js"])
                .returns(["console.log('foo');", "console.log('bar');"]);
            babel.transform.returns({ code: "console.log('foobar');"});

            app.run();

            expect(testServer.scripts.firstCall.args[0][1]).to.equal("console.log('foobar');");
            expect(testServer.scripts.firstCall.args[0][2]).to.equal("console.log('foobar');");
        });

        describe("loads configured plugins and", () => {

            it("allows plugins to add scripts before and after the test scriptss", () => {
                babel.transform.returns({ code: "console.log('foobar');"});

                app.run();

                expect(testServer.scripts.firstCall.args[0]).to.deep.equal([
                    "console.log('before');",
                    "console.log('foobar');",
                    "console.log('foobar');",
                    "console.log('after');"
                ]);
            });

        });

    });


});