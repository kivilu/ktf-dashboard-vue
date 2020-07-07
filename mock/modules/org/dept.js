import Mock from 'mockjs'
import URL from '../../../src/api/url'
import { loadjson } from '../util'

var datalist = loadjson('dept.json')

export default [
  // get dept info
  {
    url: `${URL.org.dept.GET_INFO}\.*`,
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

      const key = `${process.env.VUE_APP_BASE_API}/org/dept/info/`
      var tmp = config.url.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      console.log('id:' + id)
      var info = datalist.find(el => el.id == id)

      return {
        code: 200,
        msg: '成功',
        data: info
      }
    }
  },
  // query dept by page
  {
    url: `${URL.org.dept.PAGE}`,
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
    url: `${URL.org.dept.GET_CHILDREN}`,
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
      const key = `${process.env.VUE_APP_BASE_API}/org/dept/getChildren/`
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
  // LIST_BY_CORP
  {
    url: `${URL.org.dept.LIST_BY_CORP}`,
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
      const key = `${process.env.VUE_APP_BASE_API}/org/dept/listByCorp/`
      var tmp = turl.replace(key, '')
      const corpId = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      var result = (result = datalist.filter(item => item.corpId == corpId))

      result.forEach(element => {
        var child = datalist.find(item => item.parentId === element.id)
        element.hasChildren = !!child
      })

      console.log(result)

      return {
        msg: 'success',
        code: 200,
        data: result
      }
    }
  },
  // new dept
  {
    url: `${URL.org.dept.SAVE}`,
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
  // update dept
  {
    url: `${URL.org.dept.UPDATE}`,
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
      item.id = info.id
      item.name = info.name

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // remove dept
  {
    url: `${URL.org.dept.DELETE}\.*`,
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
      const key = `${process.env.VUE_APP_BASE_API}/org/dept/delete/`
      var tmp = turl.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      var list = datalist.filter(item => item.id != id)
      // console.log(list)
      datalist = list

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // batch remove dept
  {
    url: `${URL.org.dept.DELETE}`,
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
