const chai =  require('chai');
chai.use(require('chai-string'));
const expect = chai.expect;
const sinon = require('sinon');

const mochaPlugin = require("../../../src/plugins/mocha/mochaPlugin");

describe("mochaPlugin", () => {
    let hooks;
    beforeEach(() => {
        hooks = {
            beforeSpecs: {
                include: sinon.stub()
            },
            afterSpecs: {
                include: sinon.stub()
            }
        };

        mochaPlugin(hooks);
    });

    it("includes Mocha before the specs", () => {
        let mochaPath = hooks.beforeSpecs.include.firstCall.args[0];
        expect(mochaPath).to.startsWith("/");
        expect(mochaPath).to.endsWith("/../../../node_modules/mocha/mocha.js");
    });

    it("includes Axios before the specs", () => {
        let mochaPath = hooks.beforeSpecs.include.secondCall.args[0];
        expect(mochaPath).to.startsWith("/");
        expect(mochaPath).to.endsWith("/../../../node_modules/axios/dist/axios.min.js");
    });


    it("includes Mocha setup code before the specs", () => {
        let beforePath = hooks.beforeSpecs.include.thirdCall.args[0];
        expect(beforePath).to.startsWith("/");
        expect(beforePath).to.endsWith("/before.js");
    });

    it("includes Mocha run code after the specs", () => {
        let afterPath = hooks.afterSpecs.include.firstCall.args[0];
        expect(afterPath).to.startsWith("/");
        expect(afterPath).to.endsWith("/after.js");
    });

});