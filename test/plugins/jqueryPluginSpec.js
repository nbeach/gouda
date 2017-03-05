const chai =  require('chai');
chai.use(require('chai-string'));
const expect = chai.expect;
const sinon = require('sinon');

const chaiPlugin = require("../../src/plugins/jqueryPlugin");

describe("jqueryPlugin", () => {

    it("includes jQuery before the specs", () => {
        let hooks = {
            beforeSpecs: {
                include: sinon.stub()
            }
        };

        chaiPlugin(hooks);

        let includePath = hooks.beforeSpecs.include.firstCall.args[0];
        expect(includePath).to.startsWith("/");
        expect(includePath).to.endsWith("/../../node_modules/jquery/dist/jquery.js");
    });

});