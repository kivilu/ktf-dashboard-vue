<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="企业名称"
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
      <el-table-column type="selection" align="center" />
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

      <el-table-column label="企业名称" align="left" width="300px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="企业简称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.abbr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="行业" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.industryName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="地区" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.region }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" label="类型">
        <template slot-scope="{ row }">
          <el-tag :type="row.enterpriseType | enterpriseTypeTagFilter">{{
            row.type | enterpriseTypeFilter
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="联系人" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.mainPerson }}</span>
        </template>
      </el-table-column>

      <el-table-column label="联系电话" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.mainPersonMobile }}</span>
        </template>
      </el-table-column>

      <el-table-column label="企业邮箱" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.mainPersonEmail }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" label="状态">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | ktfStatusTagFilter">{{
            row.status | ktfStatusFilter
          }}</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column
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
      </el-table-column> -->

      <el-table-column align="center" :label="LB.common.ACTIONS" width="120">
        <template slot-scope="{ row }">
          <el-button
            v-if="isAccess(module, 'update')"
            type="text"
            size="small"
            @click="handleUpdate(row)"
          >
            <i class="el-icon-edit" />
          </el-button>
          <el-button
            v-if="isAccess(module, 'delete')"
            type="text"
            size="small"
            @click="handleDelete(row)"
          >
            <i class="el-icon-delete" />
          </el-button>
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
  </div>
</template>

<script>
import { page, remove, ENTERPRISE_TYPES } from '@/api/org/corp'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import AddOrUpdate from './add-or-update'

export default {
  name: 'OrgCorp',
  components: { Pagination, AddOrUpdate },
  directives: { waves },
  filters: {
    enterpriseTypeTagFilter(type) {
      var result = ENTERPRISE_TYPES.find(item => item.key === type)
      return result ? result.tag : 'info'
    },
    enterpriseTypeFilter(type) {
      var result = ENTERPRISE_TYPES.find(item => item.key === type)
      return result ? result.name : type
    }
  },
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
      dialogStatus: 'create',
      industryList: [],
      areaList: []
    }
  },
  computed: {
    module: {
      get() {
        return 'org/corp'
      }
    }
  },
  created() {
    this.getList()
    this.initIndustryList()
    this.initAreaList()
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
    initIndustryList() {},
    initAreaList() {}
  }
}
</script>

<style lang="scss" scoped></style>
