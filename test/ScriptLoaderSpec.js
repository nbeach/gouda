const expect = require('chai').expect;
const sinon = require('sinon');
const stubObject = require("./TestUtils").stubObject;
const ScriptLoader = require("../src/ScriptLoader");


describe("ScriptLoader", () => {
    let fs, scriptLoader;

    beforeEach(() => {
        fs = stubObject(["readFileSync"]);
        fs.readFileSync.withArgs("foo.js").returns("console.log('foo');");
        fs.readFileSync.withArgs("bar.js").returns("console.log('bar');");

        scriptLoader = new ScriptLoader(fs);
    });

    it("reads files and concatenates them to a single string", () => {
        let fileContents = scriptLoader.load(["foo.js", "bar.js"]);
        expect(fileContents).to.equal("console.log('foo');\nconsole.log('bar');")
    });

    it("supports registering of transformers to proccess script files", () => {
        let fileContents = scriptLoader
            .transform((js) => js.replace('foo', 'foobar'))
            .transform((js) => js.replace('foobar', 'barfoo'))
            .load(["foo.js", "bar.js"]);

        expect(fileContents).to.equal("console.log('barfoo');\nconsole.log('bar');")
    });

    it("adds the working directory to files paths before loading", () => {
        scriptLoader
            .workingDirectory("/home/scripts/")
            .load(["foo.js"]);

        expect(fs.readFileSync.firstCall.args).to.deep.equal(["/home/scripts/foo.js"])
    });

});