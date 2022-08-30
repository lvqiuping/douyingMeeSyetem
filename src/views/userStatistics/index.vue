<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :search-form="'userStatistics'"
      :multiple-table="false"
      :batch-deleted-button="false"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
    />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { GetAdminUserTaskStats } from '@/api/table'
import { getList } from '@/utils'
export default {
  name: 'UerStatistics',
  components: { BasicTable, Pagination },
  data() {
    return {
      loading: false,
      tableTitle: [
        {
          label: '创建者',
          value: 'createBy',
          show: true
        },
        {
          label: '关键词分析',
          value: 'type0TaskCount',
          show: true
        },
        {
          label: '同行博主分析',
          value: 'type1TaskCount',
          show: true
        },
        {
          label: '精准视频分析',
          value: 'type2TaskCount',
          show: true
        },
        {
          label: '视频数',
          value: 'videoTotalCount',
          show: true
        },
        {
          label: '客户数',
          value: 'commentTotalCount',
          show: true
        }
      ],
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        createBy: '',
        beginTime: '',
        endTime: ''
      }
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    searchFormEmit2(v) {
      this.listQuery.beginTime = v.userStatisticsTime[0]
      this.listQuery.endTime = v.userStatisticsTime[1]
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    // 获取表格数据
    getPageList() {
      this.loading = true
      getList(this, GetAdminUserTaskStats, this.listQuery)
    }
  }
}
</script>
