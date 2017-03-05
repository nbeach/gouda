const expect = require('chai').expect;
const sinon = require('sinon');

const testUtils = require("../testUtils");

describe("testFrame", () => {
    let testFrame, document, iframe;

    beforeEach(() => {
        iframe = {
            addEventListener: sinon.stub(),
            remove: sinon.stub(),
            contentWindow: {
                document: "frameDocument"
            }
        };

        document = {
            createElement: sinon.stub(),
            body: {
                appendChild: sinon.stub()
            }
        };

        global.document = document;
        testUtils.reload(__dirname + '/../../src/browser/testFrame');
        testFrame = global.testFrame;
    });

    beforeEach(() => {
        document.createElement.withArgs('iframe').returns(iframe);
        testFrame.setup();
    });

    describe("setup()", () => {

        it("creates an iframe", () => {
            expect(document.createElement.firstCall.args).to.deep.equal(["iframe"]);
        });

        it("sets the frame source to the site root", () => {
            expect(iframe.src).to.equal('/');
        });

        it("appends the iframe to the document body", () => {
            expect(document.body.appendChild.firstCall.args[0]).to.equal(iframe);
        });

    });

    describe("teardown()", () => {
        it("removes the iframe from the page", () => {
            testFrame.teardown();
            expect(iframe.remove.called).to.be.true;
        });
    });

    it("window() returns the frame window", () => {
        expect(testFrame.window()).to.equal(iframe.contentWindow);
    });

    it("document() returns the frame document", () => {
        expect(testFrame.document()).to.equal(iframe.contentWindow.document);
    });
});