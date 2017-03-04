const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("../../TestUtils").stubObject;

describe("mocha after actions", () => {
    before(() => {
        global.mocha = stubObject(["checkLeaks", "run"]);
        require("../../../src/plugins/mocha/after")
    });

    it("checks for leaks", () => {
        expect(global.mocha.checkLeaks.called).to.be.true;
    });

    it("runs mocha", () => {
        expect(global.mocha.run.called).to.be.true;
    });
});