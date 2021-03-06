const Mock = require('mockjs')
const URL = require( '../url')
const { loadjson } = require('../util')

var datalist = loadjson('industry.json')

module.exports = [
  // get industry info
  {
    url: `${URL.sys.industry.GET_INFO}\.*`,
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

      const key = `${process.env.VUE_APP_BASE_API}/sys/industry/info/`
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
    url: `${URL.sys.industry.TOPS}`,
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

      var pid = 0
      var keyword = config.query.keyword || ''
      var end = config.query.page * config.query.limit
      var begin = end - config.query.limit
      begin = begin < 0 ? 0 : begin

      console.log('keyword:' + keyword)

      var result = []
      if (keyword === '') {
        result = datalist.filter(item => item.pid == pid)
        console.log(result)
        result = result.slice(begin, end)
      } else {
        var targets = datalist.filter(item => item.name.includes(keyword))
        var rids = getParents(pid, datalist, targets, { pid: 'pid' })
        result = datalist.filter(item => rids.includes(item.id))

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
    url: `${URL.sys.industry.GET_CHILDREN}`,
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
      const key = `${process.env.VUE_APP_BASE_API}/sys/industry/getChildren/`
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
  // getParentBrothers
  {
    url: `${URL.sys.industry.GET_PARENT_BROTHERS}`,
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
      const key = `${
        process.env.VUE_APP_BASE_API
        }/sys/industry/getParentBrothers/`
      var tmp = turl.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/gi, '$1')

      var mine = datalist.find(item => item.id == id)
      if (mine) {
        var parent = datalist.find(item => item.id == mine.pid)
        var brothers = datalist.filter(item => item.pid == mine.pid)
        // console.log(children)

        brothers.forEach(element => {
          var child = datalist.find(item => item.pid == element.id)
          element.hasChildren = !!child
        })

        parent.children = brothers
        parent.hasChildren = true
      }

      console.log(parent)

      return { msg: 'success', code: 200, data: parent }
    }
  },
  // new industry
  {
    url: `${URL.sys.industry.SAVE}`,
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
  // update industry
  {
    url: `${URL.sys.industry.UPDATE}`,
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
  // remove industry
  {
    url: `${URL.sys.industry.DELETE}\.*`,
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
      const key = `${process.env.VUE_APP_BASE_API}/sys/industry/delete/`
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
  // batch remove industry
  {
    url: `${URL.sys.industry.DELETE}`,
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
