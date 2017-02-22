describe("BrowserCompatibilitySpec", function() {
    beforeEach(Framer.setup);
    afterEach(Framer.teardown);

    describe("can access the DOM and", function() {
        it("read values", function () {
            expect(Framer.document().find("#text-input").val()).to.not.equal("Some text");
        });

        it("modify input fields", function() {
            searchField = Framer.document().find('#text-input');
            searchField.val("cake");
            expect(searchField.val()).to.equal("cake");
        });

    });

    describe("can simulate", function() {
        var events = {
            mouse: ["mouseup", "mousedown", "click"],
            keyboard: ["keypress", "keyup", "keydown"],
            input: ["focus", "change"]
        };
        events.all = [].concat(events.mouse, events.keyboard, events.input);

        paramIt(events.mouse, "#value on an input", function(event) {
            var input = Framer.document().find('#button')[0];
            Simulate(input, event);
            expect(Framer.document().find('#last-button-event').text()).to.equal(event);
        });

        paramIt(events.all, "#value on an input", function(event) {
            var button = Framer.document().find('#text-input')[0];
            Simulate(button, event);
            expect(Framer.document().find('#last-input-event').text()).to.equal(event);
        });

    });

});
