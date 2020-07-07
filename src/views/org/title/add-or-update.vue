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
      <el-form-item label="职位名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="职位名称" />
      </el-form-item>

      <el-form-item label="职位简称" prop="code">
        <el-input v-model="dataForm.code" placeholder="职位简称" />
      </el-form-item>

      <el-form-item label="所属部门" prop="dept">
        <tree-input
          ref="deptTree"
          v-model="dataForm.dept"
          :tree-props="deptTreeProps"
          :get-children="getDeptTreeData"
          :get-my-info="getDeptInfo"
          required
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">
        {{ LB.common.CANCEL }}
      </el-button>
      <el-button type="primary" @click="dataFormSubmit()">
        {{ LB.common.CONFIRM }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import treeInput from '@/components/TreeInput'
import { getInfo, save, update } from '@/api/org/title'
import { getInfo as getDeptInfo, getChildren } from '@/api/org/dept'
export default {
  name: 'OrgTitleDlg',
  directives: { elDragDialog },
  components: { treeInput },
  props: {
    dialogStatus: {
      type: String,
      default: 'create'
    }
  },
  data() {
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
      dataForm: {
        id: 0,
        name: null,
        code: '',
        deptId: '',
        dept: { label: '', value: '' }
      },
      textMap: {
        update: '修改数据',
        create: '新增数据'
      },
      rules: {
        name: [
          {
            required: true,
            message: '职位名称不能为空',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '职位简称不能为空',
            trigger: 'blur'
          }
        ],
        dept: [
          {
            required: true,
            validator: validateDept,
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
              this.dataForm.dept = {
                label: this.dataForm.deptName,
                value: this.dataForm.deptId
              }
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
      this.dataForm.parentId = this.dataForm.parent.value
      return this.dialogStatus === 'create'
        ? save(this.dataForm)
        : update(this.dataForm)
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      // this.$refs.select.blur()
    },
    async getDeptTreeData(pid) {
      const res = await getChildren(pid)
      return res
    },
    async getDeptInfo(id) {
      const res = await getDeptInfo(id)
      return res
    }
  }
}
</script>

<style lang="scss" scoped></style>
