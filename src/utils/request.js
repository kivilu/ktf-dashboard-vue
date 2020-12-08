import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { adornParams } from '@/utils'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
  // `paramsSerializer` 是一个负责 `params` 序列化的函数
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  // paramsSerializer: function(params) {
  //   return Qs.stringify(params, { arrayFormat: 'brackets' })
  // }
})

// request interceptor
service.interceptors.request.use(
  config => {
    //console.log(config) // for debug
    // do something before request is sent
    config.params = adornParams(config.params)

    if (store.getters.token) {
      // let each request carry token
      // [x-access-token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['x-access-token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200 && res.code !== 202) {
      // 401- token失效, 403-无权限
      if (res.code === 401 || res.code === 403) {
        // to re-login
        MessageBox.confirm(
          '您当前的登录状态已经失效, 点击【取消】留在当前页, 或者重新登录系统。',
          '退出确认',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload() // 刷新页面
          })
        })
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
