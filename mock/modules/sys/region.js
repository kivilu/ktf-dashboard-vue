const Mock = require('mockjs')
const URL = require( '../url')
const { loadjson } = require('../util')

var datalist = loadjson('region.json')

module.exports = [
  // get region info
  {
    url: `${URL.sys.region.GET_INFO}\.*`,
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

      const key = `${process.env.VUE_APP_BASE_API}/sys/region/info/`
      var tmp = config.url.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      console.log('id:' + id)
      var info = datalist.find(el => el.id === id)

      return {
        code: 200,
        msg: '成功',
        data: info
      }
    }
  },
  // TOPS
  {
    url: `${URL.sys.region.TOPS}`,
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

      var keyword = config.query.keyword || ''
      var pid = config.query.pid || 0
      var end = config.query.page * config.query.limit
      var begin = end - config.query.limit
      begin = begin < 0 ? 0 : begin

      if (keyword === '') {
        result = datalist.filter(item => item.pid == pid)
        result = result.slice(begin, end)
      } else {
        var targets = resources.filter(item => item.name.includes(keyword))
        var rids = getParents(pid, resources, targets)
        result = resources.filter(item => rids.includes(item.id))

        result = result.slice(begin, end)
      }

      result.forEach(ele => {
        if (ele) {
          var child = datalist.find(item => item && item.pid === ele.id)
          ele.hasChildren = !!child
        }
      })

      return {
        msg: 'success',
        code: 200,
        data: { list: result, total: result.length }
      }
    }
  },
  // getChildren
  {
    url: `${URL.sys.region.GET_CHILDREN}`,
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
      const key = `${process.env.VUE_APP_BASE_API}/sys/region/getChildren/`
      var tmp = turl.replace(key, '')
      const pid = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      console.log(pid)

      var result = datalist.filter(item => item.pid == pid)
      console.log(result)

      result.forEach(element => {
        var child = datalist.find(item => item.pid == element.id)
        element.hasChildren = !!child
      })

      console.log(result)

      return { msg: 'success', code: 200, data: result }
    }
  },
  // new region
  {
    url: `${URL.sys.region.SAVE}`,
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
  // update region
  {
    url: `${URL.sys.region.UPDATE}`,
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
  // remove region
  {
    url: `${URL.sys.region.DELETE}\.*`,
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
      const key = `${process.env.VUE_APP_BASE_API}/sys/region/delete/`
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
  // batch remove region
  {
    url: `${URL.sys.region.DELETE}`,
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
  // get provinces
  {
    url: `${URL.sys.region.PROVINCES}`,
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

      var name = config.query.name || ''

      console.log(name)
      const types = [20, 21, 22, 23]
      var result = datalist.filter(item => types.includes(item.type))

      if (name) {
        result = result.filter(item => item.name.includes(name))
      }

      return { msg: 'success', code: 200, data: result }
    }
  }
]
