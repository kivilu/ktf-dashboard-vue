/* eslint-disable comma-spacing */
const global = {
  // 是否启用U盾
  enableUkey: true,
  // 每页显示个数选择器的选项设置
  pageSizes: [10, 20, 30, 50],
  // Dialog 显示的宽度
  dialogWidth: '20%',
  // 需要签名的URI
  uriForSign: [],
  // 用户类型定义
  userTypes: [{
    tag: 'info',
    name: '超级管理员',
    key: 0
  },
  {
    tag: 'danger',
    name: '系统管理员',
    key: 1
  }],
  // KTF状态定义
  ktfStatus: [{
    tag: 'success',
    name: '正常',
    key: 0
  }, {
    tag: 'danger',
    name: '禁用',
    key: 1
  }, {
    tag: 'info',
    name: '初始',
    key: 9
  }]
}

export default global
