const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./testUtils").stubObject;
const Runner = require('../src/Runner');

describe("Runner", () => {
    let runner, testServer, config;

    beforeEach(() => {
        config =  {
            target: "http://www.test.com",
            endpoint: "/test-endpoint",
            port: "8000"
        };
        runner = new Runner();
        testServer = stubObject(["start", "port", "endpoint", "onResult", "scripts", "target"], true);
        runner.config(config)
            .server(testServer);
    });

    describe("run()", () => {

        it("configures the test server", () => {
            runner.run();

            expect(testServer.start.called).to.be.true;
            expect(testServer.port.calledWith("8000")).to.be.true;
            expect(testServer.endpoint.calledWith("/test-endpoint")).to.be.true;
            expect(testServer.target.calledWith("http://www.test.com")).to.be.true;
        });

        it("runs the test server", () => {
            runner.run();
            expect(testServer.start.called).to.be.true;
        });

    });

    it("call the reporters on a result", () => {
        let reporter = sinon.stub();
        runner.reporters([reporter]);

        runner.run();
        testServer.onResult.callArgWith(0, "result");

        expect(reporter.firstCall.args[0]).to.equal("result");
    });

});