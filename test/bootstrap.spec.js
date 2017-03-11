const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./test-utils").stubObject;
const Bootstrap = require('../src/bootstrap');

describe("Bootstrap", () => {
    let fs, server, runner, babel, bootstrap;

    beforeEach(() => {
        fs = stubObject(["readFileSync"]);
        server = stubObject(["start", "port", "endpoint", "scripts", "target"], true);
        runner = stubObject(["server", "run"], true);
        babel = stubObject(["transform"]);

        bootstrap = new Bootstrap(fs, babel, runner, server, "../test/");

    });

    describe("run()", () => {

        beforeEach(() => {
            babel.transform.returns({ code: ""});
        });

        it("configures the server", () => {
            bootstrap.run();

            expect(server.port.calledWith("8000")).to.be.true;
            expect(server.endpoint.calledWith("/test-endpoint")).to.be.true;
            expect(server.target.calledWith("http://www.test.com")).to.be.true;
        });

        it("sets the server on the runner", () => {
            bootstrap.run();
            expect(runner.server.firstCall.args[0]).to.equal(server);
        });

        it("runs the runner", () => {
            bootstrap.run();
            expect(runner.run.called).to.be.true;
        });


        it("loads the event simulator and includes it in the scrips", () => {
            fs.readFileSync = (path) => {
                return path.endsWith("/../node_modules/simulant/dist/simulant.umd.js") ? "console.log('eventSimulator');" : null;
            };

            bootstrap.run();

            expect(server.scripts.firstCall.args[0][0]).to.equal("console.log('eventSimulator');");
        });

        it("loads the test frame and includes it in the scrips", () => {
            fs.readFileSync = (path) => {
                return path.endsWith("/browser/test-frame.js") ? "console.log('testFrame');" : null;
            };

            bootstrap.run();

            expect(server.scripts.firstCall.args[0][1]).to.equal("console.log('testFrame');");
        });

        it("loads the test files and transforms from ES5 to ES6", () => {
            babel.transform.returns({ code: "console.log('babel');"});

            bootstrap.run();

            let scripts = server.scripts.firstCall.args[0];
            expect(scripts[3]).to.equal("console.log('babel');");
            expect(scripts[4]).to.equal("console.log('babel');");
        });

        describe("loads configured plugins and", () => {

            it("allows plugins to add scripts before and after the test scripts", () => {
                babel.transform.returns({ code: "console.log('foobar');"});
                fs.readFileSync.withArgs("/before/file.js").returns("console.log('before');");
                fs.readFileSync.withArgs("/after/file.js").returns("console.log('after');");

                bootstrap.run();

                expect(server.scripts.firstCall.args[0][2]).to.equal("console.log('before');");
                expect(server.scripts.firstCall.args[0][5]).to.equal("console.log('after');");
            });

        });

    });

});