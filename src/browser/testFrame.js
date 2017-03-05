((window) => {

    window.testFrame = new (function() {
        let _iframe = null;

        this.setup = (done) => {
            _iframe = window.document.createElement('iframe');
            _iframe.src = "/";
            _iframe.style = "height:500px; width:100%"; //TODO: How should sizing be handled?
            _iframe.addEventListener("load", () => {
                done();
            });

            window.document.body.appendChild(_iframe);
        };

        this.teardown = () => {
            _iframe.remove();
        };

        this.window = () => {
            return _iframe.contentWindow;
        };

        this.document = () => {
            return _iframe.contentWindow.document;
        };

    })();

})(typeof window === 'undefined' ? global : window);
