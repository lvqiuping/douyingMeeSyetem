<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :search-form="'userStatistics'"
      :multiple-table="false"
      :batch-deleted-button="false"
      :type-one="typeOne"
      :type-two="typeTwo"
      :type-three="typeThree"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
      @sortChange="sortChange"
    >
      <template v-slot:typeOne="scope">
        <div>
          <router-link :to="{path: '/videoCapture', query: {createby: scope.scope.row.createBy}}" :style="{'color': '#409eff' }">
            <span>{{ scope.scope.row.type0TaskCount }}</span>
          </router-link>
        </div>
      </template>
      <template v-slot:typeTwo="scope">
        <div>
          <router-link :to="{path: '/videoCapture/peerBlogger'}" :style="{'color': '#409eff' }">
          <span> {{ scope.scope.row.type1TaskCount }}</span>
          </router-link>
        </div>
      </template>
      <template v-slot:typeThree="scope">
        <div>
          <router-link :to="{path: '/videoCapture/accurateVideo'}" :style="{'color': '#409eff' }">
          <span> {{ scope.scope.row.type2TaskCount }}</span>
          </router-link>
        </div>
      </template>
    </basic-table>
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
      typeOne: {
        label: '关键词分析'
      },
      typeTwo: {
        label: '同行博主分析'
      },
      typeThree: {
        label: '精准视频分析'
      },
      tableTitle: [
        {
          label: '创建者',
          value: 'createBy',
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
        endTime: '',
        orderBy: ''
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
    sortChange(v) {
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
