import Cookies from 'js-cookie'

const TokenKey = 'ktf_dashboard_vue_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/**
 *根据模块和函数判断名是否能够访问
 *
 * @export
 * @param {string} module
 * @param {string} method
 * @returns
 */
export function isAccess(module, method) {
  // console.log(module)
  // todo 添加代码
  return true
}
