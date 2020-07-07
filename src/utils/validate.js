/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
    s
  )
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isTelephone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(http?:|https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return /^(?=.*[a-zA-Z])[\da-zA-Z-_.@]{0,}$/.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 密码校验
 * @param {string} s   密码
 * @param {boolean} complex 是否为复杂密码
 */
export function validPassword(s, complex = true) {
  return complex
    ? /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8}$/.test(s)
    : /^[a-zA-Z0-9]{8}$/.test(s)
}
/**
 * URL匹配
 * @param {string} fullurl
 * @param {string} key
 */
export function urlMacher(fullurl, key) {
  var matchers = fullurl.match(
    /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-zA-Z.-]+)?/
  )
  // console.log(matchers)

  var url = !matchers ? '' : matchers[0]

  var mkey = key.match(/[/0-9a-zA-Z.]+/)
  // console.log(url.match(mkey))
  var regexp = new RegExp(
    key.endsWith('*') ? `.*?(${mkey[0]})` : `.*?(${key})$`
  )
  // console.log(url.match(regexp))
  return regexp.test(url)
}

/**
 * URI匹配
 * @param {string} fullUri
 * @param {string} key
 */
export function uriMacher(fullUri, key) {
  var matchers = fullUri.match(/([/0-9a-zA-Z.-]+)?/)
  // console.log(fullUri)
  // console.log(matchers)

  var url = !matchers ? '' : matchers[0]

  var mkey = key.match(/[/0-9a-zA-Z.]+/)
  // console.log(url.match(mkey))
  var regexp = new RegExp(
    key.endsWith('*') ? `.*?(${mkey[0]})` : `.*?(${key})$`
  )
  // console.log(url.match(regexp))
  return regexp.test(url)
}
