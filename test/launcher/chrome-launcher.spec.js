const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("../test-utils").stubObject;
const ChromeLauncher = require('../../src/launcher/chrome-launcher');

describe("ChromeLauncher", () => {
    let chromeLauncher, childProcess, chromeProcess;
    beforeEach(() => {
        childProcess = stubObject(["spawn"]);
        chromeProcess = stubObject(["kill"]);
        childProcess.spawn.returns(chromeProcess);

        chromeLauncher = new ChromeLauncher(childProcess, "http://localhost:8000/test");
    });

    it("starts the browser", () => {
        chromeLauncher.start();

        expect(childProcess.spawn.firstCall.args[0]).to.equal("google-chrome")
    });

    it("stop the browser", () => {
        chromeLauncher.start();
        chromeLauncher.stop();

        expect(chromeProcess.kill.called).to.be.true;
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
            expect(chromeConfig).to.contain("--user-data-dir=/tmp/chrome-launcher");
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