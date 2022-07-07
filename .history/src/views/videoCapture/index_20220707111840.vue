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
        <el-form-item label="分析源" prop="title2">
          <el-input v-model="temp.title2" placeholder="输入采集源" />
          <div>分析全网视频关键词，只能单个词。例如： 北京二手车</div>
        </el-form-item>
        <el-form-item label="评论筛选关键词">
          <el-drag-select v-model="value1" style="width:500px;" multiple placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-drag-select>
          <div>系统推荐关键词<span style="font-size: 12px; color: #ccc">（选择关键词快速添加到词库）</span></div>
        </el-form-item>
        <el-form-item label="评论屏蔽关键词">
          <el-drag-select v-model="value2" style="width:500px;" multiple placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-drag-select>
          <div>系统推荐屏蔽关键词<span style="font-size: 12px; color: #ccc">（选择屏蔽关键词快速添加到词库）</span></div>
        </el-form-item>
        <el-form-item label="视频标题再筛选">
          <el-input v-model="temp.title3" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" placeholder="如：二手车，北京二手车，车子" />
          <span style="font-size: 12px; color: #ccc">（该功能慎用，设置不正确可能会导致采集不到视频）在分析源搜索出来的视频再做一次筛选，可设置多个关键词，用逗号隔开。比如：二手车，北京二手车，车子</span>
        </el-form-item>

        <el-form-item label="搜索排序" prop="searchSort">
          <el-radio v-model="temp.searchSort" label="1">默认排序</el-radio>
          <el-radio v-model="temp.searchSort" label="2">最多点赞</el-radio>
          <el-radio v-model="temp.searchSort" label="3">最新发布</el-radio>
        </el-form-item>
        <el-form-item label="发布时间" prop="publicTime">
          <el-radio v-model="temp.publicTime" label="1">默认</el-radio>
          <el-radio v-model="temp.publicTime" label="2">3天内</el-radio>
          <el-radio v-model="temp.publicTime" label="3">一周内</el-radio>
          <el-radio v-model="temp.publicTime" label="4">15天内</el-radio>
          <el-radio v-model="temp.publicTime" label="5">一个月内</el-radio>
          <el-radio v-model="temp.publicTime" label="6">半年内</el-radio>
        </el-form-item>
        <el-form-item label="消耗点数上限" prop="title4">
          <el-input-number v-model="temp.title4" :min="0" :max="10" @change="handleChange1" /><span>点</span>
          <div style="font-size: 12px; color: #ccc">（填0则不限制点数）</div>
        </el-form-item>
        <el-form-item label="定时监控频率" prop="title5">
          <span>每</span><el-input-number v-model="temp.title5" :min="0" @change="handleChange2" /><span>天运行一次</span>
          <div style="font-size: 12px; color: #ccc">（默认为0，不开启自动监控）</div>
        </el-form-item>
        <el-form-item label="最长监控天数" prop="title6">
          <span>持续监控</span><el-input-number v-model="temp.title6" :min="0" @change="handleChange3" /><span>天后停止</span>
          <div style="font-size: 12px; color: #ccc">（默认为0，不开启自动监控）</div>
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
      rules: {
        title: [{ required: true, message: '请随意起个名字吧！', trigger: 'blur' }]
      },
      value1: ['Apple', 'Banana', 'Orange'],
      value2: ['Banana', 'Orange'],
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
        title: '',
        title2: '',
        title3: '',
        title4: '0',
        title5: '0',
        title6: '0',
        keyword1: '',
        keyword2: '',
        searchSort: '1',
        publicTime: '1',
        value1: [],
        value2: []

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
        keyword1: '',
        keyword2: '',
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
    createData() {
      this.temp.value1 = this.value1
      this.temp.value2 = this.value2
      console.log(this.temp)
      return false
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
