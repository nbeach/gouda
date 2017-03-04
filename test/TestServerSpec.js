const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./TestUtils").stubObject;
const TestServer = require("../src/TestServer");

describe("TestServer", ()=> {
    let testServer, express, expressApp, proxy;

    beforeEach(() => {
        express = sinon.stub();
        express.static = sinon.stub();
        expressApp = stubObject(["listen", "use"]);

        proxy = sinon.stub();
        express.returns(expressApp);
        testServer = new TestServer(express, proxy);
    });

    describe("start()", () => {

        it("start the server on the specified port", () => {
            testServer.port(9001);
            testServer.start();

            expect(expressApp.listen.called).to.be.true;
            expect(expressApp.listen.firstCall.args).to.deep.equal([9001]);
        });

        it("sets up the test endpoint first", () => {
            express.static.withArgs("test.html").returns("static");
            testServer.endpoint("/test/endpoint");
            testServer.start();

            expect(expressApp.use.called).to.be.true;
            expect(expressApp.use.firstCall.args[0]).to.equal("/test/endpoint");
        });

        it("set up the target proxy second", () => {
            testServer.target("http://www.google.com");
            proxy.returns("proxy");

            testServer.start();

            expect(expressApp.use.called).to.be.true;
            expect(expressApp.use.secondCall.args).to.deep.equal(["/", "proxy"]);
            expect(proxy.firstCall.args).to.deep.equal([{target: "http://www.google.com", changeOrigin: true}]);
        });

    });

    describe("shutdown()", () => {

        it("shuts down the server", () => {
            let server = {
                close: sinon.stub()
            };
            expressApp.listen.returns(server);
            testServer.start();
            testServer.shutdown();

            expect(server.close.called).to.be.true;
        });

    });

    //TODO: Improve assertions on HTML returned
    describe("the testing endpoint", () => {

        it("returns a page with the scripts included", () => {
            testServer
                .scripts(["console.log('foo');", "console.log('bar');"])
                .start();

            let response = {
                send: sinon.stub()
            };
            let testEndpointMethod = expressApp.use.firstCall.args[1];
            testEndpointMethod(null, response);

            expect(response.send.called).to.be.true;
            expect(response.send.firstCall.args[0]).to.contain("<script>console.log('foo');</script>\n<script>console.log('bar');</script>");
        });

    });
});