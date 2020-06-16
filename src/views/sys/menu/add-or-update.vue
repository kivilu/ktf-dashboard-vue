<template>
  <el-dialog
    v-el-drag-dialog
    :title="textMap[dialogStatus]"
    :visible.sync="visible"
    @dragDialog="handleDrag"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="dataForm"
      label-position="left"
      label-width="100px"
      style="margin-left:50px; margin-right:100px;"
      :width="DLG_WIDTH"
    >
      <el-form-item label="类型" prop="resourceType">
        <el-radio-group v-model="dataForm.resourceType">
          <el-radio v-for="(item) in menuTypes" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="typeName+'名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="typeName+'名称'" />
      </el-form-item>

      <el-form-item label="上级菜单" prop="parentName" :required="dataForm.type > 0">
        <el-popover ref="menuTreePopover" placement="bottom-start" trigger="click">
          <el-tree
            ref="menuTree"
            :data="menuTreeData"
            :props="menuTreeProps"
            node-key="id"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false"
            @current-change="menuTreeCurrentChangeHandle"
          />
        </el-popover>
        <el-input
          v-model="dataForm.parentName"
          v-popover:menuTreePopover
          :readonly="true"
          placeholder="点击选择上级菜单"
          class="menu-list__input"
        />
      </el-form-item>
      <el-form-item v-if="dataForm.resourceType !== 2" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="24">
            <el-popover
              ref="iconsPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover"
            >
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(icon, index) in menuIcons"
                  :key="index"
                  :class="{ 'is-active': icon === dataForm.icon }"
                  @click="iconActiveHandle(icon)"
                >
                  <svg-icon :icon-class="icon" />
                </el-button>
              </div>
            </el-popover>
            <el-input
              v-model="dataForm.icon"
              v-popover:iconsPopover
              :readonly="true"
              placeholder="菜单图标名称"
              class="icon-list__input"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="dataForm.resourceType !== 0" label="菜单路由" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单路由" />
      </el-form-item>
      <el-form-item :label="typeName + '描述'" prop="description">
        <el-input v-model="dataForm.description" :placeholder="typeName + '描述'" />
      </el-form-item>
      <el-form-item label="排序号" prop="seq">
        <el-input-number v-model="dataForm.seq" controls-position="right" :min="0" label="排序号" />
      </el-form-item>

      <el-form-item label="菜单显示" size="mini" prop="hidden">
        <el-radio-group v-model="dataForm.hidden">
          <el-radio :label="0">显示</el-radio>
          <el-radio :label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ LB.common.CANCEL }}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{ LB.common.CONFIRM }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { getInfo, list, save, update, menuTypes } from '@/api/menu'
import { list2tree } from '@/utils'
import svgIcons from '@/icons'
export default {
  name: 'SysMenuDlg',
  directives: { elDragDialog },
  props: {
    dialogStatus: {
      type: String,
      default: 'create'
    }
  },
  data() {
    const validateUrl = (rule, value, callback) => {
      if (this.dataForm.url === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    const validatorParent = (rule, value, callback) => {
      if (this.dataForm.parentName > 0 && !/\S/.test(value)) {
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
        parentName: '',
        url: '',
        seq: 0,
        icon: '',
        hidden: 0,
        status: 0
      },
      textMap: {
        update: '修改数据',
        create: '新增数据'
      },
      menuTreeData: [],
      menuTreeProps: {
        label: 'name',
        children: 'children'
      },
      rules: {
        type: [{
          required: true,
          message: '类型不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        }],
        parentName: [{
          validator: validatorParent,
          message: '上级菜单不能为空',
          trigger: 'blur'
        }],
        url: [{
          required: true,
          validator: validateUrl,
          trigger: 'blur'
        }]
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
        var types = menuTypes.filter(item => item.key === this.dataForm.type) || []
        return types.length > 0 ? types[0].name : ''
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        list().then(({ code, msg, data }) => {
          if (code === 200) {
            this.menuTreeData = list2tree(data)
          } else {
            this.$message.error(msg)
          }
        })
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getInfo(this.dataForm.id)
            .then(({ code, msg, data }) => {
              if (code === 200) {
                this.dataForm = data
                this.menuTreeSetCurrentNode()
              } else {
                this.$message.error(msg)
              }
            })
        }
      })
    },
    // 菜单树选中
    menuTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.id || 0
      this.dataForm.parentName = data.name
    },
    // 菜单树设置当前选中节点
    menuTreeSetCurrentNode() {
      this.$refs.menuTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.menuTree.getCurrentNode() || {})['name']
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saveOrUpdate()
            .then(({ code, msg, data }) => {
              if (code === 200) {
                this.$message({
                  message: this.dialogStatus === 'create' ? '保存成功' : '更新成功',
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
      return this.dialogStatus === 'create' ? save(this.dataForm) : update(this.dataForm)
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      // this.$refs.select.blur()
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
