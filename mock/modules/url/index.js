const permission = require( './modules/permission' )
const sys = require( './modules/sys')
const org = require( './modules/org')
// --APPEND NEW IMPORT HERE--

const URL = {
  ...permission,
  ...sys,
  ...org
  // --APPEND NEW URL HERE--
}

// console.log(URL)
module.exports = URL
