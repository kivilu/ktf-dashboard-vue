<template>
  <el-dialog v-el-drag-dialog
             :title="textMap[dialogStatus]"
             :close-on-click-modal="false"
             :visible.sync="visible"
             @dragDialog="handleDrag">
    <el-form ref="dataForm"
             :rules="rules"
             :model="dataForm"
             label-position="left"
             label-width="100px"
             style="margin-left:50px; margin-right:100px;"
             :width="DLG_WIDTH">
      <el-form-item label="类型"
                    prop="resourceType">
        <el-radio-group v-model="dataForm.resourceType">
          <el-radio v-for="item in menuTypes"
                    :key="item.key"
                    :label="item.key">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="typeName + '名称'"
                    prop="name">
        <el-input v-model="dataForm.name"
                  :placeholder="typeName + '名称'" />
      </el-form-item>

      <el-form-item v-if="dataForm.resourceType >0"
                    label="上级菜单"
                    prop="parent"
                    :required="dataForm.resourceType > 0">
        <tree-input ref="menuTree"
                    v-model="dataForm.parent"
                    :tree-props="menuTreeProps"
                    :load-init="getTopMenus"
                    :get-children="getTreeData"
                    :get-my-info="getMyInfo"
                    required />
      </el-form-item>
      <el-form-item v-if="dataForm.resourceType !== 2"
                    label="菜单图标"
                    prop="icon"
                    :required="dataForm.resourceType !== 2">
        <el-row>
          <el-col :span="24">
            <el-popover ref="iconsPopover"
                        placement="bottom-start"
                        trigger="click"
                        popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-list">
                <el-button v-for="(icon, index) in menuIcons"
                           :key="index"
                           :class="{ 'is-active': icon === dataForm.icon }"
                           @click="iconActiveHandle(icon)">
                  <svg-icon :icon-class="icon" />
                </el-button>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon"
                      v-popover:iconsPopover
                      :readonly="true"
                      placeholder="菜单图标名称"
                      class="icon-list__input" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="dataForm.resourceType !== 0"
                    label="菜单路由"
                    prop="url">
        <el-input v-model="dataForm.url"
                  placeholder="菜单路由" />
      </el-form-item>
      <el-form-item :label="typeName + '描述'"
                    prop="description">
        <el-input v-model="dataForm.description"
                  :placeholder="typeName + '描述'" />
      </el-form-item>
      <el-form-item label="排序号"
                    prop="seq">
        <el-input-number v-model="dataForm.seq"
                         controls-position="right"
                         :min="0"
                         label="排序号" />
      </el-form-item>

      <el-form-item label="菜单显示"
                    size="mini"
                    prop="hidden">
        <el-radio-group v-model="dataForm.hidden">
          <el-radio :label="0">显示</el-radio>
          <el-radio :label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="状态"
                    size="mini"
                    prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio v-for="(val, key) in menuStatus"
                    :key="key"
                    :label="val.key">
            {{ val.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="visible = false">{{ LB.common.CANCEL }}</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">{{
        LB.common.CONFIRM
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import treeInput from '@/components/TreeInput'
import {
  tops,
  getInfo,
  getChildren,
  save,
  update,
  menuTypes
} from '@/api/permission/menu'
import svgIcons from '@/icons'
export default {
  name: 'SysMenuDlg',
  directives: { elDragDialog },
  components: { treeInput },
  props: {
    dialogStatus: {
      type: String,
      default: 'create'
    }
  },
  data() {
    const validateUrl = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    const validateParent = (rule, value, callback) => {
      if (!rule.required) return

      if (!value || !value.label || !value.value) {
        callback(new Error('父级菜单不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        id: 0,
        resourceType: 0,
        name: '',
        description: '',
        parentId: 0,
        url: '',
        seq: 0,
        icon: '',
        hidden: 0,
        status: 0,
        parent: { label: '', value: '' }
      },
      textMap: {
        update: '修改数据',
        create: '新增数据'
      },
      menuTreeProps: {
        label: 'name',
        // children: 'children',
        hasChildren: 'hasChildren'
      },
      rules: {
        type: [
          {
            required: true,
            message: '类型不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ],
        parent: [
          {
            required: false,
            validator: validateParent,
            trigger: 'change'
          }
        ],
        url: [
          {
            required: true,
            validator: validateUrl,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    menuIcons: {
      get() {
        return svgIcons
      }
    },
    menuTypes: {
      get() {
        return menuTypes
      }
    },
    typeName: {
      get() {
        var types =
          menuTypes.filter(item => item.key === this.dataForm.type) || []
        return types.length > 0 ? types[0].name : ''
      }
    },
    menuStatus: {
      get() {
        return this.STS.ktfStatus.filter(s => s.key !== 9)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getInfo(this.dataForm.id).then(({ code, msg, data }) => {
            if (code === 200) {
              this.dataForm = data
              this.dataForm.parent = {
                label: '',
                value: this.dataForm.parentId
              }
            } else {
              this.$message.error(msg)
            }
          })
        }
      })
    },

    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
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
    },
    saveOrUpdate() {
      this.dataForm.parentId = this.dataForm.parent.value
      return this.dialogStatus === 'create'
        ? save(this.dataForm)
        : update(this.dataForm)
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      // this.$refs.select.blur()
    },
    async getTopMenus() {
      const res = await tops()
      if (res.code === 200) {
        return res.data.list
      } else {
        this.$message.error(msg)
        return []
      }
    },
    async getTreeData(pid) {
      const res = await getChildren(pid, true)
      return res
    },
    async getMyInfo(id) {
      const res = await getInfo(id)
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
  .mod-menu {
    .icon-list__input,
    .menu-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }

    &__icon-popover {
      max-width: 60%;
    }

    &__icon-list {
      max-width: 400px;
      max-height: 300px;
      padding: 0;
      margin: -8px 0 0 -8px;

      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;

        > span {
          display: inline-block;
          vertical-align: middle;
          width: 24px;
          height: 24px;
          font-size: 24px;
        }
      }
    }
  }
</style>
