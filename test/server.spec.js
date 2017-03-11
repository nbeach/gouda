const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./test-utils").stubObject;
const Server = require("../src/server");

describe("Server", ()=> {
    let server, express, expressApp, proxy, bodyParser;

    beforeEach(() => {
        express = sinon.stub();
        express.static = sinon.stub();
        expressApp = stubObject(["listen", "use"]);

        bodyParser = stubObject(['json']);

        proxy = sinon.stub();
        express.returns(expressApp);
        server = new Server(express, proxy, bodyParser);
    });

    describe("start()", () => {

        it("initializes the body parser", () => {
            bodyParser.json.returns("setup parsing");
            server.start();

            expect(expressApp.use.called).to.be.true;
            expect(expressApp.use.firstCall.args[0]).to.equal("setup parsing");

        });

        it("start the server on the specified port", () => {
            server.port(9001);
            server.start();

            expect(expressApp.listen.called).to.be.true;
            expect(expressApp.listen.firstCall.args).to.deep.equal([9001]);
        });

        it("sets up the test endpoint second", () => {
            express.static.withArgs("test.html").returns("static");
            server.endpoint("/test/endpoint");
            server.start();

            expect(expressApp.use.called).to.be.true;
            expect(expressApp.use.thirdCall.args[0]).to.equal("/test/endpoint");
        });

        it("sets up the result endpoint first", () => {
            server.endpoint("/test/endpoint");
            server.start();

            expect(expressApp.use.called).to.be.true;
            expect(expressApp.use.secondCall.args[0]).to.equal("/test/endpoint/result");
        });

        it("set up the target proxy second", () => {
            server.target("http://www.google.com");
            proxy.returns("proxy");

            server.start();

            expect(expressApp.use.called).to.be.true;
            expect(expressApp.use.calledWith("/", "proxy")).to.be.true;
            expect(proxy.firstCall.args).to.deep.equal([{target: "http://www.google.com", changeOrigin: true}]);
        });

    });

    describe("shutdown()", () => {

        it("shuts down the server", () => {
            let expressServer = {
                close: sinon.stub()
            };
            expressApp.listen.returns(expressServer);
            server.start();
            server.shutdown();

            expect(expressServer.close.called).to.be.true;
        });

    });

    //TODO: Improve assertions on HTML returned
    describe("the testing endpoint", () => {

        it("returns a page with the scripts included", () => {
            server
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

            server.onResult(callback).start();
            let resultEndpointMethod = expressApp.use.secondCall.args[1];
            resultEndpointMethod(request, response);

            expect(callback.firstCall.args[0]).to.deep.equal(request.body);
         });

        it("sends an okay result", () => {
            server.onResult(() => {}).start();
            let resultEndpointMethod = expressApp.use.secondCall.args[1];
            resultEndpointMethod(request, response);

            expect(response.send.firstCall.args[0]).to.equal('OK');
        });

    });

});