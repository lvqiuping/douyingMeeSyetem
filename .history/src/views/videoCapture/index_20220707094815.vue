<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :multiple-table="false"
      :operates="operates"
      :add-slot="true"
    >
      <template v-slot:addSlot>
        <div>
          <el-button type="primary" @click="handleCreate">添加</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 600px; margin-left:50px;">
        <el-form-item label="任务名" prop="title">
          <el-input v-model="temp.title" placeholder="随意取一个名字吧" />
        </el-form-item>
        <el-form-item label="分析源" prop="title">
          <el-input v-model="temp.title" placeholder="输入采集源" />
          <div>分析全网视频关键词，只能单个词。例如： 北京二手车</div>
        </el-form-item>
        <el-form-item label="评论筛选关键词">
          <el-drag-select v-model="value" style="width:500px;" multiple placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-drag-select>
          <div>系统推荐关键词<span style="font-size: 12px; color: rgb(186,171,173)">（选择关键词快速添加到词库）</span></div>
        </el-form-item>
        <el-form-item label="评论屏蔽关键词">
          <el-drag-select v-model="value" style="width:500px;" multiple placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-drag-select>
          <div>系统推荐屏蔽关键词<span style="font-size: 12px; color: #ccc">（选择屏蔽关键词快速添加到词库）</span></div>
        </el-form-item>
        <el-form-item label="视频标题再筛选">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="如：二手车，北京二手车，车子" />
          <span style="font-size: 12px; color: rgb(186,171,173)">（该功能慎用，）</span>
        </el-form-item>
        <el-form-item label="消耗点数上限" prop="type">
          <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" /><span>点</span>
          <div style="font-size: 12px; color: rgb(186,171,173)">（填0则不限制点数）</div>
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { createTable, updateTable, deleteTable } from '@/api/table'
import { getList } from '@/api/table'
import { QueryBox } from '@/utils/feedback.js'
// import DataForm from '@/views/videoCapture/components/dataForm.vue'
export default {
  name: 'VideoCapture',
  components: { BasicTable, TableOperation, Pagination, ElDragSelect },
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
      num: 1,
      value: ['Apple', 'Banana', 'Orange'],
      options: [{
        value: 'Apple',
        label: 'Apple'
      }, {
        value: 'Banana',
        label: 'Banana'
      }, {
        value: 'Orange',
        label: 'Orange'
      }, {
        value: 'Pear',
        label: 'Pear'
      }, {
        value: 'Strawberry',
        label: 'Strawberry'
      }],
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
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
    handleChange(value) {
      console.log(value)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createTable(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
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
    // 确认编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateTable(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 操作列按钮
    handleOperation(op, row) {
      if (op.types === 'edit') {
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
