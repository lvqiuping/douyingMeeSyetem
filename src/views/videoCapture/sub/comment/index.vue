<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :operates="operates"
      :loading="loading"
      :operates-width="180"
      :home-page-url="homePageUrl"
      :user-home-url="userHomeUrl"
      :search-form="'comment'"
      @batchDeleted="batchDeleted"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
    >
      <template v-slot:homePageUrl="scope">
        <a :href="scope.scope.row.homePageUrl" target="_blank" style="color: #409eff">
          {{ scope.scope.row.homePageUrl }}
        </a>
      </template>
      <template v-slot:userHomeUrl="scope">
        <a :href="scope.scope.row.userHomePageUrl" target="_blank" style="color: #409eff">
          {{ scope.scope.row.userHomePageUrl }}
        </a>
      </template>
      <template v-slot:operates="scope">
        <table-operation
          :operations="operations"
          :raw-data="scope.scope.row"
          @handleOperation="handleOperation"
        />
      </template>
    </basic-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
    <!-- 弹框 -->
    <el-dialog
      title="用抖音APP扫描下方二维码"
      :visible.sync="qrCodeDialogVisible"
      width="20%"
    >
      <qr-code :link="link" />
    </el-dialog>
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
import QrCode from '@/views/videoCapture/sub/comment/sub/qrCode.vue'
export default {
  name: 'Comment',
  components: { BasicTable, TableOperation, Pagination, QrCode },
  data() {
    return {
      qrCodeId: 'qrCodeId',
      flag: false,
      qrCodeDialogVisible: false,
      qrCodesId: '',
      loading: false,
      operates: {
        operate: true,
        label: '操作'
      },
      operations: [
        {
          types: 'wechart',
          title: '扫码私信',
          type: 'success',
          size: 'mini',
          icon: ['far', 'trash-can']
        },
        {
          types: 'del',
          title: '删除',
          type: 'danger',
          size: 'mini',
          icon: ['far', 'trash-can']
        }
      ],
      homePageUrl: {
        state: true,
        label: '视频地址'
        // width: 600
      },
      userHomeUrl: {
        state: true,
        label: '用户主页地址'
        // width: 600
      },
      tableTitle: [
        {
          label: '任务ID',
          value: 'id',
          show: true
        },
        {
          label: '内容',
          value: 'content',
          show: true
        },
        {
          label: '命中关键词',
          value: 'hitFilterWords',
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
          label: '用户描述',
          value: 'userDescribe',
          show: true
        },
        {
          label: '咨询时间',
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
        videoId: '',
        endDate: '',
        beginDate: ''
      },
      link: ''
    }
  },
  created() {
    this.listQuery.taskId = this.$route.query.taskId
    this.listQuery.videoId = this.$route.query.videoId
    this.getPageList()
  },
  methods: {
    // sousuo
    searchFormEmit2(v) {
      this.listQuery.beginDate = v.commentTime[0]
      this.listQuery.endDate = v.commentTime[1]
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    // liebiao
    getPageList() {
      this.loading = true
      getList(this, getCommentCountList, this.listQuery)
    },
    // caozuo
    handleOperation(op, row) {
      if (op.types === 'wechart') {
        this.qrCodeDialogVisible = true
        this.link = row.homePageUrl
      } else if (op.types === 'del') {
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
      this.loading = true
      DeleteComments(p).then(response => {
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
