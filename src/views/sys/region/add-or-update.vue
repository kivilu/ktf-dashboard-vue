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
      <el-form-item label="地区名称"
                    prop="name">
        <el-input v-model="dataForm.name"
                  placeholder="地区名称" />
      </el-form-item>
      <el-form-item label="地区代码"
                    prop="code">
        <el-input v-model="dataForm.code"
                  placeholder="地区代码" />
      </el-form-item>
      <el-form-item label="上级地区"
                    prop="parent">
        <tree-input ref="treeInput"
                    v-model="dataForm.parent"
                    :load-init="getTopRegions"
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
import { getInfo, save, update, getChildren, tops } from '@/api/sys/region'
export default {
  name: 'SysRegionDlg',
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
        callback(new Error('上级地区不能为空'))
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
        pid: 0,
        parent: { label: '', value: '' }
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
        ],
        code: [
          {
            required: true,
            message: '代码不能为空',
            trigger: 'blur'
          }
        ],
        parent: [
          {
            required: false,
            validator: validateParent,
            trigger: 'change'
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
      this.dataForm.pid = this.dataForm.parent.value
      return this.dialogStatus === 'create'
        ? save(this.dataForm)
        : update(this.dataForm)
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      // this.$refs.select.blur()
    },
    async getTopRegions() {
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
