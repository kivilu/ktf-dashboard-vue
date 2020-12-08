const user = require( './url-user')
const menu = require( './url-menu')
const role = require( './url-role')
// --APPEND NEW IMPORT HERE--

const permission = {
  ...user,
  ...menu,
  ...role
  // --APPEND NEW URL HERE--
}

module.exports={
  permission
}