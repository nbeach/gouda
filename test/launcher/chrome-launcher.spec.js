const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("../test-utils").stubObject;
const ChromeLauncher = require('../../src/launcher/chrome-launcher');

describe("ChromeLauncher", () => {
    let chromeLauncher, childProcess, chromeProcess, uuid, rimraf;
    beforeEach(() => {
        childProcess = stubObject(["spawn"]);
        chromeProcess = stubObject(["kill"]);
        rimraf = stubObject(["sync"]);
        uuid = sinon.stub();
        childProcess.spawn.returns(chromeProcess);

        ChromeLauncher.prototype._tempDir = sinon.stub().returns("/tmp/00000000-0000-0000-0000-000000000000");
        chromeLauncher = new ChromeLauncher("http://localhost:8000/test");
        chromeLauncher._childProcess = childProcess;
        chromeLauncher._rimraf = rimraf;
        chromeLauncher._uuid = uuid;
        chromeLauncher._process = { platform: "linux" };
    });

    describe("starts the browser", () => {

        it("on linux", () => {
            chromeLauncher._process = { platform: "linux" };
            chromeLauncher.start();

            expect(childProcess.spawn.firstCall.args[0]).to.equal("google-chrome")
        });

        it("on Mac", () => {
            chromeLauncher._process = { platform: "darwin" };
            chromeLauncher.start();

            expect(childProcess.spawn.firstCall.args[0]).to.equal("/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome")
        });

    });

    it("stop the browser", () => {
        chromeLauncher.start();
        chromeLauncher.stop();

        expect(chromeProcess.kill.called).to.be.true;
    });

    it("removes the temp directory", () => {
        chromeLauncher.start();
        chromeLauncher.stop();

        expect(rimraf.sync.firstCall.args[0]).to.equal("/tmp/00000000-0000-0000-0000-000000000000");
    });

    describe("configures chrome to", () => {
        let chromeConfig;

        beforeEach(() => {
            chromeLauncher.start();
            chromeConfig = childProcess.spawn.firstCall.args[1];
        });


        it("load the target URL", () => {
            expect(chromeConfig).to.contain("http://localhost:8000/test");
        });

        it("use a temporary user data dir", () => {
            expect(chromeConfig).to.contain("--user-data-dir=/tmp/00000000-0000-0000-0000-000000000000");
        });

        it("disable the default browser check", () => {
            expect(chromeConfig).to.contain("--no-default-browser-check")
        });

        it("disable first run setup", () => {
            expect(chromeConfig).to.contain("--no-first-run")
        });

        it("disable default apps", () => {
            expect(chromeConfig).to.contain("--disable-default-apps")
        });

        it("disable translation", () => {
            expect(chromeConfig).to.contain("--disable-translate")
        });

        it("disable background timer throttling", () => {
            expect(chromeConfig).to.contain("--disable-background-timer-throttling")
        });

        it("disable device discovery notifications", () => {
            expect(chromeConfig).to.contain("--disable-device-discovery-notifications")
        });

    });
});