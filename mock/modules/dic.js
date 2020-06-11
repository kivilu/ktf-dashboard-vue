import Mock from 'mockjs'
import URL from '../../src/api/url'

var datalist = [{ 'id': '1', 'parentId': '0', 'varCode': 'MODULE_NAME_MAP', 'varName': '模块名称映射', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:01:43', 'gmtUpdate': '2019-11-04T18:01:43' }, { 'id': '2', 'parentId': '1', 'varCode': 'com.kivi.dashboard.enterprise.controller.EnterpriseController', 'varName': '企业信息', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:02:38', 'gmtUpdate': '2019-11-04T18:02:38' }, { 'id': '3', 'parentId': '1', 'varCode': 'com.kivi.dashboard.sys.controller.SysDicController', 'varName': '数据字典', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:02:57', 'gmtUpdate': '2019-11-04T18:02:57' }, { 'id': '4', 'parentId': '1', 'varCode': 'com.kivi.dashboard.cif.controller.CustomerController', 'varName': '客户信息', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:03:18', 'gmtUpdate': '2019-11-04T18:03:18' }, { 'id': '5', 'parentId': '1', 'varCode': 'com.kivi.dashboard.sys.controller.SysLogController', 'varName': '操作日志', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:03:32', 'gmtUpdate': '2019-11-04T18:03:32' }, { 'id': '6', 'parentId': '1', 'varCode': 'com.kivi.dashboard.sys.controller.SysResourceController', 'varName': '菜单', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:03:51', 'gmtUpdate': '2019-11-04T18:03:51' }, { 'id': '7', 'parentId': '1', 'varCode': 'com.kivi.dashboard.sys.controller.SysUserController', 'varName': '用户', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:04:26', 'gmtUpdate': '2019-11-04T18:04:26' }, { 'id': '8', 'parentId': '1', 'varCode': 'com.kivi.dashboard.sys.controller.SysRoleController', 'varName': '角色', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:04:38', 'gmtUpdate': '2019-11-04T18:04:38' }, { 'id': '9', 'parentId': '1', 'varCode': 'com.ins.kms.controller.KmsIdentifierController', 'varName': '标识', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:04:53', 'gmtUpdate': '2019-11-04T18:04:53' }, { 'id': '10', 'parentId': '1', 'varCode': 'com.ins.kms.controller.KmsServiceController', 'varName': '密钥服务', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:05:09', 'gmtUpdate': '2019-11-04T18:05:09' }, { 'id': '11', 'parentId': '1', 'varCode': 'com.ins.kms.controller.KmsKeyController', 'varName': '密钥', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:05:22', 'gmtUpdate': '2019-11-04T18:05:22' }, { 'id': '12', 'parentId': '0', 'varCode': 'USERTYPE_ROLE_MAP', 'varName': '用户类型角色映射', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:05:57', 'gmtUpdate': '2019-11-04T18:05:57' }, { 'id': '13', 'parentId': '12', 'varCode': '1', 'varName': 'SYSTEM', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:06:16', 'gmtUpdate': '2019-11-04T18:06:16' }, { 'id': '14', 'parentId': '12', 'varCode': '4', 'varName': 'ADMIN_SYS', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:06:37', 'gmtUpdate': '2019-11-04T18:06:37' }, { 'id': '15', 'parentId': '12', 'varCode': '5', 'varName': 'ADMIN_BIZ', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:06:53', 'gmtUpdate': '2019-11-04T18:06:53' }, { 'id': '16', 'parentId': '12', 'varCode': '6', 'varName': 'OPERATOR_KEY', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:07:05', 'gmtUpdate': '2019-11-04T18:07:05' }, { 'id': '17', 'parentId': '12', 'varCode': '7', 'varName': 'REVIEWER_KEY', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:07:18', 'gmtUpdate': '2019-11-04T18:07:18' }, { 'id': '18', 'parentId': '12', 'varCode': '8', 'varName': 'ADMIN_AUDIT', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:07:31', 'gmtUpdate': '2019-11-04T18:07:31' }, { 'id': '19', 'parentId': '12', 'varCode': '9', 'varName': 'AUDITOR', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:07:43', 'gmtUpdate': '2019-11-04T18:07:43' }, { 'id': '20', 'parentId': '0', 'varCode': 'METHOD_NAME_MAP', 'varName': '用户操作名称映射', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:08:27', 'gmtUpdate': '2019-11-04T18:08:27' }, { 'id': '21', 'parentId': '20', 'varCode': 'login', 'varName': '用户登录', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:08:42', 'gmtUpdate': '2019-11-04T18:08:42' }, { 'id': '22', 'parentId': '20', 'varCode': 'logout', 'varName': '用户退出', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:08:57', 'gmtUpdate': '2019-11-04T18:08:57' }, { 'id': '23', 'parentId': '20', 'varCode': 'save', 'varName': '新增', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:09:15', 'gmtUpdate': '2019-11-04T18:09:15' }, { 'id': '24', 'parentId': '20', 'varCode': 'update', 'varName': '修改', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:09:31', 'gmtUpdate': '2019-11-04T18:09:31' }, { 'id': '25', 'parentId': '20', 'varCode': 'delete', 'varName': '删除', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:09:50', 'gmtUpdate': '2019-11-04T18:09:50' }, { 'id': '26', 'parentId': '20', 'varCode': 'list', 'varName': '查询', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:10:02', 'gmtUpdate': '2019-11-04T18:10:02' }, { 'id': '27', 'parentId': '20', 'varCode': 'page', 'varName': '分页查询', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:10:17', 'gmtUpdate': '2019-11-04T18:10:17' }, { 'id': '28', 'parentId': '20', 'varCode': 'edit', 'varName': '修改', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:10:30', 'gmtUpdate': '2019-11-04T18:10:30' }, { 'id': '29', 'parentId': '20', 'varCode': 'updateById', 'varName': '修改', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:10:46', 'gmtUpdate': '2019-11-04T18:10:46' }, { 'id': '30', 'parentId': '20', 'varCode': 'deleteBatch', 'varName': '批量删除', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:10:57', 'gmtUpdate': '2019-11-04T18:10:57' }, { 'id': '31', 'parentId': '0', 'varCode': 'LOG_FOR_AUDIT', 'varName': '需审计的操作', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:11:50', 'gmtUpdate': '2019-11-08T20:48:38' }, { 'id': '32', 'parentId': '31', 'varCode': 'com.ins.kms.controller.KmsKeyController', 'varName': '密钥管理', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:13:22', 'gmtUpdate': '2019-11-04T18:13:22' }, { 'id': '33', 'parentId': '32', 'varCode': 'applyNew', 'varName': '申请', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:14:40', 'gmtUpdate': '2019-11-04T18:30:22' }, { 'id': '34', 'parentId': '32', 'varCode': 'applyUpdate', 'varName': '修改申请', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:15:13', 'gmtUpdate': '2019-11-08T20:41:55' }, { 'id': '35', 'parentId': '32', 'varCode': 'applyCancel', 'varName': '撤销申请', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:15:41', 'gmtUpdate': '2019-11-04T18:30:38' }, { 'id': '36', 'parentId': '32', 'varCode': 'applyApprove', 'varName': '申请审核通过', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:16:15', 'gmtUpdate': '2019-11-04T18:30:45' }, { 'id': '37', 'parentId': '32', 'varCode': 'applyReject', 'varName': '申请审核拒绝', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:16:32', 'gmtUpdate': '2019-11-04T18:30:52' }, { 'id': '38', 'parentId': '32', 'varCode': 'deleteKey', 'varName': '删除', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:17:09', 'gmtUpdate': '2019-11-04T18:31:11' }, { 'id': '39', 'parentId': '32', 'varCode': 'deleteKeys', 'varName': '批量删除', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:18:08', 'gmtUpdate': '2019-11-04T18:31:19' }, { 'id': '40', 'parentId': '32', 'varCode': 'downloadKey', 'varName': '下载', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:18:34', 'gmtUpdate': '2019-11-04T18:31:05' }, { 'id': '41', 'parentId': '20', 'varCode': 'applyApprove', 'varName': '申请审核通过', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:16:15', 'gmtUpdate': '2019-11-04T18:30:45' }, { 'id': '42', 'parentId': '20', 'varCode': 'applyCancel', 'varName': '撤销申请', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:15:41', 'gmtUpdate': '2019-11-04T18:30:38' }, { 'id': '43', 'parentId': '20', 'varCode': 'applyNew', 'varName': '申请', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:14:40', 'gmtUpdate': '2019-11-04T18:30:22' }, { 'id': '44', 'parentId': '20', 'varCode': 'applyReject', 'varName': '申请审核拒绝', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:16:20', 'gmtUpdate': '2019-11-04T18:30:52' }, { 'id': '45', 'parentId': '20', 'varCode': 'applyUpdate', 'varName': '修改申请', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:15:13', 'gmtUpdate': '2019-11-08T20:42:15' }, { 'id': '46', 'parentId': '20', 'varCode': 'deleteKey', 'varName': '删除', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:17:09', 'gmtUpdate': '2019-11-04T18:31:11' }, { 'id': '47', 'parentId': '20', 'varCode': 'deleteKeys', 'varName': '批量删除', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:18:08', 'gmtUpdate': '2019-11-04T18:31:19' }, { 'id': '48', 'parentId': '20', 'varCode': 'downloadKey', 'varName': '下载', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T18:18:34', 'gmtUpdate': '2019-11-04T18:31:05' }, { 'id': '49', 'parentId': '1', 'varCode': 'com.ins.kms.controller.KmsEchartsController', 'varName': 'Echarts统计', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T22:56:19', 'gmtUpdate': '2019-11-04T22:56:19' }, { 'id': '50', 'parentId': '20', 'varCode': 'statisKeyRecent7Days', 'varName': '近七天密钥图表', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-04T22:57:57', 'gmtUpdate': '2019-11-04T22:57:57' }, { 'id': '51', 'parentId': '1', 'varCode': 'com.ins.kms.controller.KmsAuditLogController', 'varName': '审计日志', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-07T21:28:44', 'gmtUpdate': '2019-11-07T21:30:30' }, { 'id': '52', 'parentId': '20', 'varCode': 'audit', 'varName': '审计', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-07T21:32:56', 'gmtUpdate': '2019-11-07T21:32:56' }, { 'id': '53', 'parentId': '20', 'varCode': 'info', 'varName': '详情查询', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-08T19:02:14', 'gmtUpdate': '2019-11-08T19:02:29' }, { 'id': '54', 'parentId': '20', 'varCode': 'keyDownloadComplete', 'varName': '下载完成', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-08T20:33:34', 'gmtUpdate': '2019-11-08T20:33:34' }, { 'id': '55', 'parentId': '20', 'varCode': 'revokeKey', 'varName': '吊销密钥', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-08T20:36:09', 'gmtUpdate': '2019-11-08T20:36:09' }, { 'id': '56', 'parentId': '32', 'varCode': 'keyDownloadComplete', 'varName': '下载完成', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-08T20:47:34', 'gmtUpdate': '2019-11-08T20:47:47' }, { 'id': '57', 'parentId': '32', 'varCode': 'revokeKey', 'varName': '吊销标识', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-08T20:50:10', 'gmtUpdate': '2019-11-08T20:50:10' }, { 'id': '58', 'parentId': '32', 'varCode': 'updateKey', 'varName': '更新密钥', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-08T20:52:06', 'gmtUpdate': '2019-11-08T20:52:06' }, { 'id': '59', 'parentId': '20', 'varCode': 'updateKey', 'varName': '更新', 'createUser': 'system', 'updateUser': 'system', 'gmtCreate': '2019-11-08T20:54:36', 'gmtUpdate': '2019-11-08T20:55:14' }]

export default [
  // get dic info
  {
    url: `${URL.dic.GET_INFO}\.*`,
    type: 'get',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.url)

      const key = '/dev-api/sys/dic/info/'
      var tmp = config.url.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/ig, '$1')

      console.log('id:' + id)

      var result = {
        id: 0,
        varName: null,
        varCode: '',
        parentId: 0,
        parentName: null
      }

      var info = datalist.find(el => el.id === id)
      if (info) {
        result.id = info.id
        result.varCode = info.varCode
        result.varName = info.varCode
        result.parentId = info.parentId
      }

      var pinfo = datalist.find(el => el.id === info.parentId)
      if (pinfo) { result.parentName = pinfo.name }

      return {
        code: 200,
        msg: '成功',
        data: result
      }
    }
  },
  // select dic by id
  {
    url: `${URL.dic.SELECT}\.*`,
    type: 'get',
    response: config => {
      const token = config.headers['x-access-token']
      var turl = config.url
      const key = '/dev-api/sys/dic/select/'
      var tmp = turl.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/ig, '$1')

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      var root = []
      if (id === '0') {
        root.push({ id: '0', parentId: '-1', varCode: 'root', varName: '根节点' })
      }

      var data = id === '0' ? datalist : datalist.filter(item => (item.id === id || item.parentId === id))
      var result = root.concat(data)

      return {
        code: 200,
        msg: '成功',
        data: { dicList: result }
      }
    }
  },
  // query all dic
  {
    url: `${URL.dic.LIST}`,
    type: 'get',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.query)
      var keyword = config.query.keyword || ''
      var result = []
      if (keyword === '') {
        result = datalist
      } else {
        var items = datalist.filter(item => item.varName.includes(keyword))
        var pids = items.map(item => item.parentId)
        // console.log(pids)
        result = items.concat(datalist.filter(item => pids.includes(item.id)))
      }

      console.log(result)

      return { msg: 'success', code: 200, data: result }
    }
  },
  // new dic
  {
    url: `${URL.dic.SAVE}`,
    type: 'post',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.query)
      console.log(config.body)
      var info = config.body
      info.id = Mock.mock('@id')
      info['gmtCreate'] = Mock.mock('@now')
      info['gmtUpdate'] = Mock.mock('@now')
      datalist.push(info)

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // update dic
  {
    url: `${URL.dic.UPDATE}`,
    type: 'post',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.query)

      var info = config.body
      var item = datalist.find(item => item.id === info.id)
      if (!item) {
        return {
          code: 501,
          msg: '记录不存在'
        }
      }
      item.varCode = info.varCode
      item.varName = info.varName
      item.parentId = info.parentId

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // remove dic
  {
    url: `${URL.dic.DELETE}\.*`,
    type: 'get',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.query)

      var turl = config.url
      const key = '/dev-api/sys/dic/delete/'
      var tmp = turl.replace(key, '')
      const id = tmp.replace(/([0-9a-zA-Z]+)?(\?[0-9a-zA-Z&=]+)?/ig, '$1')

      var list = datalist.filter(item => (item.id !== id && item.parentId !== id))
      // console.log(list)
      datalist = list

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  },
  // batch remove dic
  {
    url: `${URL.dic.DELETE}`,
    type: 'post',
    response: config => {
      const token = config.headers['x-access-token']

      // mock error
      if (!token) {
        return {
          code: 403,
          msg: '没有权限访问'
        }
      }

      console.log(config.data)

      datalist = datalist.filter(item => !config.data.includes(item.id))
      console.log(datalist)

      return {
        code: 200,
        msg: '成功',
        data: null
      }
    }
  }
]
