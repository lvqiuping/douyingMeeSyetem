<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :operates="operates"
      :operates-width="180"
    >
      <template v-slot:operates="scope">
        <table-operation
          :operations="operations"
          :raw-data="scope.scope.row"
          @handleOperation="handleOperation"
        />
      </template>
    </basic-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList(taskId)" />
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { getVideoList, getCommentCountList } from '@/api/table'
export default {
  name: 'Comment',
  components: { BasicTable, TableOperation, Pagination },
  data() {
    return {
      operates: {
        operate: true,
        label: '操作'
      },
      operations: [
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
          label: '评论内容',
          value: 'content',
          show: true
        },
        {
          label: '用户主页地址',
          value: 'userHomePageUrl',
          show: true
        },
        {
          label: '用户昵称',
          value: 'userNickName',
          show: true
        },
        {
          label: '用户电话',
          value: 'userPhone',
          show: true
        },
        {
          label: '用户微信',
          value: 'userWechat',
          show: true
        },
        {
          label: '评论时间',
          value: 'commentTime',
          show: true
        }

      ],
      multipleSelection: [],
      taskId: '',
      videoId: '',
      tableData: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        taskId: '',
        videoId: ''
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.taskId = this.$route.query.taskId
    this.videoId = this.$route.query.videoId
    this.getPageList()
  },
  methods: {
    getPageList() {
      const parmas = { 'pageIndex': this.listQuery.pageIndex, 'pageSize': this.listQuery.pageSize, 'taskId': this.taskId, 'videoId': this.videoId }
      console.log(parmas)
      getCommentCountList(parmas).then(response => {
        console.log('liebiao2', response)
        this.tableData = response.data.pageList
        this.total = response.data.totalRowCount
      })
    },
    handleOperation(op, row) {
      if (op.types === 'del') {
        console.log(row.id)
      }
    }
  }
}
</script>
