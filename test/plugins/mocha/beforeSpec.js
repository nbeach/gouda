const expect = require('chai').expect;
const sinon = require('sinon');
const testUtils = require("../../testUtils");

describe("mocha before actions", () => {

    beforeEach(() => {
        global.mocha = testUtils.stubObject(["setup"]);
        global.beforeEach = sinon.stub();
        global.afterEach = sinon.stub();
        global.testFrame = {
            setup: "setupMethod",
            teardown: "teardownMethod"
        };
        testUtils.reload(__dirname + "/../../../src/plugins/mocha/before");
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

});