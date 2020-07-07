<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="账号/姓名"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.orgName"
        placeholder="所属企业"
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
        >{{ LB.common.SEARCH }}</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon=" el-icon-circle-plus-outline"
        @click="handleCreate"
        >{{ LB.common.CREATE }}</el-button
      >
      <el-button
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        @click="handleDelete"
        >{{ LB.common.REMOVE_BATCH }}</el-button
      >
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
      <el-table-column type="selection" align="center" />

      <el-table-column label="姓名" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="账号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.loginName }}</span>
        </template>
      </el-table-column>

      <el-table-column label=" 用户类型" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.userType | userTypeTagFilter">{{
            row.userType | userTypeFilter
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="企业" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.orgName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="部门" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.deptName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="职位" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.titleName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        width="80"
        label="状态"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.status | ktfStatusTagFilter">{{
            row.status | ktfStatusFilter
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="LB.common.ACTIONS" width="120">
        <template slot-scope="{ row }">
          <el-tooltip
            effect="dark"
            content="更新用户"
            placement="bottom"
            :hide-after="2000"
          >
            <el-button
              v-if="isAccess(module, 'update')"
              type="text"
              size="small"
              @click="handleUpdate(row)"
            >
              <i class="el-icon-edit" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="重置口令"
            placement="bottom"
            :hide-after="2000"
          >
            <el-button
              v-if="isAccess(module, 'passwordReset')"
              type="text"
              size="small"
              @click="handleResetPassword(row)"
            >
              <i class="el-icon-refresh-right" />
            </el-button>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            content="删除用户"
            placement="bottom"
            :hide-after="2000"
          >
            <el-button
              v-if="isAccess(module, 'delete')"
              type="text"
              size="small"
              @click="handleDelete(row)"
            >
              <i class="el-icon-delete" />
            </el-button>
          </el-tooltip>
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

    <add-or-update
      v-show="dialogFormVisible"
      ref="addOrUpdate"
      :dialog-status="dialogStatus"
      @refreshDataList="getList"
    />
    <!--弹窗：密码重置-->
    <reset-password
      v-if="resetPasswordVisible"
      ref="resetPassword"
      @refreshDataList="getList"
    />
  </div>
</template>

<script>
import { page, remove } from '@/api/permission/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import AddOrUpdate from './add-or-update'
import ResetPassword from './reset-password'

export default {
  name: 'SysUser',
  components: { Pagination, AddOrUpdate, ResetPassword },
  directives: { waves },
  props: {},
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        keyword: '',
        orgName: '',
        page: 1,
        limit: 20
      },
      multipleSelection: [],
      dialogFormVisible: false,
      resetPasswordVisible: false,
      dialogStatus: 'create'
    }
  },
  computed: {
    module: {
      get() {
        return 'sys/usr'
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
          this.list = data.list
          this.total = data.total
        } else {
          this.$message.error(msg)
        }
        this.listLoading = false
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
    handleDelete(row) {
      var ids = row ? [row.id] : this.multipleSelection.map(item => item.id)
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${row ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: this.LB.common.CONFIRM,
          cancelButtonText: this.LB.common.CANCEL,
          type: 'warning'
        }
      ).then(() => {
        remove(ids).then(({ code, msg, data }) => {
          if (code === 200) {
            this.$message({
              title: '操作成功',
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                // 查询数据
                this.getList()
              }
            })
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    // 重置用户PIN
    handleResetPassword(row) {
      this.resetPasswordVisible = true
      this.$nextTick(() => {
        this.$refs.resetPassword.init(row.id)
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
