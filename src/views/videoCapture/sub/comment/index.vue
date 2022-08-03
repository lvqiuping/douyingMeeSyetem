<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :operates="operates"
      :loading="loading"
      @batchDeleted="batchDeleted"
      @refresh="getPageList"
    >
      <template v-slot:operates="scope">
        <table-operation
          :operations="operations"
          :raw-data="scope.scope.row"
          @handleOperation="handleOperation"
        />
      </template>
    </basic-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList" />
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { getCommentCountList, DeleteComments } from '@/api/table'
import { QueryBox, TipsBox } from '@/utils/feedback'
import { unique, getFormData } from '@/utils/others.js'
import { getList } from '@/utils'
export default {
  name: 'Comment',
  components: { BasicTable, TableOperation, Pagination },
  data() {
    return {
      loading: false,
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
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        taskId: '',
        videoId: ''
      }
    }
  },
  created() {
    this.taskId = this.$route.query.taskId
    this.videoId = this.$route.query.videoId
    this.getPageList()
  },
  methods: {
    getPageList() {
      var params = {}
      if (this.taskId) { // 从任务进来或则从视频进来
        params = { 'pageIndex': this.listQuery.pageIndex, 'pageSize': this.listQuery.pageSize, 'taskId': this.taskId }
      } else if (this.videoId) {
        params = { 'pageIndex': this.listQuery.pageIndex, 'pageSize': this.listQuery.pageSize, 'videoId': this.videoId }
      }
      getList(this, getCommentCountList, params)
    },
    handleOperation(op, row) {
      if (op.types === 'del') {
        QueryBox().then(() => {
          const params = `commentIds=${row.id}`
          this.del(params)
        })
          .catch(err => { console.error(err) })
      }
    },
    batchDeleted(v) {
      if (!v.length) {
        TipsBox('warning', '请选择需要删除的数据')
        return false
      }
      QueryBox().then(() => {
        var params = unique(v) // 去重
        const form = getFormData(params, 'commentIds[]')
        this.del(form)
      })
    },
    del(p) {
      DeleteComments(p).then(response => {
        if (response.statusCode === 200) {
          TipsBox('success', response.data)
          this.getPageList()
        }
      })
    }

  }
}
</script>
