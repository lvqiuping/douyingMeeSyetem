<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :multiple-table="false"
      :operates="operates"
      :add-slot="true"
      :operates-width="280"
    >
      <template v-slot:addSlot>
        <div>
          <el-button type="primary" size="medium" @click="handleCreate">添加</el-button>
        </div>
      </template>
      <template v-slot:operates="scope">
        <table-operation
          :operations="operations"
          :raw-data="scope.scope.row"
          @handleOperation="handleOperation"
        />
      </template>
    </basic-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList2" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="3%">
      <div class="el-dialog-div">
        <data-form :dialog-status="dialogStatus" @createDataEmit="createDataEmit" @dialogFormVisibleEmit="dialogFormVisibleEmit" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { createTable, updateTable, deleteTable } from '@/api/table'
import { getList } from '@/api/table'
import { QueryBox } from '@/utils/feedback.js'
import DataForm from '@/views/videoCapture/components/dataForm.vue'
export default {
  name: 'VideoCapture',
  components: { BasicTable, TableOperation, Pagination, DataForm },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '添加'
      },
      // 操作
      operates: {
        operate: true,
        label: '操作'
      },
      operations: [
        {
          types: 'video',
          title: '视频',
          type: 'success',
          size: 'mini',
          icon: ['fas', 'pen-to-square']
        },
        {
          types: 'customer',
          title: '客户',
          type: 'success',
          size: 'mini',
          icon: ['fas', 'pen-to-square']
        },
        {
          types: 'edit',
          title: '编辑',
          type: 'success',
          size: 'mini',
          icon: ['fas', 'pen-to-square']
        },
        {
          types: 'del',
          title: '删除',
          type: 'danger',
          size: 'mini',
          icon: ['far', 'trash-can']

        }
      ],
      filterColumns: FontFaceSetLoadEvent,
      tableTitle: [
        {
          label: 'ID',
          value: 'id',
          sortable: 'custom',
          show: true
        },
        {
          label: 'author',
          value: 'author',
          sortable: false,
          show: true
        },
        {
          label: 'display_time',
          value: 'display_time',
          sortable: false,
          show: true
        },
        {
          label: 'pageviews',
          value: 'pageviews',
          sortable: true,
          show: true
        },
        {
          label: 'status',
          value: 'status',
          sortable: true,
          show: true
        },
        {
          label: 'title',
          value: 'title',
          sortable: true,
          show: true
        }
      ],
      multipleSelection: [],
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false
    }
  },
  created() {
    this.getList2()
  },
  methods: {
    handleChange1(value) {
      console.log(value)
    },
    handleChange2(value) {
      console.log(value)
    },
    handleChange3(value) {
      console.log(value)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        title2: '',
        title3: '',
        title4: '0',
        title5: '0',
        title6: '0',
        searchSort: '1',
        publicTime: '1',
        value1: [],
        value2: []
      }
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //
    createDataEmit(v) {
      console.log('新增参数', v)
      return false
      // this.temp.author = 'vue-element-admin'
      createTable(v).then(() => {
        this.list.unshift(this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 编辑
    handleUpdate(row) {
      console.log('row', row)
      this.temp = Object.assign({}, row) // copy obj 热更新
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //
    dialogFormVisibleEmit(v) {
      this.dialogFormVisible = v
    },
    // 操作列按钮
    handleOperation(op, row) {
      if (op.types === 'video') {
        console.log('video', row.id)
        this.$router.push({ path: 'video', query: { id: row.id }})
      } else if (op.types === 'customer') {
        console.log('customer', row.id)
        this.$router.push({ path: 'customer', query: { id: row.id }})
      } else if (op.types === 'edit') {
        console.log(row)
        this.handleUpdate(row)
      } else if (op.types === 'del') {
        console.log(row.id)
        // QueryBox()
        this.$confirm('确定删除此项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 获取表格数据
    getList2() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        console.log('liebiao', response)
        this.tableData = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 删除
    handleDelete(row, $index) {
      console.log(row)
      console.log($index)
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteTable(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 批量删除
    handleBatchDeleted() {
      if (this.multipleSelection.length) {
        console.log(this.multipleSelection)
      } else {
        this.$message({
          message: 'Please select at least one item',
          type: 'warning'
        })
      }
    },
    //
    sortChange(data) {
      console.log(data)
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      console.log(order)
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList2()
    },
    // 。。。。。。。。。。。
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog-div{
  height: 75vh;
  overflow: hidden;
  overflow-y: auto;
}
</style>
