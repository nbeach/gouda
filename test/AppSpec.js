const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./testUtils").stubObject;
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

        it("loads the test frame and includes it in the scrips", () => {
            fs.readFileSync.withArgs("../test//browser/testFrame.js").returns("console.log('testFrame');");

            app.run();

            expect(testServer.scripts.firstCall.args[0][0]).to.equal("console.log('testFrame');");
        });

        it("loads the test files and transforms from ES5 to ES6", () => {
            babel.transform.returns({ code: "console.log('babel');"});

            app.run();

            let scripts = testServer.scripts.firstCall.args[0];
            expect(scripts[2]).to.equal("console.log('babel');");
            expect(scripts[3]).to.equal("console.log('babel');");
        });

        describe("loads configured plugins and", () => {

            it("allows plugins to add scripts before and after the test scripts", () => {
                babel.transform.returns({ code: "console.log('foobar');"});
                fs.readFileSync.withArgs("/before/file.js").returns("console.log('before');");
                fs.readFileSync.withArgs("/after/file.js").returns("console.log('after');");

                app.run();

                expect(testServer.scripts.firstCall.args[0][1]).to.equal("console.log('before');");
                expect(testServer.scripts.firstCall.args[0][4]).to.equal("console.log('after');");
            });

        });

    });


});