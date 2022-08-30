<template>
  <div class="">
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
      :create-by="createBy"
      :loading="loading"
      @batchDeleted="batchDeleted"
      @searchFormEmit2="searchFormEmit2"
      @refresh="getPageList()"
    >
      <template v-slot:addSlot>
        <div>
          <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>
      </template>
      <template v-slot:createBy="scope">
        <div>
          <span> {{ scope.scope.row.createBy }}</span>
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
          <span v-if="scope.scope.row.taskStatus === 2">已撤销</span>
          <span v-if="scope.scope.row.taskStatus === 3">已完成</span>
          <span v-if="scope.scope.row.taskStatus === 4">任务异常</span>
        </el-link>
      </template>
      <template v-slot:operates="scope">
        <!-- 当任务状态为已创建时，操作按钮为开始；当任务状态为进行中时，操作按钮为撤销；当任务状态为已完成/已撤销时，操作按钮为删除； -->
        <table-operation
          :operations=" scope.scope.row.taskStatus === 0 ? operations2 : scope.scope.row.taskStatus === 1 ? operations3: operations"
          :raw-data="scope.scope.row"
          @handleOperation="handleOperation"
        />
      </template>
    </basic-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="3%">
      <div class="el-dialog-div">
        <data-form
          :dialog-status="dialogStatus"
          :loading="loading"
          :task-type="taskType"
          :task-type-comment="taskTypeComment"
          :options1="options1"
          :options2="options2"
          :temp="temp"
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
import { getTaskList, AddGrabTask, DeleteTasks, GetTaskParameters, RevokeTask } from '@/api/table'
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
    taskType: { type: Number, default: 0 },
    taskTypeComment: { type: Number, default: null }
  },
  data() {
    return {
      options1: [],
      options2: [],
      commentCount: {
        label: '意向客户数'
      },
      videoCount: {
        label: '线索视频数'
      },
      createBy: {
        label: '创建人'
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
          types: 'video',
          title: '视频',
          type: 'success',
          size: 'mini',
          icon: ['fas', 'pen-to-square']
        },
        {
          types: 'comment',
          title: '客户',
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
      operations2: [
        {
          types: 'video',
          title: '视频',
          type: 'success',
          size: 'mini',
          icon: ['fas', 'pen-to-square']
        },
        {
          types: 'comment',
          title: '客户',
          type: 'success',
          size: 'mini',
          icon: ['fas', 'pen-to-square']
        },
        {
          types: 'start',
          title: '开始',
          type: 'primary',
          size: 'mini',
          icon: ['far', 'trash-can']
        }
      ],
      operations3: [
        {
          types: 'video',
          title: '视频',
          type: 'success',
          size: 'mini',
          icon: ['fas', 'pen-to-square']
        },
        {
          types: 'comment',
          title: '客户',
          type: 'success',
          size: 'mini',
          icon: ['fas', 'pen-to-square']
        },
        {
          types: 'revoke',
          title: '撤销',
          type: 'warning',
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
          label: '筛选关键词',
          value: 'commentKeyWords',
          show: true
        },
        {
          label: '屏蔽关键词',
          value: 'commentShieldWords',
          show: true
        },
        {
          label: '视频标题再筛选',
          value: 'titleKeyWords',
          show: true
        },
        {
          label: '创建时间',
          value: 'createOn',
          show: true
        }
      ],
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        taskType: this.taskType
      },
      taskNameCopy: '',
      temp: {
        TaskName: '',
        TaskType: this.taskType, // 这是后台让传的参数：关键词分析0，同行分析1，精准分析2。必填
        TaskSource: '',
        TitleKeyWords: '',
        SortBy: '0',
        PublishFromNowDay: '0',
        VideoUpLimitCount: 300,
        CommentUpLimitCount: this.taskTypeComment,
        CommentKeyWords: [],
        CommentKeyWords2: '',
        CommentShieldWords: [],
        CommentShieldWords2: '',
        status: false,
        intervalDays: 0
      }
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    // 获取表格数据
    getPageList() {
      this.loading = true
      getList(this, getTaskList, this.listQuery)
    },
    searchFormEmit2(v) {
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    resetTemp() {
      this.temp = {
        TaskName: '',
        TaskType: this.taskType, // 这是后台让传的参数：关键词分析0，同行分析1，精准分析2。必填
        TaskSource: '',
        TitleKeyWords: '',
        SortBy: '0',
        PublishFromNowDay: '0',
        VideoUpLimitCount: 300,
        CommentUpLimitCount: this.taskTypeComment,
        CommentKeyWords: [],
        CommentKeyWords2: '',
        CommentShieldWords: [],
        CommentShieldWords2: '',
        status: false,
        intervalDays: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // 从后台获取的关键词
      GetTaskParameters().then((res) => {
        var a = res.data.commnetFilterWords.split(',')
        var b = res.data.commnetShiledWords.split(',')
        this.options1 = a
        this.options2 = b
      })
    },
    createDataEmit(v) {
      console.log(v)
      return
      this.loading = true
      AddGrabTask(v).then((res) => {
        if (res.statusCode === 200) {
          TipsBox('success', res.data)
          this.dialogFormVisible = false
          this.listQuery.pageIndex = 1
          this.getPageList()
          this.loading = false
        }
      })
    },
    handleUpdate(row) {
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
      if (op.types === 'video') {
        this.$router.push({ path: 'video', query: { taskId: row.id }})
      } else if (op.types === 'comment') {
        this.$router.push({ path: 'comment', query: { taskId: row.id }})
      } else if (op.types === 'edit') {
        this.handleUpdate(row)
      } else if (op.types === 'del') {
        QueryBox().then(() => {
          const params = `taskIds=${row.id}`
          this.del(params)
        })
          .catch(err => { console.error(err) })
      } else if (op.types === 'revoke') {
        QueryBox('是否撤销该数据?').then(() => {
          const params = `taskId=${row.id}`
          this.revoke(params)
        })
      }
    },
    batchDeleted(v) {
      if (!v.length) {
        TipsBox('warning', '请选择需要删除的数据')
        return false
      }
      var a = []
      const b = [0, 1]
      v.forEach(element => {
        a.push(element.taskStatus)
      })
      var result = a.filter((num) => { return b.indexOf(num) !== (-1) }) // 取2个数组的交集
      if (result.length === 0) {
        QueryBox().then(() => {
          var params = unique(v) // 去重
          const form = getFormData(params, 'taskIds[]')
          this.del(form)
        })
      } else {
        TipsBox('warning', '选项包含了不能删除项')
        return
      }
    },
    del(p) {
      this.loading = true
      DeleteTasks(p).then(response => {
        if (response.statusCode === 200) {
          TipsBox('success', response.data)
          this.getPageList()
          this.loading = false
        }
      })
    },
    revoke(p) {
      this.loading = true
      RevokeTask(p).then(response => {
        if (response.statusCode === 200) {
          TipsBox('success', response.data)
          this.getPageList()
          this.loading = false
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
