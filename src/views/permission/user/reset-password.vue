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
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="名称" />
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
import { getInfo, save, update } from '@/api/permission/user'
export default {
  name: 'SysUserDlg',
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
      popoverVisible: false,
      dataForm: {
        id: 0,
        name: null
      },
      textMap: {
        update: '修改数据',
        create: '新增数据'
      },
      rules: {
        name: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    init(id) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
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
      return this.dialogStatus === 'create'
        ? save(this.dataForm)
        : update(this.dataForm)
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      // this.$refs.select.blur()
    }
  }
}
</script>

<style lang="scss" scoped></style>
