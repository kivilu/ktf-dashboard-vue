import request from '@/utils/request'
import { adornParams, adornData } from '@/utils'
import URL from '../url'

/**
 * 根据函数名获取URL
 *
 * @export
 * @param {*} method
 * @returns
 */
export function url(method) {
  return URL.permission.role[method.replace(/([A-Z])/g, '_$1').toUpperCase()]
}

/*
 *根据ID查询
 */
export function getInfo(id) {
  return request({
    url: url('getInfo') + `/${id}`,
    method: 'get',
    params: adornParams()
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

/**
 * 企业ID
 * @param {String,Long}} orgId
 */
export function list(orgId) {
  return request({
    url: url('list') + `/${orgId}`,
    method: 'get',
    params: adornParams()
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
  return ids.length === 1 ? removeOne(ids[0]) : removeBatch(ids)
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
