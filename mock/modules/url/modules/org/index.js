const corp = require( './url-corp')
const dept = require( './url-dept')
const title = require( './url-title')
// --APPEND NEW IMPORT HERE--

exports.org = {
  ...corp,
  ...dept,
  ...title
// --APPEND NEW URL HERE--
}
