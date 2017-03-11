const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./test-utils").stubObject;
const Runner = require('../src/runner');

describe("Runner", () => {
    let runner, server, config;

    beforeEach(() => {
        config =  {
            target: "http://www.test.com",
            endpoint: "/test-endpoint",
            port: "8000"
        };
        runner = new Runner();
        server = stubObject(["start", "port", "endpoint", "onResult", "scripts", "target"], true);
        runner.config(config)
            .server(server);
    });

    describe("run()", () => {

        it("configures the test server", () => {
            runner.run();

            expect(server.start.called).to.be.true;
            expect(server.port.calledWith("8000")).to.be.true;
            expect(server.endpoint.calledWith("/test-endpoint")).to.be.true;
            expect(server.target.calledWith("http://www.test.com")).to.be.true;
        });

        it("runs the test server", () => {
            runner.run();
            expect(server.start.called).to.be.true;
        });

    });

    it("call the reporters on a result", () => {
        let reporter = sinon.stub();
        runner.reporters([reporter]);

        runner.run();
        server.onResult.callArgWith(0, "result");

        expect(reporter.firstCall.args[0]).to.equal("result");
    });

});