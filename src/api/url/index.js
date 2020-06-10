import user from './modules/url-user.js'
import menu from './modules/url-menu.js'
import dic from './modules/url-dic.js'
import role from './modules/url-role.js'
// --APPEND NEW IMPORT HERE--

const URL = {
  ...user,
  ...menu,
  ...dic,
  ...role
  // --APPEND NEW URL HERE--
}

// console.log(url)
export default URL
