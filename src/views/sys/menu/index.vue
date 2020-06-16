<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="菜单名称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ LB.common.SEARCH }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon=" el-icon-circle-plus-outline"
        @click="handleCreate"
      >{{ LB.common.CREATE }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      :element-loading-text="LB.common.LOADING"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="名称" header-align="center" align="left" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标">
        <template slot-scope="{row}">
          <svg-icon :icon-class="row.icon" class-name="disabled" />
        </template>
      </el-table-column>

      <el-table-column label="菜单URL" width="300" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型">
        <template slot-scope="{row}">
          <el-tag
            :type=" row.resourceType|menuTypeTagFilter "
          >{{ row.resourceType | menuTypeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号">
        <template slot-scope="{row}">
          <span>{{ row.seq }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type=" row.status|ktfStatusTagFilter ">{{ row.status | ktfStatusFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="LB.common.ACTIONS" width="120">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="isAccess('menu','update')"
            type="text"
            size="small"
            @click="handleUpdate(row)"
          >
            <i class="el-icon-edit" />
          </el-button>
          <el-button
            v-if="isAccess('menu','delete')"
            type="text"
            size="small"
            @click="handleDelete(row,$index )"
          >
            <i class="el-icon-delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <add-or-update
      v-show="dialogFormVisible"
      ref="addOrUpdate"
      :dialog-status="dialogStatus"
      @refreshDataList="getList"
    />
  </div>
</template>

<script>
import { list, remove, menuTypes } from '@/api/menu'
import { list2tree } from '@/utils'
import waves from '@/directive/waves' // waves directive
import AddOrUpdate from './add-or-update'

export default {
  name: 'SysMenu',
  components: { AddOrUpdate },
  directives: { waves },
  filters: {
    menuTypeTagFilter(type) {
      var result = menuTypes.find(item => item.key === type)
      return result ? result.tag : 'info'
    },
    menuTypeFilter(type) {
      var result = menuTypes.find(item => item.key === type)
      return result ? result.name : type
    }
  },
  props: {},
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        keyword: ''
      },
      dialogFormVisible: false,
      dialogStatus: 'create'
    }
  },
  created() { this.getList() },
  mounted() { },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(({ code, msg, data }) => {
        if (code === 200) {
          this.list = list2tree(data)
          this.listLoading = false
        } else {
          this.$message.error(msg)
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    handleUpdate(row) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row.id)
      })
    },
    handleDelete(row, index) {
      var ids = [row.id]
      remove(ids).then(({ code, msg, data }) => {
        if (code === 200) {
          this.$message({
            title: '操作成功',
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          // 查询数据
          this.getList()
        } else {
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
