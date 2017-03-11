const expect = require('chai').expect;
const sinon = require('sinon');
const testUtils = require("../../test-utils");

describe("mocha after actions", () => {
    beforeEach(() => {
        global.mocha = testUtils.stubObject(["checkLeaks", "run"]);
        testUtils.reload(__dirname + "/../../../src/plugin/mocha/after");
    });

    it("checks for leaks", () => {
        expect(global.mocha.checkLeaks.called).to.be.true;
    });

    it("runs mocha", () => {
        expect(global.mocha.run.called).to.be.true;
    });
});