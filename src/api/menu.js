import request from '@/utils/request'
import URL from './url'
import { adornParams, adornData } from '@/utils'

/**
 * 根据函数名获取URL
 *
 * @export
 * @param {*} method
 * @returns
 */
export function url(method) {
  return URL.menu[method.replace(/([A-Z])/g, '_$1').toUpperCase()]
}
/**
 * 用户可访问的菜单
 * @export
 */
export function nav() {
  return request({
    url: url('nav'),
    method: 'get'
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
 * 查找全部菜单
 */
export function list(params) {
  return request({
    url: url('list'),
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
    data: adornData(data)
  })
}

/*
 * 更新
 */
export function update(data) {
  return request({
    url: url('update'),
    method: 'post',
    data: adornData(data)
  })
}

/*
 *删除
 */
export function remove(ids) {
  return ids.length === 1 ? removeOne(ids) : removeBatch(ids)
}

// 批量操作函数

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
