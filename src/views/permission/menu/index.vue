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
      lazy
      :load="load"
      :tree-props="{
        name: 'name',
        children: 'children',
        hasChildren: 'hasChildren'
      }"
    >
      <el-table-column
        label="名称"
        header-align="center"
        align="left"
        width="200px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标">
        <template slot-scope="{ row }">
          <svg-icon
            v-if="row.icon"
            :icon-class="row.icon"
            class-name="disabled"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="菜单URL"
        width="300"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型">
        <template slot-scope="{ row }">
          <el-tag :type="row.resourceType | menuTypeTagFilter">{{
            row.resourceType | menuTypeFilter
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号">
        <template slot-scope="{ row }">
          <span>{{ row.seq }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | ktfStatusTagFilter">{{
            row.status | ktfStatusFilter
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="LB.common.ACTIONS" width="120">
        <template slot-scope="{ row, $index }">
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
            @click="handleDelete(row, $index)"
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
import { page, remove, menuTypes, getChildren } from '@/api/permission/menu'
import { list2tree, childrenOfTree } from '@/utils'
import waves from '@/directive/waves' // waves directive
import AddOrUpdate from './add-or-update'
import Pagination from '@/components/Pagination'

export default {
  name: 'SysMenu',
  components: { Pagination, AddOrUpdate },
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
      total: 0,
      listLoading: true,
      listQuery: {
        keyword: '',
        pid: 0,
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      dialogStatus: 'create'
    }
  },
  computed: {
    module: {
      get() {
        return 'sys/menu'
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
          this.list = this.listQuery.keyword ? list2tree(data.list) : data.list
        } else {
          this.$message.error(msg)
        }
        this.listLoading = false
      })
    },
    load(row, treeNode, resolve) {
      if (this.listQuery.keyword) {
        var children = childrenOfTree(this.list, row.id)
        // console.log(children)
        resolve(children || [])
        return
      }

      getChildren(row.id).then(({ code, msg, data }) => {
        if (code === 200) {
          resolve(data)
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
      this.$confirm(`确定对[id=${ids.join(',')}]进行['删除' ]操作?`, '提示', {
        confirmButtonText: this.LB.common.CONFIRM,
        cancelButtonText: this.LB.common.CANCEL,
        type: 'warning'
      }).then(() => {
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
