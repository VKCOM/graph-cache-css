var parser = require('./lib/parser');

module.exports = function(sign, file, filename) {
  return parser.createGraphFromFile(file, sign, Object.assign({}, { filename: filename }));
}
