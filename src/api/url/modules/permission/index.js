
import user from './url-user'
import menu from './url-menu'
import role from './url-role'
// --APPEND NEW IMPORT HERE--

exports.permission = {
  ...user,
  ...menu,
  ...role
  // --APPEND NEW URL HERE--
}
