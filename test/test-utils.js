const sinon = require('sinon');
const decache = require('decache');

module.exports = {
    stubObject: function(methods, returnThis) {
        let obj = {};
        methods.forEach((method) => {
            obj[method] = sinon.stub();
            if(returnThis) {
                obj[method].returns(obj);
            }
        });

        return obj;
    },

    reload: function(path) {
        decache(path);
        return require(path);
    }
};