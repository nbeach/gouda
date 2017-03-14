const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("../test-utils").stubObject;
const FirefoxLauncher = require('../../src/launcher/firefox-launcher');

describe("FirefoxLauncher", () => {
    let firefoxLauncher, childProcess, chromeProcess, uuid, rimraf;
    beforeEach(() => {
        childProcess = stubObject(["spawn"]);
        chromeProcess = stubObject(["kill"]);
        rimraf = stubObject(["sync"]);
        uuid = sinon.stub();
        childProcess.spawn.returns(chromeProcess);

        FirefoxLauncher.prototype._tempDir = sinon.stub().returns("/tmp/00000000-0000-0000-0000-000000000000");
        firefoxLauncher = new FirefoxLauncher("http://localhost:8000/test");
        firefoxLauncher._childProcess = childProcess;
        firefoxLauncher._rimraf = rimraf;
        firefoxLauncher._uuid = uuid;
        firefoxLauncher._process = { platform: "linux" };
    });

    describe("starts the browser", () => {

        it("on linux", () => {
            firefoxLauncher._process = { platform: "linux" };
            firefoxLauncher.start();

            expect(childProcess.spawn.firstCall.args[0]).to.equal("firefox")
        });

        it("on Mac", () => {
            firefoxLauncher._process = { platform: "darwin" };
            firefoxLauncher.start();

            expect(childProcess.spawn.firstCall.args[0]).to.equal("/Applications/Firefox.app/Contents/MacOS/firefox")
        });

    });

    it("stop the browser", () => {
        firefoxLauncher.start();
        firefoxLauncher.stop();

        expect(chromeProcess.kill.called).to.be.true;
    });

    it("removes the temp directory", () => {
        firefoxLauncher.start();
        firefoxLauncher.stop();

        expect(rimraf.sync.firstCall.args[0]).to.equal("/tmp/00000000-0000-0000-0000-000000000000");
    });

    describe("configures firefox to", () => {
        let firefoxConfig;

        beforeEach(() => {
            firefoxLauncher.start();
            firefoxConfig = childProcess.spawn.firstCall.args[1];
        });

        it("load the target URL", () => {
            expect(firefoxConfig).to.contain("http://localhost:8000/test");
        });

        it("use the temp directory for the profile", () => {
            expect(firefoxConfig[1]).to.equal("-profile");
            expect(firefoxConfig[2]).to.equal("/tmp/00000000-0000-0000-0000-000000000000");
        });

        it("creates a new instance", () => {
            expect(firefoxConfig).to.contain("-no-remote");
        });

    });
});