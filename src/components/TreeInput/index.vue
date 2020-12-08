<template>
  <div>
    <el-popover ref="treePopover"
                v-model="popoverVisible"
                placement="bottom-start"
                trigger="click">
      <el-tree ref="dataTree"
               :data="treeDatas"
               :props="props"
               :lazy="lazy"
               :load="load"
               :node-key="nodeKey"
               :default-expand-all="defaultExpandAll"
               :highlight-current="true"
               :expand-on-click-node="false"
               :filter-node-method="filterNode"
               @current-change="currentChangeHandle" />
    </el-popover>
    <el-input v-model="myValue.label"
              v-popover:treePopover
              :placeholder="placeholder"
              :readonly="readonly"
              :required="required"
              :disabled="disabled"
              :clearable="clearable"
              :style="myStyle"
              class="menu-list__input" />
  </div>
</template>

<script>
export default {
  name: 'TreeInput',
  event: 'select-node',
  props: {
    value: {
      // type: [String, Number],
      type: Object,
      default: null
    },
    placeholder: {
      type: String,
      default: '点击选择上级'
    },
    myStyle: {
      type: String,
      default: 'width: 100%'
    },
    readonly: Boolean,
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: true
    },
    treeDatas: {
      type: Array,
      default: function() {
        return []
      }
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    lazy: {
      type: Boolean,
      default: true
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    treeProps: {
      type: Object,
      default: function() {
        return {
          label: 'name',
          value: 'id',
          children: 'children',
          hasChildren: 'hasChildren'
        }
      }
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    loadInit: {
      type: Function,
      default: function() {}
    },
    getChildren: {
      type: Function,
      default: function(pid) {}
    },
    getMyInfo: {
      type: Function,
      default: function(id) {}
    }
  },
  data() {
    return {
      popoverVisible: false,
      myValue: { label: '', value: '' },
      props: {
        label: this.treeProps.label || 'name',
        value: this.treeProps.value || 'id',
        children: this.treeProps.children || 'children',
        hasChildren: this.treeProps.hasChildren || 'hasChildren',
        isLeaf: (data, node) => {
          return !data[this.props.hasChildren]
        }
      }
    }
  },
  computed: {},
  watch: {
    // 监听prop传的value，如果父级有变化了，将子组件的myValue也跟着变，达到父变子变的效果
    value(newVal) {
      // console.log(newVal)
      // this.myValue = newVal
      this.setCurrentValue(newVal)
    },
    // 监听myValue，如果子组件中的内容变化了，通知父级组件，将新的值告诉父级组件，我更新了，父级组件接受到值后页就跟着变了
    // 参考官网：https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model
    myValue: {
      deep: true,
      handler: function(newVal) {
        if (newVal.label) {
          this.$refs.dataTree.filter(newVal.label)
        }

        this.$emit('input', newVal)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data[this.treeProps.label].indexOf(value) !== -1
    },
    async load(node, resolve) {
      const { level } = node

      if (level === 0) {
        //console.log('loadInit')
        const data = await this.loadInit()

        resolve(data)
      } else {
        const { code, msg, data } = await this.getChildren(node.data.id)
        if (code === 200) {
          resolve(data)
        } else {
          this.$message.error(msg)
        }
      }
    },
    async loadNodeData(id) {
      const { code, msg, data } = await this.getMyInfo(id)
      if (code === 200) {
        return data
      } else {
        this.$message.error(msg)
      }
    },
    // 菜单树选中
    currentChangeHandle(data, node) {
      // console.log(data)
      this.myValue['label'] = data[this.props.label] || ''
      this.myValue['value'] = data[this.props.value]
      // console.log(this.myValue)
      this.popoverVisible = false
      this.$emit('select-node', data)
    },
    async setCurrentValue(newValue) {
      // console.log(this.$refs.dataTree)
      const node = this.$refs.dataTree.getNode(newValue.value)
      if (node) {
        this.$refs.dataTree.setCurrentKey(newValue.value)
        this.myValue['label'] = node.data[this.props.label] || ''
        this.myValue['value'] = node.data[this.props.value]
      } else {
        this.myValue['label'] = ''
        this.myValue['value'] = ''
        const data = await this.loadNodeData(newValue.value)
        if (data) {
          this.myValue['label'] = data[this.props.label] || ''
          this.myValue['value'] = data[this.props.value]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
</style>
