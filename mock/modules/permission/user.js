const Mock = require('mockjs')
const URL = require( '../url')
const { loadjson } = require('../util')

var datalist = loadjson('user.json')
// console.log(datalist)

var tokens = [
  { id: 1, token: 'system-token' },
  { id: 1252804599657005058, token: 'admin-token' },
  { id: 1253515083335094273, token: 'admin_audit-token' },
  { id: 1253148402838523905, token: 'admin_biz-token' },
  { id: 1246424122851360770, token: 'api-user-001-token' },
  { id: 1253517097775419394, token: 'auditor-token' },
  { id: 1253152688569962498, token: 'operator_key-token' },
  { id: 1253152808568999938, token: 'reviewer_key-token' }
]

function getUser(token) {
  var item = tokens.find(el => el.token === token)

  var info = datalist.find(el => el.id == item.id)
  // console.log(item)

  return info
}

module.exports = [
  getUser,
  // user login
  {
    url: `${URL.permission.user.LOGIN}`,
    type: 'post',
    response: config => {
      console.log('------login----')
      console.log(config.body)
      const { userName, password } = config.body

      console.log('userName: ' + userName + ' password: ' + password)

      var user = datalist.find(el => el.loginName === userName)
      // 用户不存在
      // 111111的sm3结果 9ftyBiqx1t3Av+y4fcMr7G53P1heHLv5PeOUCBwuDzc= 
      if (!user || password !== '9ftyBiqx1t3Av+y4fcMr7G53P1heHLv5PeOUCBwuDzc=') {
        return {
          code: 401,
          msg: 'Account and password are incorrect.'
        }
      }

      var item = tokens.find(el => el.id == user.id)
      // console.log(item)
      return {
        code: 200,
        msg: 'success',
        data: { token: item.token }
      }
    }
  },

  // user logout
  {
    url: `${URL.permission.user.LOGOUT}`,
    type: 'post',
    response: _ => {
      return {
        code: 200,
        msg: 'success'
      }
    }
  },
  // get user info
  {
    url: `${URL.permission.user.GET_INFO}\.*`,
    type: 'get',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log()

      var info = getUser(token)

      return {
        code: 200,
        msg: '成功',
        data: info
      }
    }
  },
  // query user by page
  {
    url: `${URL.permission.user.PAGE}`,
    type: 'get',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.query)

      var keyword = config.query.keyword || ''
      var result = []
      if (keyword === '') {
        result = datalist
      } else {
        result = datalist.filter(item => item.name.includes(keyword))
      }

      console.log(result)

      return {
        msg: 'success',
        code: 200,
        data: { list: result, total: result.length }
      }
    }
  },
  // new user
  {
    url: `${URL.permission.user.SAVE}`,
    type: 'post',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.query)

      var info = config.body
      info.id = Mock.mock('@id')
      info['gmtCreate'] = Mock.mock('@now')
      info['gmtUpdate'] = Mock.mock('@now')
      datalist.push(info)

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // update user
  {
    url: `${URL.permission.user.UPDATE}`,
    type: 'post',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.query)

      var info = config.body
      var item = datalist.find(item => item.id === info.id)
      if (!item) {
        return {
          code: 501,
          msg: '记录不存在'
        }
      }
      item = info

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // remove user
  {
    url: `${URL.permission.user.DELETE}\.*`,
    type: 'get',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.query)

      var turl = config.url
      const key = `${process.env.VUE_APP_BASE_API}/permission/user/delete/`
      var tmp = turl.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      var list = datalist.filter(item => item.id !== id)
      // console.log(list)
      datalist = list

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // batch remove user
  {
    url: `${URL.permission.user.DELETE}`,
    type: 'post',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.query)

      datalist = datalist.filter(item => !config.data.includes(item.id))
      console.log(datalist)

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // PASSWORD
  {
    url: `${URL.permission.user.PASSWORD}`,
    type: 'post',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // PASSWORD_RESET
  {
    url: `${URL.permission.user.PASSWORD_RESET}`,
    type: 'get',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // PASSWORD_RESET
  {
    url: `${URL.permission.user.PASSWORD_RESET}`,
    type: 'post',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  }
]
