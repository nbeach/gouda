const _ = require('lodash');

function ScriptLoader(fs) {
    let _workingDirectory = "";
    let _transformers = [];

    let _transformFiles = (files) => {
        let transformedFiles = files;
        for(let transformer of _transformers) {
            transformedFiles = _.map(transformedFiles, transformer);
        }

        return transformedFiles;
    };

    let _readFiles = (files) => {
        return _.map(files, file => fs.readFileSync(_workingDirectory + file));
    };

    this.workingDirectory = (workingDirectory) => {
        _workingDirectory = workingDirectory;
        return this;
    };

    this.transform = (transformer) => {
        _transformers.push(transformer);
        return this;
    };

    this.load = (files) => {
        let filesContents = _readFiles(files);
        let transformed = _transformFiles(filesContents);
        return transformed.join("\n");
    };

}

module.exports = ScriptLoader;
