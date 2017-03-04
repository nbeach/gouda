const chai =  require('chai');
chai.use(require('chai-string'));
const expect = chai.expect;
const sinon = require('sinon');

const chaiPlugin = require("../../../src/plugins/chai/chaiPlugin");

describe("chaiPlugin", () => {

    it("includes Chai before the specs", () => {
        let hooks = {
            beforeSpecs: {
                include: sinon.stub()
            }
        };

        chaiPlugin(hooks);

        let includePath = hooks.beforeSpecs.include.firstCall.args[0];
        expect(includePath).to.startsWith("/");
        expect(includePath).to.endsWith("/../../../node_modules/chai/chai.js");
    });

});