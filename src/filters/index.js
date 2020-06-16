import global from '../global'

// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [{
    value: 1E18,
    symbol: 'E'
  },
  {
    value: 1E15,
    symbol: 'P'
  },
  {
    value: 1E12,
    symbol: 'T'
  },
  {
    value: 1E9,
    symbol: 'G'
  },
  {
    value: 1E6,
    symbol: 'M'
  },
  {
    value: 1E3,
    symbol: 'k'
  }]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 用户类型e-tag标签类型
 * @param {number} userType 用户类型
 */
export function userTypeTagFilter(userType) {
  var result = global.userTypes.find(item => item.key === userType)
  return result ? result.tag : 'info'
}

/**
 * 用户类型描述
 * @param {number} userType 用户类型
 */
export function userTypeFilter(userType) {
  var result = global.userTypes.find(item => item.key === userType)
  return result ? result.name : userType
}

/**
 * KTF状态e-tag标签类型
 * @param {number} status 状态值
 */
export function ktfStatusTagFilter(status) {
  var result = global.ktfStatus.find(item => item.key === status)
  return result ? result.tag : 'info'
}

/**
 * KTF状态描述
 * @param {number} status 状态值
 */
export function ktfStatusFilter(status) {
  // console.log(status)
  var result = global.ktfStatus.find(item => item.key === status)
  return result ? result.name : status
}
