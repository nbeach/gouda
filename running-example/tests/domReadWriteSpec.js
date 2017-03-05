let expect = chai.expect;

describe("The test framework", function() {
    beforeEach(testFrame.setup);
    afterEach(testFrame.teardown);

    let $document;
    beforeEach(() => $document = $(testFrame.document()));

    describe("can access the DOM and", () => {

        it("read values", () => {
            console.log($document.find("#text"));
            expect($document.find("#text").text()).to.equal("Some text");
        });

        it("modify input fields", () => {
            let searchField = $document.find('#text-input');
            searchField.val("cake");
            expect(searchField.val()).to.equal("cake");
        });

    });

});