var fs = require('fs');
var path = require('path');
var currentVersion = parseFloat(process.version.replace(/^v/, ''));
var distDir = path.resolve(path.join(__dirname, '..', 'dist'));
var version = fs.readdirSync(distDir,  'utf-8').filter(function(file) {
  return file !== 'index.js' && file !== 'browser';
}).reduce(function(p, c) {
  if (parseFloat(c) <= currentVersion || parseInt(currentVersion) >= parseFloat(c)) {
    return c;
  }
  return p;
} , 0);

fs.writeFileSync(path.join(distDir, 'index.js'), fs.readFileSync(path.join(distDir, version, 'index.js')));
fs.writeFileSync(path.join(distDir, 'test.js'), fs.readFileSync(path.join(distDir, version, 'test.js')));
console.log("done install realtimeout for node version", version);
