const chai =  require('chai');
chai.use(require('chai-string'));
const expect = chai.expect;
const sinon = require('sinon');

const mochaPlugin = require("../../../src/plugin/mocha/mocha-plugin");

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

    it("includes a promise polyfill before the specs", () => {
        let promisePath = hooks.beforeSpecs.include.secondCall.args[0];
        expect(promisePath).to.startsWith("/");
        expect(promisePath).to.endsWith("/../../../node_modules/es6-promise/dist/es6-promise.auto.min.js");
    });


    it("includes Axios before the specs", () => {
        let axiosPath = hooks.beforeSpecs.include.thirdCall.args[0];
        expect(axiosPath).to.startsWith("/");
        expect(axiosPath).to.endsWith("/../../../node_modules/axios/dist/axios.min.js");
    });


    it("includes Mocha setup code before the specs", () => {
        let beforePath = hooks.beforeSpecs.include.getCall(3).args[0];
        expect(beforePath).to.startsWith("/");
        expect(beforePath).to.endsWith("/before.js");
    });

    it("includes Mocha run code after the specs", () => {
        let afterPath = hooks.afterSpecs.include.firstCall.args[0];
        expect(afterPath).to.startsWith("/");
        expect(afterPath).to.endsWith("/after.js");
    });

});