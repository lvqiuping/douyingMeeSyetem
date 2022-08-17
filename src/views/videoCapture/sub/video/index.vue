<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :operates="operates"
      :loading="loading"
      :operates-width="180"
      :play-url="playUrl"
      :search-form="'video'"
      :comment-count="commentCount"
      @batchDeleted="batchDeleted"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
    >
      <template v-slot:commentCount="scope">
        <router-link :to="{path: 'comment', query: {taskId: listQuery.taskId, videoId: scope.scope.row.id}}" :style="{'color': '#409eff' }">
          <span> {{ scope.scope.row.commentCount }}</span>
        </router-link>
      </template>
      <template v-slot:playUrl="scope">
        <a :href="scope.scope.row.playUrl" target="_blank" style="color: #409eff">
          {{ scope.scope.row.playUrl }}
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

    <el-dialog title="视频查看" :visible.sync="dialogFormVisible" top="3%">
      <video src="https://www.douyin.com/video/6670682915216706827" controls autoplay width="100%" />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { getVideoList, DeleteVideos } from '@/api/table'
import { TipsBox, QueryBox } from '@/utils/feedback.js'
import { unique, getFormData } from '@/utils/others.js'
import { getList } from '@/utils'
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
      loading: false,
      commentCount: {
        label: '客户数量'
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
      tableTitle: [
        {
          label: 'ID',
          value: 'id',
          show: true
        },
        {
          label: '标题',
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
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        taskId: this.$route.query.taskId
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    // sousuo
    searchFormEmit2(v) {
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    // 获取表格数据
    getPageList() {
      this.loading = true
      getList(this, getVideoList, this.listQuery)
    },
    // 操作列按钮
    handleOperation(op, row) {
      if (op.types === 'comment') {
        this.$router.push({ path: 'comment', query: { taskId: this.listQuery.taskId, videoId: row.id }})
      } else if (op.types === 'del') {
        QueryBox().then(() => {
          const form = getFormData(row.id, 'videoIds[]')
          this.del(form)
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
        var parmas = unique(v) // 去重
        const form = getFormData(parmas, 'videoIds[]')
        this.del(form)
      })
    },
    del(p) {
      this.loading = true
      DeleteVideos(p).then(response => {
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
