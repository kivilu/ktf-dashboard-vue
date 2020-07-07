import permission from './modules/permission'
import sys from './modules/sys'
import org from './modules/org'
// --APPEND NEW IMPORT HERE--

const URL = {
  ...permission,
  ...sys,
  ...org
  // --APPEND NEW URL HERE--
}

// console.log(URL)
export default URL
