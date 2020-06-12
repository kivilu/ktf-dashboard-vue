<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="关键词"
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
      >
        {{ LB.common.SEARCH }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon=" el-icon-circle-plus-outline"
        @click="handleCreate"
      >
        {{ LB.common.CREATE }}
      </el-button>
      <el-button
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="handleDelete"
      >
        {{ LB.common.REMOVE_BATCH }}
      </el-button>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
      />
      <el-table-column
        :label="LB.common.ID"
        prop="id"
        align="center"
        width="80px"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="名称"
        align="left"
        width="300px"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="LB.common.GMT_CREATE"
        width="155px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.gmtCreate | parseTime() }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="LB.common.GMT_UPDATE"
        width="155px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.gmtUpdate | parseTime() }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="LB.common.ACTIONS"
        width="120"
      >
        <template slot-scope="{row,$index}">
          <el-button
            v-if="isAccess(role,'update')"
            type="text"
            size="small"
            @click="handleUpdate(row)"
          >
            <i class="el-icon-edit" /></el-button>
          <el-button
            v-if="isAccess(role,'delete')"
            type="text"
            size="small"
            @click="handleDelete(row,$index )"
          ><i class="el-icon-delete" /></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <add-or-update
      v-show="dialogFormVisible"
      ref="addOrUpdate"
      :dialog-status="dialogStatus"
      @refreshDataList="getList"
    />
  </div>
</template>

<script>
import { page, remove } from '@/api/role'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import AddOrUpdate from './add-or-update'

export default {
  name: 'SysRole',
  components: { Pagination, AddOrUpdate },
  directives: { waves },
  props: {},
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        keyword: '',
        page: 1,
        limit: 20
      },
      multipleSelection: [],
      dialogFormVisible: false,
      dialogStatus: 'create'
    }
  },
  created() { this.getList() },
  mounted() { },
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery).then(({ code, msg, data }) => {
        if (code === 200) {
          this.list = data
          this.listLoading = false
        } else {
          this.$message.error(msg)
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
      remove(row.id).then(({ code, msg, data }) => {
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

<style
  lang="scss"
  scoped
>

</style>
