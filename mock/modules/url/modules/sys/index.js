const dic = require( './url-dic')
const log = require( './url-log')
const industry = require( './url-industry')
const region = require( './url-region')
// --APPEND NEW IMPORT HERE--

exports.sys = {
  ...dic,
  ...log,
  ...industry,
  ...region
  // --APPEND NEW URL HERE--
}
