var path = require('path');
var fsp = require('fs-promise');
var find = require('find-promise');
var babelCore = require("babel-core");
var promisify = require('es6-promisify');
var srcDir = path.resolve(path.join(__dirname,'..','src'));
var srcFiles = find.fileSync(/\.js$/, srcDir).map(function(file) {
    return file.replace(srcDir + '/', '');
});

Promise.all("0,0.10,0.12,4,6, 7.6".split(',').map(function(version) {
  version = parseFloat(version) || 'browser';
  var dstDir = path.resolve(path.join(__dirname,'..', 'dist', String(version)));
  return Promise.all(srcFiles.map(function(srcFile) {
    var inputFile = path.resolve(path.join(srcDir, srcFile));
    if (version === 7) {
      return fsp.readFile(inputFile).then(saveFile);
    }
    var babelrc = {
      "presets": [
        ["env", {
          "targets": {
            "node": version
          }
        }]
      ]
    };
    if (version < 6) {
      babelrc.plugins= [
        ["transform-runtime", {
          "polyfill": false,
          "regenerator": true
        }]
      ];
    }
    if (version === 'browser') {
      babelrc.presets[0][1].targets = ["last 3 versions"];
    }
    return promisify(babelCore.transformFile, {multiArgs: true})(inputFile, babelrc).then(
      function(result) {
         return saveFile(result[0].code);
      });
    function saveFile(content) {
      return fsp.ensureFile(path.resolve(path.join(dstDir, srcFile)))
        .then(function() {
          return fsp.writeFile(path.resolve(path.join(dstDir, srcFile)), content);
      });
    }
  }))
})).then(function() {
    console.log("done build");
  }).catch(
  function(e) {
    console.error(e);
    throw new Error(e);
  }
);
