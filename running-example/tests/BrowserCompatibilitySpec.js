const expect = chai.expect;

const paramIt = (list, name, func) => {
    list.forEach((value) => {
        it(name.replace("#value", value), func.bind(window, value));
    });
};


describe("The test framework", function () {

    let $document;
    beforeEach(() => $document = $(testFrame.document()));

    describe("can access the DOM and", () => {

        it("read values", () => {
            expect($document.find("#text").text()).to.equal("Some text");
        });

        it("modify input fields", () => {
            let searchField = $document.find('#text-input');
            searchField.val("cake");
            expect(searchField.val()).to.equal("cake");
        });

    });

    describe("can simulate", () => {
        let events = {
            mouse: ["mouseup", "mousedown", "click"],
            keyboard: ["keypress", "keyup", "keydown"],
            input: ["focus", "change"]
        };
        events.all = [].concat(events.mouse, events.keyboard, events.input);

        paramIt(events.mouse, "#value on an input", (event) => {
            let input = $document.find('#button')[0];
            simulant.fire(input, event, {});
            expect($document.find('#last-button-event').text()).to.equal(event);
        });

        paramIt(events.all, "#value on an input", (event) => {
            let button = $document.find('#text-input')[0];
            simulant.fire(button, event, {});
            expect($document.find('#last-input-event').text()).to.equal(event);
        });

    });


});