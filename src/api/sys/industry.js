import request from '@/utils/request'
import { adornParams, adornData } from '@/utils'
import URL from '../url'

// 菜单类型
export const levels = [
  {
    tag: 'success',
    name: '一级',
    key: 1
  },
  {
    tag: 'primary',
    name: '二级',
    key: 2
  },
  {
    tag: 'warning',
    name: '三级',
    key: 3
  },
  {
    tag: 'danger',
    name: '四级',
    key: 4
  },
  {
    tag: 'info',
    name: '五级',
    key: 5
  }
]

/**
 * 根据函数名获取URL
 *
 * @export
 * @param {*} functionName
 * @returns
 */
export function url (functionName) {
  return URL.sys.industry[functionName.replace(/([A-Z])/g, '_$1').toUpperCase()]
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

/*
 * 查询顶层数据
 */
export function tops (params = { page: 1, limit: 20 }) {
  return request({
    url: url('tops'),
    method: 'get',
    params: adornParams(params)
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
 * 获取父节点以及兄弟节点
 * @param {*} id
 */
export function getParentBrothers (id) {
  return request({
    url: url('getParentBrothers') + `/${id}`,
    method: 'get',
    params: adornParams()
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
