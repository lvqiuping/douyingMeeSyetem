<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :operates="operates"
      :operates-width="280"
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getPageList" />
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { getList } from '@/api/table'
export default {
  name: 'Video',
  components: { BasicTable, TableOperation, Pagination },
  data() {
    return {
      operates: {
        operate: true,
        label: '操作'
      },
      operations: [
        {
          types: 'edit',
          title: '扫码私信',
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
          sortable: 'custom',
          show: true
        },
        {
          label: '任务名',
          value: 'author',
          sortable: false,
          show: true
        },
        {
          label: '说明',
          value: 'display_time',
          sortable: false,
          show: true
        },
        {
          label: '昵称',
          value: 'pageviews',
          sortable: true,
          show: true
        },
        {
          label: '内容',
          value: 'status',
          sortable: true,
          show: true
        },
        {
          label: '手机',
          value: 'title',
          sortable: true,
          show: true
        },
        {
          label: 'WX',
          value: 'title',
          sortable: true,
          show: true
        },
        {
          label: '命中关键词',
          value: 'title',
          sortable: true,
          show: true
        },
        {
          label: '咨询时间',
          value: 'title',
          sortable: true,
          show: true
        },
        {
          label: '分析时间',
          value: 'title',
          sortable: true,
          show: true
        },
        {
          label: '状态',
          value: 'title',
          sortable: true,
          show: true
        }
      ],
      multipleSelection: [],
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
      }
    }
  },
  created() {
    console.log(this.$route.query)
    this.getPageList()
  },
  methods: {
    // 获取表格数据
    getPageList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        console.log('liebiao', response)
        this.tableData = response.data.items
        this.total = response.data.total
      })
    }
  }
}
</script>
