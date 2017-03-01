const expect = require('chai').expect;
const sinon = require('sinon');
const Testinator = require('../src/Testinator');

describe("Testinator", () => {
    let scriptLoader, testServer, testinator;

    beforeEach(() => {

        scriptLoader = {
            load: sinon.stub()
        };

        testServer = {
            run: sinon.stub(),
            port: sinon.stub(),
            endpoint: sinon.stub(),
            script: sinon.stub(),
            target: sinon.stub()
        };

        testServer.port.returns(testServer);
        testServer.endpoint.returns(testServer);
        testServer.script.returns(testServer);
        testServer.target.returns(testServer);

        testinator = new Testinator(scriptLoader, testServer);
        testinator.workingDirectory("../test/");
    });

    describe("run()", () => {

        it("runs the test server", () => {
            testinator.run();
            expect(testServer.run.called).to.be.true;
        });

        it("loads the configuration", () => {
            testinator.run();

            expect(testServer.run.called).to.be.true;
            expect(testServer.port.calledWith("8000")).to.be.true;
            expect(testServer.endpoint.calledWith("/test-endpoint")).to.be.true;
            expect(testServer.target.calledWith("http://www.test.com")).to.be.true;
        });

        it("loads the test files", () => {
            scriptLoader.load.returns("console.log('foo');");

            testinator.run();
            expect(scriptLoader.load.calledWith(["fooSpec.js", "barSpec.js"])).to.be.true;
            expect(testServer.script.calledWith("console.log('foo');")).to.be.true;
        });

    });

});