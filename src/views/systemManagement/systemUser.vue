<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :operates="operates"
      :loading="loading"
      :operates-width="180"
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList(taskId)" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { getVideoList, DeleteVideos } from '@/api/table'
import { TipsBox, QueryBox } from '@/utils/feedback.js'
import { unique, getFormData } from '@/utils/others.js'
import { getList } from '@/utils'
export default {
  name: 'SystemUser',
  components: { BasicTable, TableOperation, Pagination },
  data() {
    return {
      user: {},
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
        taskId: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'userName',
      'token'
    ])
  },
  created() {
    console.log(this)
    console.log(this.$store.state.user)
    this.getPageList()
  },
  methods: {
    // 获取表格数据
    getPageList() {
      this.loading = true
      this.user = { userName: this.userName }
      console.log(this.user)
      const params = { 'pageIndex': this.listQuery.pageIndex, 'pageSize': this.listQuery.pageSize, 'userName': this.store }
      console.log(params)
      return
      getList(this, getVideoList, params)
    },
    // 操作列按钮
    handleOperation(op, row) {
      if (op.types === 'edit') {
        console.log(row)
      } else if (op.types === 'del') {
        QueryBox().then(() => {
          const form = getFormData(row.id, 'videoIds[]')
          this.del(form)
        })
          .catch(err => { console.error(err) })
      }
    },
    batchDeleted(v) {
      console.log(v)
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
      DeleteVideos(p).then(response => {
        if (response.statusCode === 200) {
          TipsBox('success', response.data)
          this.getPageList(this.taskId)
        }
      })
    }
  }
}
</script>
