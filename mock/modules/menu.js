import Mock from 'mockjs'
import URL from '../../src/api/url'
import { getUser } from './user'

var datalist = [
  { id: 1, parentId: 0, name: '系统管理', url: '/sys', icon: 'component' },
  { id: 2, parentId: 1, name: '字典管理', url: '/sys/dic', icon: 'education' },
  { id: 3, parentId: 1, name: '菜单管理', url: '/sys/menu', icon: 'tree-table' },
  { id: 4, parentId: 1, name: '角色管理', url: '/sys/role', icon: 'people' },
  { id: 5, parentId: 1, name: '用户管理', url: '/sys/user', icon: 'peoples' }
]

var permissions = [
  { roleId: 2, ids: [2, 3] }
]

function getMenus(roles) {
  var menus = []
  var list = permissions.filter(item => roles.includes(item.roleId))

  list.forEach(item => {
    var ele = datalist.filter(m => item.ids.includes(m.id))
    menus = menus.concat(ele)
  })

  return menus
}

export default [
  // get nav
  {
    url: `${URL.menu.NAV}`,
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
      var user = getUser(token)

      var menus = user.id === 1 ? datalist : getMenus(user.roles)

      return {
        code: 200,
        msg: '成功',
        data: menus
      }
    }
  },
  // get menu info
  {
    url: `${URL.menu.GET_INFO}\.*`,
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

      const key = '/dev-api/sys/menu/info/'
      var tmp = config.url.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/ig, '$1')

      console.log('id:' + id)
      var info = datalist.find(el => el.id === id)

      return {
        code: 200,
        msg: '成功',
        data: info
      }
    }
  },
  // query menu by page
  {
    url: `${URL.menu.PAGE}`,
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
        result = datalist.filter(item => item.varName.includes(keyword))
      }

      console.log(result)

      return { msg: 'success', code: 200, data: result }
    }
  },
  // new menu
  {
    url: `${URL.menu.SAVE}`,
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
  // update menu
  {
    url: `${URL.menu.UPDATE}`,
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
  // remove menu
  {
    url: `${URL.menu.DELETE}\.*`,
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
      const key = '/dev-api/sys/menu/delete/'
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
  // batch remove menu
  {
    url: `${URL.menu.DELETE}`,
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
