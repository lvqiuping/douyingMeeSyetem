<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :operates="operates"
      :operates-width="180"
      :play-url="playUrl"
      :comment-count="commentCount"
    >
      <template v-slot:commentCount="scope">
        <!-- <div :style="{'color': '#409eff' }" @click="comment(scope.scope.row.id)">
          {{ scope.scope.row.commentCount }} {name: '', params:{ taskId: taskId, videoId: scope.scope.row.id }}
        </div> -->
        <router-link :to="{path: 'comment', query: {taskId: taskId, videoId: scope.scope.row.id}}" :style="{'color': '#409eff' }">
          <span> {{ scope.scope.row.commentCount }}</span>
        </router-link>
      </template>
      <template v-slot:playUrl="scope">
        <el-tag @click="play(scope.scope.row.playUrl)">
          {{ scope.scope.row.playUrl }}
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList(taskId)" />

    <el-dialog title="视频查看" :visible.sync="dialogFormVisible" top="3%">
      <video src="https://www.douyin.com/video/6670682915216706827" controls autoplay width="100%" />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { getVideoList, getCommentCountList } from '@/api/table'
export default {
  name: 'Video',
  components: { BasicTable, TableOperation, Pagination },
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
      url: '',
      commentCount: {
        label: '评论数'
      },
      playUrl: {
        state: true,
        label: '播放地址',
        width: 400
      },
      operates: {
        operate: true,
        label: '操作'
      },
      operations: [
        {
          types: 'edit',
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
      tableTitle: [
        {
          label: '任务ID',
          value: 'id',
          show: true
        },
        {
          label: '任务名',
          value: 'title',
          show: true
        },
        {
          label: '博客名',
          value: 'bloggerName',
          show: true
        },
        {
          label: '发布时间',
          value: 'publishTime',
          show: true
        },
        {
          label: '创建人',
          value: 'createBy',
          show: true
        },
        {
          label: '创建时间',
          value: 'createOn',
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
        taskId: ''
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.taskId = this.$route.query.taskId
    this.getPageList()
  },
  methods: {
    //
    comment(r) {
      console.log(r)
      const parmas = { 'pageIndex': this.listQuery.pageIndex, 'pageSize': this.listQuery.pageSize, 'taskId': this.taskId, 'videoId': r }
      getCommentCountList(parmas).then(response => {
        console.log('liebiao2', response)
        // this.tableData = response.data.pageList
        // this.total = response.data.totalRowCount
      })
    },
    //
    play(r) {
      console.log(r)
      // this.dialogFormVisible = true
      this.url = r
    },
    // 获取表格数据
    getPageList() {
      this.listLoading = true
      const parmas = { 'pageIndex': this.listQuery.pageIndex, 'pageSize': this.listQuery.pageSize, 'taskId': this.taskId }
      getVideoList(parmas).then(response => {
        console.log('liebiao', response)
        this.tableData = response.data.pageList
        this.total = response.data.totalRowCount
      })
    },
    // 操作列按钮
    handleOperation(op, row) {
      if (op.types === 'edit') {
        console.log(row)
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
    }
  }
}
</script>
