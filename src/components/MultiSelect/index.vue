<template>
  <div>
    <el-row>
      <el-col v-for="sel in selects" :key="sel.key" :span="8">
        <el-select
          :key="sel.key"
          :ref="sel.ref"
          v-model="values[sel.key]"
          :placeholder="sel.placeholder"
          value-key="key"
          filterable
          @change="onChangeHandle"
          @focus="onFocusHandle"
        >
          <el-option
            v-for="item in sel.options"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MultiSelect',
  props: {
    value: {
      type: Object,
      default: null
    },
    selectProps: {
      type: Array,
      default: () => {
        return [
          { label: '一级', name: 'level1', placeholder: '请选择' },
          { label: '二级', name: 'level2', placeholder: '请选择' },
          { label: '三级', name: 'level3', placeholder: '请选择' }
        ]
      }
    },
    optionProps: {
      type: Object,
      default: function() {
        return {
          label: 'name',
          value: 'value'
        }
      }
    },
    readonly: Boolean,
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    queryDataMethod: {
      type: Function,
      default: function(query) {}
    }
  },
  data() {
    return {
      loading: false,
      selects: [],
      values: [],
      oldValues: []
    }
  },
  computed: {
    span: {
      get() {
        return 8
      }
    }
  },
  watch: {
    values: {
      deep: true,
      handler: function(newValues) {
        // console.log('oldvalues:' + this.oldValues)
        // console.log('newValues:' + newValues)
        var index = newValues.findIndex(
          (value, index) => value !== this.oldValues[index]
        )

        const newVal = newValues[index]
        this.oldValues[index] = newVal

        if (index + 1 < this.values.length) {
          this.getOptions(index + 1, newVal)
        }
      }
    }
  },
  created() {
    this.selects = this.buildSelectProps()
    this.getOptions()
  },
  mounted() {},
  methods: {
    buildSelectProps() {
      var result = []
      this.selectProps.forEach((select, index) => {
        this.oldValues[index] = ''
        this.values[index] = ''
        result.push({
          key: index,
          label: select.label || '一级',
          name: select.name || 'level' + index,
          placeholder: select.placeholder || '请选择',
          ref: 'select_' + index,
          options: []
        })
      })

      return result
    },
    list2options(list) {
      return list.map(item => {
        return {
          label: item[this.optionProps.label],
          value: item[this.optionProps.value],
          key: item[this.optionProps.value]
        }
      })
    },
    getOptions(iSel = 0, query = '') {
      this.loading = true

      this.selects.forEach(select => {
        if (select.key >= iSel) {
          select.options = []
          this.values[select.key] = ''
        }
      })

      this.queryDataMethod(query).then(({ code, msg, data }) => {
        this.loading = false
        if (code === 200) {
          this.selects[iSel].options = this.list2options(data)
        } else {
          this.$message.error(msg)
        }
      })
    },
    onChangeHandle(data) {
      // console.log(data)
    },
    onFocusHandle(event) {
      // console.log(event)
    }
  }
}
</script>

<style lang="scss" scoped></style>
