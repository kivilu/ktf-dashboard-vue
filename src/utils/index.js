import qs from 'qs'
import merge from 'lodash/merge'

/**
 * 类型转换
 * @param {*} value
 * @param {*} dstType
 */
export function typeConvert(value, dstType) {
  if (typeof dstType === 'string') {
    return String(value)
  } else if (typeof dstType === 'boolean') {
    return value !== 'false'
  } else if (typeof dstType === 'number') {
    return Number(value)
  }

  return value
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (!time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
export function adornParams(params = {}, openDefultParams = true) {
  var defaults = {
    t: new Date().getTime()
  }

  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
export function adornData(data = {}, contentType = 'json') {
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

/**
 * 读取指定目录下的js module
 * @param {Array} modulesFiles js files
 */
export function jsModules(modulesFiles) {
  // you do not need `import app from './modules/app'`
  // it will auto require all vuex module from modules file
  return modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
  }, {})
}

/**
 * list===>tree
 * @param {*} arr  数据list
 */
export function list2tree(
  arr,
  rootId = '0',
  props = { id: 'id', pid: 'parentId', children: 'children' }
) {
  var result = []
  if (!arr || arr.length === 0) {
    return result
  }

  const cloneData = JSON.parse(JSON.stringify(arr))
  result = cloneData.filter(father => {
    const branchArr = cloneData.filter(
      child => father[props.id] === child[props.pid]
    )
    if (branchArr.length > 0) {
      father[props.children] = branchArr
      father['hasChildren'] = true
    } else {
      father[props.children] = ''
    }

    return father[props.pid] == rootId
  })

  // console.log('最终结果' + JSON.stringify(result))

  return result
}

export function childrenOfTree(tree, id) {
  if (!tree) {
    return null
  }

  var element = tree.find(item => item.id === id)
  if (element) {
    return element.children
  }

  tree.forEach(item => {
    var children = childrenOfTree(item.children, id)
    if (children) {
      return children
    }
  })
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}