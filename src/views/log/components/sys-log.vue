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
      <el-form-item>
        <el-date-picker
          v-model="listQuery.dateRange"
          type="daterange"
          align="right"
          unlink-panels
          :start-placeholder="LB.common.BEGIN_TIME"
          :end-placeholder="LB.common.END_TIME"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
          style="width: 230px"
        />
      </el-form-item>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ LB.common.SEARCH }}
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
    >
      <el-table-column
        :label="LB.common.ID"
        prop="id"
        align="center"
        width="80px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户标识" prop="loginName" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" prop="userName" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label=" 用户类型" prop="userType" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.userType | userTypeTagFilter">
            {{ row.userType | userTypeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作动作" prop="operation" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.operation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作结果" prop="result" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.result }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="LB.common.GMT_CREATE"
        width="155px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.gmtCreate | parseTime() }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="LB.common.GMT_UPDATE"
        width="155px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.gmtUpdate | parseTime() }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { page, LOG } from '@/api/sys/log'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'SysLogLogin',
  components: { Pagination },
  directives: { waves },
  props: {
    logType: {
      type: Number,
      default: LOG.login
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        keyword: '',
        dateRange: '',
        page: 1,
        limit: 20
      },
      dialogFormVisible: false
    }
  },
  computed: {
    module: {
      get() {
        return 'sys/log/login'
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    getList() {
      this.listLoading = true
      page(this.listQuery).then(({ code, msg, data }) => {
        if (code === 200) {
          this.list = data
        } else {
          this.$message.error(msg)
        }
        this.listLoading = false
      })
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
