<template>
  <el-cascader
    v-model="currentValue"
    :placeholder="placeholder"
    :size="size"
    :style="myStyle"
    :clearable="clearable"
    :filterable="filterable"
    :props="props"
    :options="options"
    @change="handleChange"
  />
</template>

<script>
export default {
  name: 'DynamicCascader',
  props: {
    value: {
      type: Object,
      default: null
    },
    cascaderProps: {
      type: Object,
      default: function() {
        return {
          label: 'label',
          value: 'value',
          children: 'children',
          leaf: 'leaf'
        }
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    size: {
      type: String,
      default: 'medium'
    },
    myStyle: {
      type: String,
      default: 'width: 100%'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    valueProps: {
      type: Array,
      default: () => {
        return ['first', 'second', 'third']
      }
    },
    queryDataMethod: {
      type: Function,
      default: function(query) {}
    }
  },
  data() {
    return {
      currentValue: [],
      props: {
        expandTrigger: this.cascaderProps.expandTrigger || 'click',
        // checkStrictly: true,
        lazy: true,
        lazyLoad: this.lazyLoad,
        value: this.cascaderProps.value || 'value',
        label: this.cascaderProps.label || 'label',
        children: this.cascaderProps.children || 'children',
        leaf: this.cascaderProps.leaf || 'leaf'
      },
      options: []
    }
  },
  computed: {
    maxLevel: {
      get() {
        return this.valueProps.length
      }
    }
  },
  watch: {
    // 监听prop传的value，如果父级有变化了，将子组件的myValue也跟着变，达到父变子变的效果
    value(newVal) {
      // console.log(newVal)
      // this.currentValue = newVal
      this.valueProps.forEach((name, index) => {
        this.currentValue.push(newVal[name])
      })
    },
    // 监听currentValue，如果子组件中的内容变化了，通知父级组件，将新的值告诉父级组件，我更新了，父级组件接受到值后页就跟着变了
    currentValue(newVal) {}
  },
  created() {},
  mounted() {},
  methods: {
    lazyLoad(node, resolve) {
      const { level, value } = node
      // console.log('level:' + level)
      this.queryDataMethod(value).then(({ code, msg, data }) => {
        if (code === 200) {
          resolve(
            level + 1 === this.maxLevel
              ? data.map(item => {
                  item['leaf'] = true
                  return item
                })
              : data
          )
        } else {
          this.$message.error(msg)
        }
      })
    },
    handleChange(data) {
      var newVal = {}
      this.valueProps.forEach((name, index) => {
        newVal[name] = data[index]
      })
      this.$emit('input', newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
.cascader__input {
  > .el-input__inner {
    cursor: pointer;
    width: 300px;
  }
}
</style>
