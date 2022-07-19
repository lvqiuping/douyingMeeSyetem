<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :operates="operates"
      :add-slot="true"
      :operates-width="280"
      :status="status"
      :search-form="'videoCapture'"
      @batchDeleted="batchDeleted"
    >
      <template v-slot:addSlot>
        <div>
          <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>
      </template>
      <template v-slot:status="scope">
        <el-tag :type="scope.scope.row.status | StatusFilter">
          {{ scope.scope.row.status }}
        </el-tag>
      </template>
      <template v-slot:operates="scope">
        <table-operation
          :operations="operations"
          :raw-data="scope.scope.row"
          @handleOperation="handleOperation"
        />
      </template>
    </basic-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getPageList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="3%">
      <div class="el-dialog-div">
        <data-form :dialog-status="dialogStatus" :loading="loading" @createDataEmit="createDataEmit" @dialogFormVisibleEmit="dialogFormVisibleEmit" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { getList, createTable, updateTable, deleteTable } from '@/api/table'
import { TipsBox, QueryBox } from '@/utils/feedback.js'
import DataForm from '@/views/videoCapture/components/dataForm.vue'
import { StatusFilter } from '@/utils/status-filter.js'
import { unique } from '@/utils/others.js'
export default {
  name: 'VideoCapture',
  components: { BasicTable, TableOperation, Pagination, DataForm },
  filters: {
    StatusFilter
  },
  data() {
    return {
      loading: false,
      ids: [],
      status: {
        state: true,
        label: '任务状态'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '添加'
      },
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
      tableTitle: [
        {
          label: '任务ID',
          value: 'id',
          show: true
        },
        {
          label: '任务名',
          value: 'author',
          show: true
        },
        {
          label: '采集源',
          value: 'display_time',
          show: true
        },
        {
          label: '时间筛选',
          value: 'author',
          show: true
        },
        {
          label: '意向客户数',
          value: 'title',
          show: true
        },
        {
          label: '线索视频数',
          value: 'title',
          show: true
        },
        {
          label: '定时截止时间',
          value: 'title',
          show: true
        },
        {
          label: '创建时间',
          value: 'title',
          show: true
        }
      ],
      multipleSelection: [],
      tableData: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        taskName: ''
      }
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    batchDeleted(v) {
      console.log(v)
      if (!v.length) {
        TipsBox('warning', '请选择需要删除的数据')
        return false
      }
      this.ids = unique(v) // 去重
      console.log('ids', this.ids)
      QueryBox().then(() => {
        TipsBox('success', '操作成功')
      }).catch(() => {
        TipsBox('info', '已取消')
      })
    },
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
      var str = v.split('&')
      var obj = {}
      str.map((e) => {
        obj[e.split('=')[0]] = e.split('=')[1]
      })
      createTable(v).then((res) => {
        this.loading = true
        if (res.statusCode === 200) {
          this.loading = false
          TipsBox('success', res.data)
          this.dialogFormVisible = false
          this.getPageList(obj.TaskName)
        }
        // this.list.unshift(this.temp)
        // this.dialogFormVisible = false
        // this.$notify({
        //   title: 'Success',
        //   message: 'Created Successfully',
        //   type: 'success',
        //   duration: 2000
        // })
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
    getPageList(TaskName) {
      this.listLoading = true
      const parmas = `pageIndex=${this.listQuery.pageIndex}&pageSize=${this.listQuery.pageSize}&taskName=${TaskName}`
      console.log(parmas)
      getList(parmas).then(response => {
        console.log('liebiao', response)
        this.tableData = response.data.items
        this.total = response.data.total
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
      this.getPageList()
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
