const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./testUtils").stubObject;
const TestServer = require("../src/TestServer");

describe("TestServer", ()=> {
    let testServer, express, expressApp, proxy, bodyParser;

    beforeEach(() => {
        express = sinon.stub();
        express.static = sinon.stub();
        expressApp = stubObject(["listen", "use"]);

        bodyParser = stubObject(['json']);

        proxy = sinon.stub();
        express.returns(expressApp);
        testServer = new TestServer(express, proxy, bodyParser);
    });

    describe("start()", () => {

        it("initializes the body parser", () => {
            bodyParser.json.returns("setup parsing");
            testServer.start();

            expect(expressApp.use.called).to.be.true;
            expect(expressApp.use.firstCall.args[0]).to.equal("setup parsing");

        });

        it("start the server on the specified port", () => {
            testServer.port(9001);
            testServer.start();

            expect(expressApp.listen.called).to.be.true;
            expect(expressApp.listen.firstCall.args).to.deep.equal([9001]);
        });

        it("sets up the test endpoint second", () => {
            express.static.withArgs("test.html").returns("static");
            testServer.endpoint("/test/endpoint");
            testServer.start();

            expect(expressApp.use.called).to.be.true;
            expect(expressApp.use.thirdCall.args[0]).to.equal("/test/endpoint");
        });

        it("sets up the result endpoint first", () => {
            testServer.endpoint("/test/endpoint");
            testServer.start();

            expect(expressApp.use.called).to.be.true;
            expect(expressApp.use.secondCall.args[0]).to.equal("/test/endpoint/result");
        });

        it("set up the target proxy second", () => {
            testServer.target("http://www.google.com");
            proxy.returns("proxy");

            testServer.start();

            expect(expressApp.use.called).to.be.true;
            expect(expressApp.use.calledWith("/", "proxy")).to.be.true;
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
            let testEndpointMethod = expressApp.use.thirdCall.args[1];
            testEndpointMethod(null, response);

            expect(response.send.called).to.be.true;
            expect(response.send.firstCall.args[0]).to.contain("<script>console.log('foo');</script>\n<script>console.log('bar');</script>");
        });

    });
    describe("the result endpoint", () => {
        let request, response;

        beforeEach(() => {
            request = {
                body: {
                    prop: "value"
                }
            };

            response = {
                send: sinon.stub()
            };
        });

        it("calls the result callback", () => {
            let callback = sinon.stub();

            testServer.onResult(callback).start();
            let resultEndpointMethod = expressApp.use.secondCall.args[1];
            resultEndpointMethod(request, response);

            expect(callback.firstCall.args[0]).to.deep.equal(request.body);
         });

        it("sends an okay result", () => {
            testServer.onResult(() => {}).start();
            let resultEndpointMethod = expressApp.use.secondCall.args[1];
            resultEndpointMethod(request, response);

            expect(response.send.firstCall.args[0]).to.equal('OK');
        });

    });

});