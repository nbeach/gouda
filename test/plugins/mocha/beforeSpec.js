const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("../../TestUtils").stubObject;

describe("mocha before actions", () => {

    it("sets up mocha", () => {
        global.mocha = stubObject(["setup"]);
        require("../../../src/plugins/mocha/before")

        expect(global.mocha.setup.called).to.be.true;
        expect(global.mocha.setup.firstCall.args).to.deep.equal(['bdd']);
    });

});