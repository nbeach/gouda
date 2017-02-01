var paramIt = function(list, name, func) {
    list.forEach(function (value) {
        it(name.replace("#value", value), func.bind(window, value));
    });
};
