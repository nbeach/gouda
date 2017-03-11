module.exports = function(event) {
    if(event.state !== 'finished') {
        console.log("%s - %s", event.state, event.name);
    } else {
        console.log("Finished - Passed: %s, Failed: %s", event.passes, event.failures);
    }

};