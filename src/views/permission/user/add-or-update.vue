<template>
  <el-dialog
    v-el-drag-dialog
    :title="textMap[dialogStatus]"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @dragDialog="handleDrag"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户信息" name="userTab">
        <el-form
          ref="userDataForm"
          :rules="rules"
          :model="dataForm"
          label-position="right"
          label-width="100px"
          style="margin-left:10px; margin-right:50px;"
          :width="DLG_WIDTH"
        >
          <el-form-item v-if="multiOrg" label="用户类型" prop="userType">
            <el-radio-group v-model="dataForm.userType">
              <el-radio
                v-for="(userType, index) in STS.userTypes"
                :key="index"
                :label="userType.key"
              >
                {{ userType.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="用户帐号" prop="loginName">
            <el-input v-model="dataForm.loginName" placeholder="登录帐号" />
          </el-form-item>
          <!-- <el-form-item v-if="!dataForm.id" label="密码" prop="password">
            <el-input
              v-model="dataForm.password"
              placeholder="默认初始密码：111111"
            />
          </el-form-item> -->

          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="dataForm.name" placeholder="姓名" />
          </el-form-item>

          <el-form-item label="用户手机" prop="phone">
            <el-input v-model="dataForm.phone" placeholder="手机号" />
          </el-form-item>

          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="邮箱" />
          </el-form-item>

          <el-form-item label="用户性别" size="mini" prop="sex">
            <el-radio-group v-model="dataForm.sex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="dialogStatus !== 'create'"
            label="状态"
            size="mini"
            prop="status"
          >
            <el-radio-group v-model="dataForm.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane v-if="multiOrg" label="企业信息" name="orgTab">
        <el-form
          ref="orgDataForm"
          :model="dataForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
          @keyup.enter.native="dataFormSubmit()"
        >
          <el-form-item label="所属企业" prop="orgId">
            <el-select
              v-model="dataForm.orgId"
              clearable
              filterable
              placeholder="请输入企业关键词查询"
              style="width: 100%"
              remote
              reserve-keyword
              :remote-method="getOrgList"
              :loading="loading"
              @change="handleChangeOrg()"
            >
              <el-option
                v-for="item in orgOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="dept">
            <tree-input
              ref="deptTree"
              v-model="dataForm.dept"
              style="width: 100%"
              :lazy="false"
              :default-expand-all="true"
              :tree-props="deptTreeProps"
              :tree-datas="deptTreeDatas"
              @select-node="handleChangeDept"
            />
          </el-form-item>
          <el-form-item label="所属职务" prop="titleId">
            <el-select
              v-model="dataForm.titleId"
              style="width: 100%"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in titleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="分配角色" name="roleTab" :disabled="multiOrg">
        <el-form
          ref="roleDataForm"
          :model="dataForm"
          :rules="rules"
          label-position="left"
          label-width="100px"
          @keyup.enter.native="dataFormSubmit()"
        >
          <el-form-item label="角色" size="mini" prop="roleIds">
            <el-checkbox-group v-model="dataForm.roleIds">
              <el-checkbox
                v-for="role in roleList"
                :key="role.id"
                :label="role.id"
              >
                {{ role.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane
        v-if="multiOrg"
        label="分配企业"
        name="mgrOrgTab"
        :disabled="!dataForm.id || dataForm.userType != 2"
      >
        <el-form
          ref="mgrOrgDataForm"
          :model="dataForm"
          :rules="rules"
          label-width="80px"
          @keyup.enter.native="dataFormSubmit()"
        >
          <el-form-item label="分配企业" prop="orgIds">
            <el-select
              v-model="dataForm.orgIds"
              clearable
              filterable
              multiple
              placeholder="请选择"
              @change="handleChangeOrg()"
            >
              <el-option
                v-for="item in orgOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ LB.common.CANCEL }}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{
        LB.common.CONFIRM
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import treeInput from '@/components/TreeInput'
import { getInfo, save, update } from '@/api/permission/user'
import { list as listCorps, page as pageCorps } from '@/api/org/corp'
import { list as listRoles } from '@/api/permission/role'
import { listByCorp } from '@/api/org/dept'
import { list as listTitle } from '@/api/org/title'
import { list2tree } from '@/utils'
import { isEmail, isMobile } from '@/utils/validate'
export default {
  name: 'SysUserDlg',
  directives: { elDragDialog },
  components: { treeInput },
  props: {
    dialogStatus: {
      type: String,
      default: 'create'
    }
  },
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!rule.required) callback()
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!rule.required) callback()
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!rule.required) callback()
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    const validateDept = (rule, value, callback) => {
      // console.log(value)
      if (!rule.required) callback()

      if (!value || !value.label || !value.value) {
        callback(new Error('部门不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      popoverVisible: false,
      loading: false,
      dataForm: {
        id: 0,
        userType: 0,
        loginName: '',
        password: '',
        loginMode: '02',
        name: null,
        orgId: '',
        orgIds: [],
        roleIds: [],
        deptId: '',
        titleId: '',
        sex: 0,
        phone: '',
        email: '',
        status: 0,
        dept: { label: '', value: '' }
      },
      activeName: 'userTab',
      roleList: [],
      orgOptions: [],
      deptTreeDatas: [],
      titleOptions: [],
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      textMap: {
        update: '修改用户',
        create: '新增用户'
      },
      rules: {
        loginName: [
          {
            required: true,
            message: '登录名不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: false,
            validator: validatePassword,
            trigger: 'blur'
          }
        ],
        email: [
          { required: false, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { required: false, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        roleIds: [
          {
            required: true,
            message: '角色至少选择一项',
            trigger: 'blur'
          }
        ],
        orgId: [
          {
            required: true && this.STS.multiOrg,
            message: '所属企业不能为空',
            trigger: 'change'
          }
        ],
        dept: [
          {
            required: true && this.STS.multiOrg,
            validator: validateDept,
            trigger: 'change'
          }
        ],
        titleId: [
          {
            required: true && this.STS.multiOrg,
            message: '职位不能为空',
            trigger: 'change'
          }
        ]
      },
      deptTreeProps: {
        label: 'name',
        value: 'id'
      }
    }
  },
  computed: {
    multiOrg() {
      return this.STS.multiOrg
    }
  },
  created() {},
  mounted() {
    this.getOrgList()
  },
  methods: {
    resetFields() {
      this.$refs['userDataForm'].resetFields()

      this.$refs['roleDataForm'].resetFields()
      if (this.STS.multiOrg) {
        this.$refs['mgrOrgDataForm'].resetFields()
        this.$refs['orgDataForm'].resetFields()
      }
    },
    validate() {
      var promises = []

      promises.push(
        new Promise((resolve, reject) => {
          this.$refs['userDataForm'].validate(valid => {
            if (valid) resolve(true)
            else {
              reject('用户信息填写不完整！')
            }
          })
        })
      )

      promises.push(
        new Promise((resolve, reject) => {
          this.$refs['roleDataForm'].validate(valid => {
            if (valid) resolve(true)
            else {
              reject('角色尚未分配！')
            }
          })
        })
      )

      if (this.STS.multiOrg) {
        promises.push(
          new Promise((resolve, reject) => {
            this.$refs['orgDataForm'].validate(valid => {
              if (valid) resolve(true)
              else {
                reject('企业信息填写不完整！')
              }
            })
          })
        )
        promises.push(
          new Promise((resolve, reject) => {
            this.$refs['mgrOrgDataForm'].validate(valid => {
              if (valid) resolve(true)
              else {
                reject('管理企业尚未选择！')
              }
            })
          })
        )
      }

      return Promise.all(promises)
    },
    init(id) {
      this.visible = true
      this.$nextTick(() => {
        this.resetFields()
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
          getInfo(this.dataForm.id).then(({ code, msg, data }) => {
            if (code === 200) {
              this.dataForm = data
            } else {
              this.$message.error(msg)
            }
          })
        }
      })
    },
    dataFormSubmit() {
      this.validate()
        .then(valid => {
          if (valid) {
            this.saveOrUpdate().then(({ code, msg, data }) => {
              if (code === 200) {
                this.$message({
                  message:
                    this.dialogStatus === 'create' ? '保存成功' : '更新成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(msg)
              }
            })
          }
        })
        .catch(e => {
          this.$message.error(e)
        })
    },
    saveOrUpdate() {
      return this.dialogStatus === 'create'
        ? save(this.dataForm)
        : update(this.dataForm)
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      // this.$refs.select.blur()
    },
    // tab切换
    handleClick(tab, event) {
      if (tab.name === 'userTab') {
      } else if (tab.name === 'roleTab') {
        this.getRoleList()
      } else if (tab.name === 'orgTab') {
        this.getOrgList()
      } else if (tab.name === 'mgrOrgTab') {
        this.getOrgList()
      }
    },
    // 获取角色
    getRoleList() {
      listRoles(this.orgId ? this.orgId : 0).then(({ code, msg, data }) => {
        if (code === 200) {
          this.roleList = data
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取企业树
    getOrgList(name = '') {
      this.loading = true
      const query = { keyword: name, page: 1, limit: 10 }
      const promise = name === '' ? pageCorps(query) : listCorps(query)
      promise.then(({ code, msg, data }) => {
        this.orgOptions = []
        this.loading = false
        var result = name === '' ? data.list : data
        if (code === 200) {
          this.orgOptions = result.map(item => {
            return { label: item.name, value: item.id }
          })
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取企业部门树
    getDeptList(orgId) {
      if (!orgId) return

      listByCorp(orgId).then(({ code, msg, data }) => {
        if (code === 200) {
          // console.log(data)
          this.deptTreeDatas = list2tree(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 获取部门职位树
    getTitleList(corpId, deptId, deptPid) {
      const query = { corpId: corpId, deptId: deptId, deptPid: deptPid }
      listTitle(query).then(({ code, msg, data }) => {
        if (code === 200) {
          // console.log(data)
          this.titleOptions = data.map(item => {
            return { label: item.name, value: item.id }
          })
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 企业选择改变
    handleChangeOrg() {
      this.getDeptList(this.dataForm.orgId)
    },
    // 部门选择改变
    handleChangeDept(data) {
      const { corpId, deptId, deptPid } = data
      this.getTitleList(corpId, deptId, deptPid)
    }
  }
}
</script>

<style lang="scss" scoped></style>
