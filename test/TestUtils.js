const sinon = require('sinon');

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
    }
};