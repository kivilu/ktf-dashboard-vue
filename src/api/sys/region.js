import request from '@/utils/request'
import { adornParams, adornData } from '@/utils'
import URL from '../url'

// 类型：0：国家，1：区域，2：20省份（21直辖市22自治区23特别行政区），3：城市，4：区县，5：村镇
export const REGION_TYPES = [
  {
    tag: 'danger',
    name: '国家',
    key: 0
  },
  {
    tag: 'primary',
    name: '地区',
    key: 1
  },
  {
    tag: 'warning',
    name: '省份',
    key: 20
  },
  {
    tag: 'warning',
    name: '直辖市',
    key: 21
  },
  {
    tag: 'warning',
    name: '自治区',
    key: 22
  },
  {
    tag: 'warning',
    name: '特别行政区',
    key: 23
  },
  {
    tag: 'success',
    name: '城市',
    key: 3
  },
  {
    tag: 'info',
    name: '区县',
    key: 4
  },
  {
    tag: 'info',
    name: '村镇',
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
  return URL.sys.region[functionName.replace(/([A-Z])/g, '_$1').toUpperCase()]
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
 * 查找顶层地区
 */
export function tops (params = { pid: 86, page: 1, limit: 20 }) {
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
 * 获取省份信息
 */
export function provinces (name = '') {
  return request({
    url: url('provinces'),
    method: 'get',
    params: adornParams({ name: name })
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
