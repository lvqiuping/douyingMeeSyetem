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
      :comment-count="commentCount"
      :video-count="videoCount"
      :loading="loading"
      @batchDeleted="batchDeleted"
      @searchFormEmit2="searchFormEmit2"
      @refresh="getPageList"
    >
      <template v-slot:addSlot>
        <div>
          <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>
      </template>
      <template v-slot:videoCount="scope">
        <router-link :to="{path: 'video', query: {taskId: scope.scope.row.id}}" :style="{'color': '#409eff' }">
          <span> {{ scope.scope.row.videoCount }}</span>
        </router-link>
      </template>
      <template v-slot:commentCount="scope">
        <router-link :to="{path: 'comment', query: {taskId: scope.scope.row.id}}" :style="{'color': '#409eff' }">
          <span>{{ scope.scope.row.commentCount }}</span>
        </router-link>
      </template>
      <template v-slot:status="scope">
        <el-link :type="scope.scope.row.taskStatus | StatusFilter">
          <span v-if="scope.scope.row.taskStatus === 0">已创建</span>
          <span v-if="scope.scope.row.taskStatus === 1">进行中</span>
          <span v-if="scope.scope.row.taskStatus === 2">已暂停</span>
          <span v-if="scope.scope.row.taskStatus === 3">已完成</span>
          <span v-if="scope.scope.row.taskStatus === 4">已作废</span>
        </el-link>
      </template>
      <template v-slot:operates="scope">
        <table-operation
          :operations="operations"
          :raw-data="scope.scope.row"
          @handleOperation="handleOperation"
        />
      </template>
    </basic-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList(taskType)" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="3%">
      <div class="el-dialog-div">
        <data-form
          :dialog-status="dialogStatus"
          :loading="loading"
          :task-type="taskType"
          :options1="options1"
          :options2="options2"
          @createDataEmit="createDataEmit"
          @dialogFormVisibleEmit="dialogFormVisibleEmit"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { getTaskList, AddGrabTask, DeleteTasks, GetTaskParameters } from '@/api/table'
import { TipsBox, QueryBox } from '@/utils/feedback.js'
import DataForm from '@/views/videoCapture/components/dataForm.vue'
import { StatusFilter } from '@/utils/status-filter.js'
import { unique, getFormData } from '@/utils/others.js'
import { getList } from '@/utils'
export default {
  name: 'VideoCapture',
  components: { BasicTable, TableOperation, Pagination, DataForm },
  filters: {
    StatusFilter
  },
  props: {
    taskType: { type: Number, default: 0 }
  },
  data() {
    return {
      options1: [],
      options2: [],
      commentCount: {
        label: '评论数'
      },
      videoCount: {
        label: '视频数'
      },
      loading: false,
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
          value: 'taskName',
          show: true
        },
        {
          label: '分析源',
          value: 'taskSource',
          show: true
        },
        {
          label: '评论筛选关键词',
          value: 'commentKeyWords',
          show: true
        },
        {
          label: '评论屏蔽关键词',
          value: 'commentShieldWords',
          show: true
        },
        {
          label: '视频标题再筛选',
          value: 'titleKeyWords',
          show: true
        }
      ],
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        taskName: '',
        taskType: ''
      },
      taskNameCopy: ''
    }
  },
  created() {
    this.getPageList(this.taskType)
  },
  methods: {
    searchFormEmit2(v) {
      console.log('页面', v)
      this.getPageList(this.taskType, v)
    },
    resetTemp() {
      this.temp = {
        TaskName: '',
        TaskType: this.taskType, // 这是后台让传的参数：关键词分析0，同行分析1，精准分析2。必填
        TaskSource: '',
        CommentKeyWords: '',
        CommentShieldWords: '',
        TitleKeyWords: '',
        SortBy: '0',
        PublishFromNowDay: '0',
        VideoUpLimitCount: 0,
        CommentUpLimitCount: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      GetTaskParameters().then((res) => {
        var a = res.data.commnetFilterWords.split(',')
        var b = res.data.commnetShiledWords.split(',')
        this.options1 = a
        this.options2 = b
      })
    },
    createDataEmit(v) {
      console.log('添加参数', v)
      AddGrabTask(v).then((res) => {
        this.loading = true
        if (res.statusCode === 200) {
          this.loading = false
          TipsBox('success', res.data)
          this.dialogFormVisible = false
          this.getPageList(this.taskType)
        }
      })
    },
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
    dialogFormVisibleEmit(v) {
      this.dialogFormVisible = v
    },
    handleOperation(op, row) {
      if (op.types === 'customer') {
        console.log('customer', row.id)
        this.$router.push({ path: 'customer', query: { id: row.id }})
      } else if (op.types === 'edit') {
        console.log(row)
        this.handleUpdate(row)
      } else if (op.types === 'del') {
        QueryBox().then(() => {
          const params = `taskIds=${row.id}`
          this.del(params)
        })
          .catch(err => { console.error(err) })
      }
    },
    // 获取表格数据
    getPageList(taskType, taskName) {
      this.loading = true
      // get用json格式
      const params = { 'pageIndex': this.listQuery.pageIndex, 'pageSize': this.listQuery.pageSize, 'taskType': taskType, 'taskName': taskName }
      getList(this, getTaskList, params)
    },
    batchDeleted(v) {
      if (!v.length) {
        TipsBox('warning', '请选择需要删除的数据')
        return false
      }
      QueryBox().then(() => {
        var params = unique(v) // 去重
        const form = getFormData(params, 'taskIds[]')
        this.del(form)
      })
    },
    del(p) {
      DeleteTasks(p).then(response => {
        if (response.statusCode === 200) {
          TipsBox('success', response.data)
          this.getPageList(this.taskType)
        }
      })
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
