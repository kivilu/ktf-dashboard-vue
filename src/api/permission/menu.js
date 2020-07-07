import request from '@/utils/request'
import URL from '../url'
import { adornParams, adornData } from '@/utils'

// 菜单类型
export const menuTypes = [
  {
    tag: 'success',
    name: '目录',
    key: 0
  },
  {
    tag: 'primary',
    name: '菜单',
    key: 1
  },
  {
    tag: 'info',
    name: '按钮',
    key: 2
  }
]

export function isMenu(type) {
  return type < 2
}

/**
 * 根据函数名获取URL
 *
 * @export
 * @param {*} method
 * @returns
 */
export function url(method) {
  return URL.permission.menu[method.replace(/([A-Z])/g, '_$1').toUpperCase()]
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

export function getInfo(id) {
  return request({
    url: url('getInfo') + `/${id}`,
    method: 'get',
    params: adornParams({})
  })
}

/**
 *
 * @param {Long} pid
 * @param {Boolean} menu
 */
export function getChildren(pid, menu = false) {
  return request({
    url: url('getChildren') + `/${pid}` + `/${menu}`,
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
