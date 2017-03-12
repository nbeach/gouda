const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("../test-utils").stubObject;
const FirefoxLauncher = require('../../src/launcher/firefox-launcher');

describe("FirefoxLauncher", () => {
    let firefoxLauncher, childProcess, firefoxProcess;
    beforeEach(() => {
        childProcess = stubObject(["spawn"]);
        firefoxProcess = stubObject(["kill"]);
        childProcess.spawn.returns(firefoxProcess);

        firefoxLauncher = new FirefoxLauncher("http://localhost:8000/test");
        firefoxLauncher._childProcess = childProcess;
    });

    it("starts the browser", () => {
        firefoxLauncher.start();

        expect(childProcess.spawn.firstCall.args[0]).to.equal("firefox")
    });

    it("stop the browser", () => {
        firefoxLauncher.start();
        firefoxLauncher.stop();

        expect(firefoxProcess.kill.called).to.be.true;
    });

    describe("configures chrome to", () => {
        let chromeConfig;

        beforeEach(() => {
            firefoxLauncher.start();
            chromeConfig = childProcess.spawn.firstCall.args[1];
        });


        it("load the target URL", () => {
            expect(chromeConfig).to.contain("http://localhost:8000/test");
        });

    });
});