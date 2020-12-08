import request from '@/utils/request'
import { adornParams, adornData } from '@/utils'
import URL from '../url'

/**
 * 根据函数名获取URL
 *
 * @export
 * @param {*} functionName
 * @returns
 */
export function url (functionName) {
  return URL.org.dept[functionName.replace(/([A-Z])/g, '_$1').toUpperCase()]
}

/*
 *根据ID查询
 */
export function getInfo (id) {
  return request({
    url: url('getInfo') + `/${id}`,
    method: 'get',
    params: adornParams()
  })
}

/**
 *
 * @param {*} pid
 */
export function getChildren (pid) {
  return request({
    url: url('getChildren') + `/${pid}`,
    method: 'get',
    params: adornParams()
  })
}

/**
 * 根据企业ID查询部门
 * @param {*} corpId
 */
export function listByCorp (corpId) {
  return request({
    url: url('listByCorp') + `/${corpId}`,
    method: 'get',
    params: adornParams()
  })
}

/*
 * 查找顶级部门
 */
export function tops (params = { page: 1, limit: 20 }) {
  return request({
    url: url('tops'),
    method: 'get',
    params: adornParams(params)
  })
}

/*
 *创建
 */
export function save (data) {
  return request({
    url: url('save'),
    method: 'post',
    data: adornData(data)
  })
}

/*
 * 更新
 */
export function update (data) {
  return request({
    url: url('update'),
    method: 'post',
    data: adornData(data)
  })
}

/*
 *删除
 */
export function remove (ids) {
  return ids.length === 1 ? removeOne(ids[0]) : removeBatch(ids)
}

// 本地函数
/*
 *单个删除
 */
function removeOne (id) {
  return request({
    url: url('delete') + `/${id}`,
    method: 'get'
  })
}
/*
 * 批量删除
 */
function removeBatch (ids) {
  return request({
    url: url('delete'),
    method: 'post',
    data: adornData(ids)
  })
}
