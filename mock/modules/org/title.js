import Mock from 'mockjs'
import URL from '../../../src/api/url'
import { loadjson } from '../util'

var datalist = loadjson('title.json')

export default [
  // get title info
  {
    url: `${URL.org.title.GET_INFO}\.*`,
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

      const key = `${process.env.VUE_APP_BASE_API}/org/title/info/`
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
  // query title by page
  {
    url: `${URL.org.title.PAGE}`,
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
  // LIST
  {
    url: `${URL.org.title.LIST}`,
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

      const { corpId, deptId, deptPid } = config.query

      var result = datalist.filter(
        item => item.deptId == deptId || item.deptId == deptPid
      )
      if (result.length === 0) {
        result = datalist.filter(item => item.corpId == corpId)
      }

      console.log(result)

      return { msg: 'success', code: 200, data: result }
    }
  },
  // new title
  {
    url: `${URL.org.title.SAVE}`,
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
  // update title
  {
    url: `${URL.org.title.UPDATE}`,
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
  // remove title
  {
    url: `${URL.org.title.DELETE}\.*`,
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
      const key = `${process.env.VUE_APP_BASE_API}/org/title/delete/`
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
  // batch remove title
  {
    url: `${URL.org.title.DELETE}`,
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
