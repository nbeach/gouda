const expect = require('chai').expect;
const sinon = require('sinon');
const testUtils = require("../../testUtils");

describe("mocha before actions", () => {

    it("sets up mocha", () => {
        global.mocha = testUtils.stubObject(["setup"]);
        testUtils.reload(__dirname + "/../../../src/plugins/mocha/before")

        expect(global.mocha.setup.called).to.be.true;
        expect(global.mocha.setup.firstCall.args).to.deep.equal(['bdd']);
    });

});