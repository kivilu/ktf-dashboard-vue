import Mock from 'mockjs'
import URL from '../../../src/api/url'
import { getUser } from './user'

import { loadjson } from '../util'

var resources = loadjson('resource.json')
// var resources = [
//   { id: 1, parentId: 0, name: '系统管理', url: '', icon: 'component', resourceType: 0, status: 0, seq: 1 },
//   { id: 2, parentId: 1, name: '字典管理', url: 'sys/dic', icon: 'education', resourceType: 1, status: 0, seq: 1 },
//   { id: 3, parentId: 1, name: '菜单管理', url: 'sys/menu', icon: 'tree-table', resourceType: 1, status: 0, seq: 2 },
//   { id: 4, parentId: 1, name: '角色管理', url: 'sys/role', icon: 'people', resourceType: 1, status: 0, seq: 3 },
//   { id: 5, parentId: 1, name: '用户管理', url: 'sys/user', icon: 'peoples', resourceType: 1, status: 0, seq: 4 }
// ]

// SELECT	rr.role_id,	group_concat(rr.resource_id) FROM	ktf_sys_role_resource rr GROUP BY	rr.role_id;
var permissions = [
  {
    roleId: 4,
    ids: [
      1,
      13,
      131,
      132,
      133,
      134,
      135,
      227,
      249,
      250,
      251,
      252,
      253,
      254,
      255,
      256,
      257,
      258,
      259,
      260,
      261,
      262,
      263,
      264,
      265,
      266,
      267,
      301,
      303,
      334,
      335,
      337,
      361,
      362,
      372
    ]
  },
  { roleId: 5, ids: [1, 13, 131, 132, 133, 134, 135, 372] },
  {
    roleId: 6,
    ids: [
      1,
      13,
      311,
      312,
      313,
      315,
      318,
      319,
      320,
      321,
      322,
      323,
      327,
      328,
      343,
      344,
      345,
      346,
      347,
      348,
      349,
      351,
      352,
      353,
      354,
      355,
      356,
      357,
      358,
      359,
      364,
      365,
      366,
      367,
      372
    ]
  },
  {
    roleId: 7,
    ids: [
      1,
      13,
      312,
      314,
      324,
      325,
      326,
      345,
      346,
      347,
      348,
      350,
      357,
      358,
      359,
      372
    ]
  },
  {
    roleId: 8,
    ids: [1, 13, 131, 132, 133, 134, 135, 227, 303, 334, 361, 362, 372]
  }
]

function resource2menu(list) {
  var tmp = list.filter(item => item.resourceType < 2)

  var menus = tmp.map(item => {
    return {
      id: item.id,
      parentId: item.parentId,
      name: item.name,
      url: item.url,
      icon: item.icon,
      resourceType: item.resourceType,
      status: item.status,
      seq: item.seq
    }
  })

  // console.log(menus)

  return menus
}

function getMenus(roleIds) {
  console.log(roleIds)
  if (roleIds.includes('1')) {
    //
    return resource2menu(resources)
  }

  var list = permissions.filter(item => roleIds.includes(item.roleId))
  return resource2menu(list)
}

export default [
  // get nav
  {
    url: `${URL.permission.menu.NAV}`,
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

      console.log(user)

      var menus = getMenus(user.roleIds)

      return {
        code: 200,
        msg: '成功',
        data: menus
      }
    }
  },
  // get menu info
  {
    url: `${URL.permission.menu.GET_INFO}\.*`,
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
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      // console.logconsole.log('id:' + id)
      var info = resources.find(el => el.id == id)
      // console.log('info:' + info)

      return {
        code: 200,
        msg: '成功',
        data: info
      }
    }
  },
  // query dic by page
  {
    url: `${URL.permission.menu.PAGE}`,
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
      var pid = config.query.pid || 0
      var end = config.query.page * config.query.limit
      var begin = end - config.query.limit
      begin = begin < 0 ? 0 : begin

      // console.log('begin:' + begin)
      // console.log('end:' + end)

      var result = []
      if (keyword === '') {
        result = resources.filter(item => item.parentId == pid)
        result = result.slice(begin, end)
      } else {
        result = resources.filter(item => item.name.includes(keyword))
        result = result.slice(begin, end)
        // 查找没有包含的父节点
        var parents = []
        result.forEach(element => {
          if (!result.find(item => item.id === element.parentId)) {
            var parent = resources.find(item => item.id === element.parentId)
            parents.push(parent)
          }
        })
        result = result.concat(parents)
      }

      result.forEach(element => {
        var child = resources.find(item => item.parentId === element.id)
        element.hasChildren = !!child
      })

      console.log(result)

      return {
        msg: 'success',
        code: 200,
        data: { list: result, total: result.length }
      }
    }
  },
  // getChildren
  {
    url: `${URL.permission.menu.GET_CHILDREN}`,
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

      var turl = config.url
      const key = '/dev-api/sys/menu/getChildren/'
      var tmp = turl.replace(key, '')
      const params = tmp
        .replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')
        .split('/')

      console.log(params)
      const pid = params[0]
      const isMenu = params[1]

      var result =
        isMenu === 'false'
          ? resources.filter(item => item.parentId == pid)
          : resources.filter(
              item => item.parentId == pid && item.resourceType < 2
            )

      result.forEach(element => {
        var child =
          isMenu === 'false'
            ? resources.find(item => item.parentId === element.id)
            : resources.find(
                item => item.parentId === element.id && item.resourceType < 2
              )
        // console.log(child)
        element.hasChildren = !!child
      })

      return { msg: 'success', code: 200, data: result }
    }
  },
  // new menu
  {
    url: `${URL.permission.menu.SAVE}`,
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

      // console.log(config.query)

      var info = config.body
      info.id = Mock.mock('@id')
      info['gmtCreate'] = Mock.mock('@now')
      info['gmtUpdate'] = Mock.mock('@now')
      resources.push(info)

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // update menu
  {
    url: `${URL.permission.menu.UPDATE}`,
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

      // console.log(config.query)

      var info = config.body
      var item = resources.find(item => item.id === info.id)
      if (!item) {
        return {
          code: 501,
          msg: '记录不存在'
        }
      }
      item.id = info.id
      item.parentId = info.parentId
      item.name = info.name
      item.url = info.url
      item.icon = info.icon
      item.resourceType = info.resourceType
      item.seq = info.seq
      item.status = info.status

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // remove menu
  {
    url: `${URL.permission.menu.DELETE}\.*`,
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

      // console.log(config.query)

      var turl = config.url
      const key = '/dev-api/sys/menu/delete/'
      var tmp = turl.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      var list = resources.filter(item => item.id != id && item.parentId != id)
      // console.log(list)
      resources = list

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // batch remove menu
  {
    url: `${URL.permission.menu.DELETE}`,
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

      // console.log(config.query)

      resources = resources.filter(item => !config.data.includes(item.id))

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  }
]
