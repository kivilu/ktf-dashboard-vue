import Mock from 'mockjs'
import URL from '../../../src/api/url'
import { loadjson } from '../util'

var datalist = loadjson('dic.json')

export default [
  // GET_SETTINGS
  {
    url: `${URL.sys.dic.GET_SETTINGS}`,
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

      var result = []
      var setting = datalist.find(el => el.varCode === 'RUNTIME_SETTINGS')
      if (setting) {
        var list = datalist.filter(el => el.parentId === setting.id)
        list.forEach(item => {
          result.push({ key: item.varCode, value: item.varValue })
        })
      }

      return {
        code: 200,
        msg: '成功',
        data: result
      }
    }
  },
  // get dic info
  {
    url: `${URL.sys.dic.GET_INFO}\.*`,
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

      console.log(config.url)

      const key = '/dev-api/sys/dic/info/'
      var tmp = config.url.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      console.log('id:' + id)

      var result = {
        id: 0,
        varName: null,
        varCode: '',
        parentId: 0,
        parentName: null
      }

      var info = datalist.find(el => el.id === id)
      if (info) {
        result.id = info.id
        result.varCode = info.varCode
        result.varName = info.varName
        result.parentId = info.parentId
      }

      var pinfo = datalist.find(el => el.id === info.parentId)
      if (pinfo) {
        result.parentName = pinfo.name
      }

      return {
        code: 200,
        msg: '成功',
        data: result
      }
    }
  },
  // query all dic
  {
    url: `${URL.sys.dic.LIST}`,
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
        var items = datalist.filter(item => item.varName.includes(keyword))
        var pids = items.map(item => item.parentId)
        // console.log(pids)
        result = items.concat(datalist.filter(item => pids.includes(item.id)))
      }

      console.log(result)

      return { msg: 'success', code: 200, data: result }
    }
  },
  // query dic by page
  {
    url: `${URL.sys.dic.PAGE}`,
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
        result = datalist.filter(item => item.parentId == pid)
        result = result.slice(begin, end)
      } else {
        result = datalist.filter(item => item.varName.includes(keyword))
        result = result.slice(begin, end)
        // 查找没有包含的父节点
        var parents = []
        result.forEach(element => {
          if (!result.find(item => item.id === element.parentId)) {
            var parent = datalist.find(item => item.id === element.parentId)
            parents.push(parent)
          }
        })
        result = result.concat(parents)
      }

      result.forEach(element => {
        var child = datalist.find(item => item.parentId === element.id)
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
    url: `${URL.sys.dic.GET_CHILDREN}`,
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
      const key = '/dev-api/sys/dic/getChildren/'
      var tmp = turl.replace(key, '')
      const pid = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      console.log(pid)

      var result = datalist.filter(item => item.parentId == pid)
      console.log(result)

      result.forEach(element => {
        var child = datalist.find(item => item.parentId == element.id)
        element.hasChildren = !!child
      })

      console.log(result)

      return { msg: 'success', code: 200, data: result }
    }
  },
  // new dic
  {
    url: `${URL.sys.dic.SAVE}`,
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
      console.log(config.body)
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
  // update dic
  {
    url: `${URL.sys.dic.UPDATE}`,
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
      item.varCode = info.varCode
      item.varName = info.varName
      item.parentId = info.parentId

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // remove dic
  {
    url: `${URL.sys.dic.DELETE}\.*`,
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
      const key = '/dev-api/sys/dic/delete/'
      var tmp = turl.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      var list = datalist.filter(item => item.id !== id && item.parentId !== id)
      // console.log(list)
      datalist = list

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // batch remove dic
  {
    url: `${URL.sys.dic.DELETE}`,
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

      console.log(config.data)

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
