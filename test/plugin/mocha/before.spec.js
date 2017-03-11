const expect = require('chai').expect;
const sinon = require('sinon');
const testUtils = require("../../test-utils");

describe("mocha before actions", () => {

    beforeEach(() => {
        global.mocha = testUtils.stubObject(["setup", "reporter"]);
        global.beforeEach = sinon.stub();
        global.afterEach = sinon.stub();
        global.testFrame = {
            setup: "setupMethod",
            teardown: "teardownMethod"
        };
        testUtils.reload(__dirname + "/../../../src/plugin/mocha/before");
    });

    it("sets up mocha", () => {
        expect(global.mocha.setup.called).to.be.true;
        expect(global.mocha.setup.firstCall.args).to.deep.equal(['bdd']);
    });

    it("sets up the test frame before each test", () => {
        expect(global.beforeEach.called).to.be.true;
        expect(global.beforeEach.firstCall.args).to.deep.equal([global.testFrame.setup]);
    });

    it("sets tears down the test frame before after test", () => {
        expect(global.afterEach.called).to.be.true;
        expect(global.afterEach.firstCall.args).to.deep.equal([global.testFrame.teardown]);
    });


    describe("the reporter", () => {
        let runner;
        beforeEach(() => {
            global.axios = testUtils.stubObject(["post"]);
            runner = testUtils.stubObject(["on"]);
            let reporterSetup = mocha.reporter.firstCall.args[0];
            reporterSetup(runner);
        });

        describe("reports to the server on", () => {

            it("test pass", () => {
                expect(runner.on.firstCall.args[0]).to.equal('pass');
                let passCallback = runner.on.firstCall.args[1];
                let testResult = {
                    state: "passed",
                    fullTitle: sinon.stub().returns("passed test")
                };

                passCallback(testResult);
                let data = global.axios.post.firstCall.args[1];
                expect(data.state).to.equal("passed");
                expect(data.name).to.equal("passed test");
            });

            it("test fail", () => {
                expect(runner.on.secondCall.args[0]).to.equal('fail');
                let failCallback = runner.on.secondCall.args[1];
                let testResult = {
                    state: "failed",
                    fullTitle: sinon.stub().returns("failed test")
                };

                failCallback(testResult);
                let data = global.axios.post.firstCall.args[1];
                expect(data.state).to.equal("failed");
                expect(data.name).to.equal("failed test");
            });

            it("suite finish", () => {
                expect(runner.on.thirdCall.args[0]).to.equal('end');
                let endCallback = runner.on.thirdCall.args[1];

                endCallback();

                let data = global.axios.post.firstCall.args[1];
                expect(data.state).to.equal("finished");
                expect(data.passes).to.equal(0);
                expect(data.failures).to.equal(0);
            });

            it("counts test passes", () => {
                let passCallback = runner.on.firstCall.args[1];
                let endCallback = runner.on.thirdCall.args[1];
                let testResult = {
                    state: "pass",
                    fullTitle: sinon.stub().returns("failed test")
                };

                passCallback(testResult);
                passCallback(testResult);
                endCallback();

                let data = global.axios.post.thirdCall.args[1];
                expect(data.passes).to.equal(2);
            });

            it("counts test failures", () => {
                let failCallback = runner.on.secondCall.args[1];
                let endCallback = runner.on.thirdCall.args[1];
                let testResult = {
                    state: "failure",
                    fullTitle: sinon.stub().returns("failed test")
                };

                failCallback(testResult);
                failCallback(testResult);
                endCallback();

                let data = global.axios.post.thirdCall.args[1];
                expect(data.failures).to.equal(2);
            });

        });
        
    });
});