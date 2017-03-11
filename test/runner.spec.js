const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./test-utils").stubObject;
const Runner = require('../src/runner');

describe("Runner", () => {
    let runner, server;

    beforeEach(() => {
        runner = new Runner();
        server = stubObject(["start", "port", "endpoint", "onResult", "scripts", "target"], true);
        runner.server(server);
    });

    describe("run()", () => {

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