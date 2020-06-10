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
      <el-form-item
        label="变量名称"
        prop="varName"
      >
        <el-input
          v-model="dataForm.varName"
          placeholder="变量名称"
        />
      </el-form-item>
      <el-form-item
        label="变量代码"
        prop="varCode"
      >
        <el-input
          v-model="dataForm.varCode"
          placeholder="变量代码"
        />
      </el-form-item>
      <el-form-item
        label="变量父ID"
        prop="parentName"
      >
        <el-popover
          ref="dicListPopover"
          v-model="popoverVisible"
          placement="bottom-start"
          trigger="click"
        >
          <el-tree
            ref="dicListTree"
            :data="dicList"
            :props="dicListTreeProps"
            node-key="id"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false"
            @current-change="dicListTreeCurrentChangeHandle"
          />
        </el-popover>
        <el-input
          v-model="dataForm.parentName"
          v-popover:dicListPopover
          :readonly="true"
          placeholder="点击选择变量父ID"
          class="menu-list__input"
        />
      </el-form-item>
    </el-form>

    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">
        {{ LB.common.CANCEL }}
      </el-button>
      <el-button
        type="primary"
        @click="dataFormSubmit()"
      >
        {{ LB.common.CONFIRM }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { list2tree } from '@/utils'
import { select, getInfo, save, update } from '@/api/dic'
export default {
  name: 'SysDicDlg',
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
        varName: null,
        varCode: '',
        parentId: 0,
        parentName: null
      },
      textMap: {
        update: '修改数据字典',
        create: '新增数据字典'
      },
      rules: {
        varName: [{
          required: true,
          message: '变量名称不能为空',
          trigger: 'blur'
        }],
        varCode: [{
          required: true,
          message: '变量代码不能为空',
          trigger: 'change'
        }],
        parentId: [{
          required: true,
          message: '变量父Id不能为空',
          trigger: 'change'
        }]
      },
      dicList: [],
      dicListTreeProps: {
        label: 'varName',
        children: 'children'
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
        this.$refs['dataForm'].resetFields()
        this.dicList = []
        select(0)
          .then(({ code, msg, data }) => {
            this.dicList = list2tree(data.dicList)
          })
          .then(() => {
            if (this.dataForm.id) {
              getInfo(this.dataForm.id)
                .then(({ code, msg, data }) => {
                  if (code === 200) {
                    this.dataForm = data
                    this.dicListTreeSetCurrentNode()
                  } else {
                    this.$message.error(msg)
                  }
                })
            }
          })
      })
    },
    // 菜单树选中
    dicListTreeCurrentChangeHandle(data, node) {
      // console.log(data)
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.varName
      this.popoverVisible = false
    },
    // 菜单树设置当前选中节点
    dicListTreeSetCurrentNode() {
      this.$refs.dicListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.dicListTree.getCurrentNode() || {})['varName']
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

<style
  lang="scss"
  scoped
>
</style>
