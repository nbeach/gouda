const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("../../test-utils").stubObject;
const PhantomJsLauncher = require('../../../src/launcher/phantomjs/phantomjs-launcher');

describe("PhantomJsLauncher", () => {
    let phantomJsLauncher, childProcess, phantomJsProcess, uuid, rimraf;

    beforeEach(() => {
        childProcess = stubObject(["spawn"]);
        phantomJsProcess = stubObject(["kill"]);
        rimraf = stubObject(["sync"]);
        uuid = sinon.stub();
        childProcess.spawn.returns(phantomJsProcess);

        PhantomJsLauncher.prototype._tempDir = sinon.stub().returns("/tmp/00000000-0000-0000-0000-000000000000");
        phantomJsLauncher = new PhantomJsLauncher("http://localhost:8000/test");
        phantomJsLauncher._childProcess = childProcess;
        phantomJsLauncher._rimraf = rimraf;
        phantomJsLauncher._uuid = uuid;
        phantomJsLauncher._process = { platform: "linux" };
    });

    describe("starts the browser", () => {

        it("on linux", () => {
            phantomJsLauncher._process = { platform: "linux" };
            phantomJsLauncher.start();

            expect(childProcess.spawn.firstCall.args[0]).endsWith("/node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs")
        });

        it("on Mac", () => {
            phantomJsLauncher._process = { platform: "darwin" };
            phantomJsLauncher.start();

            expect(childProcess.spawn.firstCall.args[0]).endsWith("/node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs")
        });

    });

    it("stop the browser", () => {
        phantomJsLauncher.start();
        phantomJsLauncher.stop();

        expect(phantomJsProcess.kill.called).to.be.true;
    });

    it("removes the temp directory", () => {
        phantomJsLauncher.start();
        phantomJsLauncher.stop();

        expect(rimraf.sync.firstCall.args[0]).to.equal("/tmp/00000000-0000-0000-0000-000000000000");
    });

    describe("configures PhantomJS to", () => {
        let firefoxConfig;

        beforeEach(() => {
            phantomJsLauncher.start();
            firefoxConfig = childProcess.spawn.firstCall.args[1];
        });

        it("load the target URL", () => {
            expect(firefoxConfig).to.contain("http://localhost:8000/test");
        });

        it("use the temp directory for the profile", () => {
            expect(firefoxConfig[0]).endsWith("script.js");
        });


    });
});