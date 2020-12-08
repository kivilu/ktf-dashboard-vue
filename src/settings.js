// 按钮样式
const BTN_STYLES = ['primary', 'success', 'info', 'warning', 'danger', '']

module.exports = {
  title: 'KTF Vue Dashboard',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {Object}
   * @description runtime settings
   */
  settings: {
    multiOrg: false, // 是否开启多企业模式，true | false
    // 是否启用U盾
    enableUkey: false,
    // 是否启用复杂密码
    complexPassword: false,
    // 每页显示个数选择器的选项设置
    pageSizes: [10, 20, 30, 50],
    // Dialog 显示的宽度
    dialogWidth: '20%',
    // 用户类型定义
    userTypes: [
      {
        tag: BTN_STYLES[0],
        name: '管理用户',
        key: 0
      },
      {
        tag: BTN_STYLES[1],
        name: '企业用户',
        key: 1
      },
      {
        tag: BTN_STYLES[3],
        name: '监管用户',
        key: 2
      },
      {
        tag: BTN_STYLES[4],
        name: '个人用户',
        key: 3
      }
    ],
    // 公共状态定义
    ktfStatus: [
      {
        tag: BTN_STYLES[0],
        name: '正常',
        key: 0
      },
      {
        tag: 'danger',
        name: '禁用',
        key: 1
      },
      {
        tag: 'info',
        name: '初始',
        key: 9
      }
    ],
    // 需要签名的URI
    uriForSign: []
  }
}
