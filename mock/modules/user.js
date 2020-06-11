import Mock from 'mockjs'
import URL from '../../src/api/url'

var datalist = [
  { id: 1, roles: [1], username: 'system', password: '111111', name: '超级管理员', avatar: '' }
]

var tokens = [
  { id: 1, token: 'system-token' }
]

export function getUser(token) {
  var item = tokens.find(el => el.token === token)

  console.log('id:' + item.id)
  var info = datalist.find(el => el.id === item.id)

  return info
}

export default [
  // user login
  {
    url: `${URL.user.LOGIN}`,
    type: 'post',
    response: config => {
      const { username, password } = config.body

      console.log('username: ' + username + ' password: ' + password)

      var user = datalist.find(el => el.username === username && el.password === password)
      console.log(user)
      // 用户不存在
      if (!user) {
        return {
          code: 401,
          msg: 'Account and password are incorrect.'
        }
      }

      var item = tokens.find(el => el.id === user.id)

      return {
        code: 200,
        msg: 'success',
        data: { token: item.token }
      }
    }
  },

  // user logout
  {
    url: `${URL.user.LOGOUT}`,
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
    url: `${URL.user.GET_INFO}\.*`,
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
    url: `${URL.user.PAGE}`,
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

      return { msg: 'success', code: 200, data: result }
    }
  },
  // new user
  {
    url: `${URL.user.SAVE}`,
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
    url: `${URL.user.UPDATE}`,
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
    url: `${URL.user.DELETE}\.*`,
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
      const key = '/dev-api/sys/user/delete/'
      var tmp = turl.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/ig, '$1')

      var list = datalist.filter(item => (item.id !== id))
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
    url: `${URL.user.DELETE}`,
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
  }
]
