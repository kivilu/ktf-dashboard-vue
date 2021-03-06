import request from '@/utils/request'
import URL from '../url'
import { adornParams, adornData } from '@/utils'

/**
 * 根据函数名获取URL
 *
 * @export
 * @param {*} method
 * @returns
 */
export function url(method) {
  return URL.permission.user[method.replace(/([A-Z])/g, '_$1').toUpperCase()]
}

export function login(data) {
  return request({
    url: url('login'),
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: url('logout'),
    method: 'post'
  })
}

export function getInfo(token) {
  return request({
    url: url('getInfo'),
    method: 'get',
    params: { token }
  })
}

/*
 * 分页查找服务
 */
export function page(params) {
  return request({
    url: url('page'),
    method: 'get',
    params: adornParams(params)
  })
}

/*
 *创建
 */
export function save(data) {
  return request({
    url: url('save'),
    method: 'post',
    data: data
  })
}

/*
 * 更新
 */
export function update(data) {
  return request({
    url: url('update'),
    method: 'post',
    data: data
  })
}

/*
 *删除
 */
export function remove(ids) {
  return ids.length === 1 ? removeOne(ids[0]) : removeBatch(ids)
}

/**
 * 修改密码
 * @param {Object} data 对象内容格式{password:'',newPassword:''}
 */
export function password(data) {
  return request({
    url: url('password'),
    method: 'post',
    data: data
  })
}

/**
 * 重置选中用户的密码
 * @param {Long} id
 */
export function restUserPassword(id) {
  return request({
    url: url('passwordReset') + `/${id}`,
    method: 'get'
  })
}

/**
 * 重置自身密码
 * @param {Object} data
 */
export function restSelfPassword(data) {
  return request({
    url: url('passwordReset'),
    method: 'post',
    data: data
  })
}

// 本地函数
/*
 *单个删除
 */
function removeOne(id) {
  return request({
    url: url('delete') + `/${id}`,
    method: 'get'
  })
}
/*
 * 批量删除
 */
function removeBatch(ids) {
  return request({
    url: url('delete'),
    method: 'post',
    data: adornData(ids)
  })
}
