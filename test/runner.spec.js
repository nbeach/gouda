const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./test-utils").stubObject;
const Runner = require('../src/runner');

describe("Runner", () => {
    let runner, process, server;

    beforeEach(() => {
        process = stubObject(["exit"]);
        runner = new Runner(process);
        server = stubObject(["start", "port", "endpoint", "onResult", "scripts", "target", "shutdown"], true);
        runner.server(server);
    });

    describe("run()", () => {

        it("runs the test server", () => {
            runner.run();
            expect(server.start.called).to.be.true;
        });

        it("launches the browsers", () => {
            let launcher = stubObject(["start", "stop"]);
            runner.launchers([launcher]).run();

            expect(launcher.start.called).to.be.true;
        });

    });

    it("call the reporters on a result", () => {
        let reporter = sinon.stub();
        runner.reporters([reporter]);

        runner.run();
        server.onResult.callArgWith(0, "result");

        expect(reporter.firstCall.args[0]).to.equal("result");
    });

    describe("when all tests have finished", () => {

        it("shuts down the server before exiting", () => {
            runner.run();
            let resultCallback = server.onResult.firstCall.args[0];
            resultCallback({ state: "failed" });
            resultCallback({ state: "passed" });
            expect(server.shutdown.called).to.be.false;
            resultCallback({ state: "finished" });

            expect(server.shutdown.called).to.be.true;
        });

        it("exits with zero status if all tests have succeeded", () => {
            runner.run();
            let resultCallback = server.onResult.firstCall.args[0];
            resultCallback({ state: "passed" });
            resultCallback({ state: "passed" });
            expect(process.exit.called).to.be.false;
            resultCallback({ state: "finished" });

            expect(process.exit.firstCall.args[0]).to.equal(0);
        });

        it("exits with status of 1 if at least one test has failed", () => {
            runner.run();
            let resultCallback = server.onResult.firstCall.args[0];
            resultCallback({ state: "failed" });
            resultCallback({ state: "passed" });
            expect(process.exit.called).to.be.false;
            resultCallback({ state: "finished" });

            expect(process.exit.firstCall.args[0]).to.equal(1);
        });

        it("closes the browsers", () => {
            let launcher = stubObject(["start", "stop"]);
            runner.launchers([launcher]).run();

            let resultCallback = server.onResult.firstCall.args[0];
            resultCallback({ state: "failed" });
            resultCallback({ state: "passed" });
            expect(launcher.stop.called).to.be.false;
            resultCallback({ state: "finished" });

            expect(launcher.stop.called).to.be.true;
        });

    });

    describe("doesn't end the run until all browsers have finished", () => {
        it("closes the browsers", () => {
            let launcher1 = stubObject(["start", "stop"]);
            let launcher2 = stubObject(["start", "stop"]);
            runner.launchers([launcher1, launcher2]).run();

            let resultCallback = server.onResult.firstCall.args[0];
            resultCallback({ state: "failed" });
            resultCallback({ state: "passed" });
            resultCallback({ state: "finished" });
            expect(launcher1.stop.called).to.be.false;
            expect(launcher2.stop.called).to.be.false;
            resultCallback({ state: "finished" });

            expect(launcher1.stop.called).to.be.true;
            expect(launcher2.stop.called).to.be.true;
        });
    });

});