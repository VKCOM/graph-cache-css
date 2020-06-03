var parser = require('./lib/parser');

/**
 * @param {Function<string|Buffer>} sign
 * @param {Buffer} file
 * @param {Object} options
 * @param {string} options.filename
 * @param {?string[]} options.path
 * @return {Promise<Graph>}
 */
module.exports = function(sign, file, options) {
  return parser.createGraphFromFile(file, sign, options);
}
