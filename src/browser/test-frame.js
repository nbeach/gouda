(function(window) {

    window.testFrame = new (function() {
        var _iframe = null;

        this.setup = function(done) {
            _iframe = window.document.createElement('iframe');
            _iframe.src = "/";
            _iframe.addEventListener("load", function() {
                done();
            });

            window.document.body.appendChild(_iframe);
        };

        this.teardown = function() {
            _iframe.remove();
        };

        this.window = function() {
            return _iframe.contentWindow;
        };

        this.document = function() {
            return _iframe.contentWindow.document;
        };

    })();

})(typeof window === 'undefined' ? global : window);
