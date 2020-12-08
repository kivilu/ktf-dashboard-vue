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
      <el-form-item label="变量名称"
                    prop="varName">
        <el-input v-model="dataForm.varName"
                  placeholder="变量名称" />
      </el-form-item>
      <el-form-item label="变量代码"
                    prop="varCode">
        <el-input v-model="dataForm.varCode"
                  placeholder="变量代码" />
      </el-form-item>

      <el-form-item label="变量值"
                    prop="varValue">
        <el-input v-model="dataForm.varValue"
                  placeholder="变量值" />
      </el-form-item>

      <el-form-item label="上级变量"
                    prop="parent">
        <tree-input ref="dicListTree"
                    v-model="dataForm.parent"
                    :tree-props="dicListTreeProps"
                    :load-init="getTopDics"
                    :get-children="getTreeData"
                    :get-my-info="getMyInfo"
                    required />
      </el-form-item>
    </el-form>

    <div slot="footer"
         class="dialog-footer">
      <el-button @click="visible = false">
        {{ LB.common.CANCEL }}
      </el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">
        {{ LB.common.CONFIRM }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import treeInput from '@/components/TreeInput'
// import { list2tree } from '@/utils'
import { tops, getInfo, save, update, getChildren } from '@/api/sys/dic'
export default {
  name: 'SysDicDlg',
  directives: { elDragDialog },
  components: { treeInput },
  props: {
    dialogStatus: {
      type: String,
      default: 'create'
    }
  },
  data() {
    const validateParent = (rule, value, callback) => {
      if (!rule.required) callback()

      if (!value || !value.label || !value.value) {
        callback(new Error('父级变量不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      // popoverVisible: false,
      dataForm: {
        id: 0,
        varName: null,
        varCode: '',
        varValue: '',
        parentId: 0,
        parent: { label: '', value: '' }
      },
      textMap: {
        update: '修改数据字典',
        create: '新增数据字典'
      },
      rules: {
        varName: [
          {
            required: true,
            message: '变量名称不能为空',
            trigger: 'blur'
          }
        ],
        varCode: [
          {
            required: true,
            message: '变量代码不能为空',
            trigger: 'change'
          }
        ],
        parent: [
          {
            required: false,
            validator: validateParent,
            // message: '变量父不能为空',
            trigger: 'change'
          }
        ]
      },
      dicListTreeProps: {
        label: 'varName',
        value: 'id'
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
              // console.log(this.dataForm)
              this.dataForm.parent = {
                label: '',
                value: this.data.parentId
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
    async getTopDics() {
      const res = await tops()
      if (res.code === 200) {
        return res.data.list
      } else {
        this.$message.error(msg)
        return []
      }
    },
    async getTreeData(pid) {
      const res = await getChildren(pid)
      return res
    },
    async getMyInfo(id) {
      const res = await getInfo(id)
      return res
    }
  }
}
</script>

<style lang="scss" scoped></style>
