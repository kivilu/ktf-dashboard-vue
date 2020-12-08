<template>
  <el-dialog
    v-el-drag-dialog
    :title="textMap[dialogStatus]"
    :close-on-click-modal="false"
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
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称" />
      </el-form-item>

      <el-form-item label="备注" prop="description">
        <el-input v-model="dataForm.description" placeholder="备注" />
      </el-form-item>

      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio
            v-for="(val, key) in roleStatus"
            :key="key"
            :label="val.key"
          >
            {{ val.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item size="mini" label="权限">
        <el-tree
          ref="menuTree"
          :props="menuTreeProps"
          node-key="id"
          :default-expand-all="false"
          show-checkbox
          lazy
          :load="loadMenu"
        />
      </el-form-item>
    </el-form>

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
import { getChildren } from '@/api/permission/menu'
// import { list2tree } from '@/utils'
import { getInfo, save, update } from '@/api/permission/role'
export default {
  name: 'SysRoleDlg',
  directives: { elDragDialog },
  props: {
    dialogStatus: {
      type: String,
      default: 'create'
    }
  },
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        description: '',
        status: 0,
        resourceIds: []
      },
      textMap: {
        update: '修改角色',
        create: '新增角色'
      },
      menuTreeData: [],
      menuTreeProps: {
        label: 'name',
        // children: 'children',
        hasChildren: 'hasChildren'
      },
      rules: {
        name: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    roleStatus: {
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
        this.$refs.menuTree.setCheckedKeys([])
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
          getInfo(this.dataForm.id).then(({ code, msg, data }) => {
            if (code === 200) {
              this.dataForm = data
              this.$refs.menuTree.setCheckedKeys(data.resourceIds)
            } else {
              this.$message.error(msg)
            }
          })
        }
      })
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
      this.dataForm.resourceIds = [].concat(
        this.$refs.menuTree.getCheckedKeys(),
        this.$refs.menuTree.getHalfCheckedKeys()
      )
      return this.dialogStatus === 'create'
        ? save(this.dataForm)
        : update(this.dataForm)
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      // this.$refs.select.blur()
    },
    loadMenu(node, resolve) {
      // console.log(node)
      const parentId = node.level === 0 ? 0 : node.id
      getChildren(parentId).then(({ code, msg, data }) => {
        if (code === 200) {
          resolve(data)
        } else {
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
