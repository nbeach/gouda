(function(window, $) {
    $("html, body").css("height", "100%");

    var Framer = {};
    var $frame = null;
    var frameWindow = null;
    var $document = null;

    Framer.setup = function(done) {
        $frame = $('<iframe style="height: 90%; width: 100%;" src="/target"></iframe>');
        $("body").append($frame);

        $frame.on("load", function () {
            frameWindow = this.contentWindow;
            $document = $(frameWindow.document);
            done();
        });
    };

    Framer.teardown = function() {
        $frame.remove();
    };

    Framer.window = function() {
        return frameWindow;
    };

    Framer.document = function() {
        return $document;
    };

    window.Framer = Framer;

})(window, jQuery);