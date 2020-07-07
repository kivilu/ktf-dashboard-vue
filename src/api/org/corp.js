import request from '@/utils/request'
import { adornParams, adornData } from '@/utils'
import URL from '../url'

export const ENTERPRISE_TYPES = [
  {
    tag: 'danger',
    name: '政府',
    key: 0
  },
  {
    tag: 'warning',
    name: '事业',
    key: 1
  },
  {
    tag: 'primary',
    name: '国企',
    key: 2
  },
  {
    tag: 'success',
    name: '民企',
    key: 3
  },
  {
    tag: 'info',
    name: '外企',
    key: 4
  }
]

/**
 * 根据函数名获取URL
 *
 * @export
 * @param {*} functionName
 * @returns
 */
export function url(functionName) {
  return URL.org.corp[functionName.replace(/([A-Z])/g, '_$1').toUpperCase()]
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
 * 分页查找数据
 */
export function page(params) {
  return request({
    url: url('page'),
    method: 'get',
    params: adornParams(params)
  })
}

/**
 * 根据关键字查询
 * @param {string}} params
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

/**
 * 根据ID删除文件
 */
export function removeFileById(id) {
  return request({
    url: url('deleteFileById') + `/${id}`,
    method: 'get'
  })
}

/**
 * 根据文件名删除文件
 */
export function removeFileByName(fileName) {
  return request({
    url: url('deleteFileByName') + `/${fileName}`,
    method: 'get'
  })
}
