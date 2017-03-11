const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./test-utils").stubObject;
const Bootstrap = require('../src/bootstrap');

describe("Bootstrap", () => {
    let fs, testServer, runner, babel, app;

    beforeEach(() => {
        fs = stubObject(["readFileSync"]);
        runner = stubObject(["run", "config", "tests", "launchers", "server"], true);
        testServer = stubObject(["start", "port", "endpoint", "scripts", "target"], true);
        babel = stubObject(["transform"]);

        app = new Bootstrap(fs, babel, runner, testServer);
        app.workingDirectory("../test/");
    });

    describe("run()", () => {

        beforeEach(() => {
            babel.transform.returns({ code: ""});
        });

        it("runs the test runner", () => {
            app.run();
            expect(runner.run.called).to.be.true;
        });

        it("passes the test server to the runner", () => {
            app.run();

            let config = runner.config.firstCall.args[0];
            expect(config.target).to.equal("http://www.test.com");
            expect(config.endpoint).to.equal("/test-endpoint");
            expect(config.port).to.equal("8000");
        });

        it("passes the config to the runner", () => {
            app.run();

            expect(runner.server.firstCall.args[0]).to.deep.equal(testServer);
        });

        it("loads the event simulator and includes it in the scrips", () => {
            fs.readFileSync = (path) => {
                return path.endsWith("/../node_modules/simulant/dist/simulant.umd.js") ? "console.log('eventSimulator');" : null;
            };

            app.run();

            expect(runner.tests.firstCall.args[0][0]).to.equal("console.log('eventSimulator');");
        });

        it("loads the test frame and includes it in the scrips", () => {
            fs.readFileSync = (path) => {
                return path.endsWith("/browser/test-frame.js") ? "console.log('testFrame');" : null;
            };

            app.run();

            expect(runner.tests.firstCall.args[0][1]).to.equal("console.log('testFrame');");
        });

        it("loads the test files and transforms from ES5 to ES6", () => {
            babel.transform.returns({ code: "console.log('babel');"});

            app.run();

            let scripts = runner.tests.firstCall.args[0];
            expect(scripts[3]).to.equal("console.log('babel');");
            expect(scripts[4]).to.equal("console.log('babel');");
        });

        describe("loads configured plugins and", () => {

            it("allows plugins to add scripts before and after the test scripts", () => {
                babel.transform.returns({ code: "console.log('foobar');"});
                fs.readFileSync.withArgs("/before/file.js").returns("console.log('before');");
                fs.readFileSync.withArgs("/after/file.js").returns("console.log('after');");

                app.run();

                expect(runner.tests.firstCall.args[0][2]).to.equal("console.log('before');");
                expect(runner.tests.firstCall.args[0][5]).to.equal("console.log('after');");
            });

        });

    });

});