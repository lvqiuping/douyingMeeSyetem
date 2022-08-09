<template>
  <div class="dashboard-editor-container">
    <panel-group :panel-data="panelData" />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart v-if="flag" :bar-chart-data="barChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart v-if="flag" :pie-chart-data="pieChartData" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { GetStatisticsView } from '@/api/table'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    PieChart,
    BarChart
  },
  data() {
    return {
      flag: false,
      panelData: {},
      barChartData: {
        actualData: [],
        expectedData: []
      },
      pieChartData: []
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    getPageList() {
      GetStatisticsView().then((res) => {
        if (res.statusCode === 200) {
          this.flag = true // 跟组件生命周期有关，先获取到数据再加载组件，防止拿不到数据就渲染子组件
          this.panelData = res.data
          res.data.dayCommentUserCount.forEach(element => {
            this.barChartData.actualData.push(element.date)
            this.barChartData.expectedData.push(element.userCount)
          })
          this.pieChartData.push(
            { value: res.data.type0TaskCount, name: '关键词分析' },
            { value: res.data.type1TaskCount, name: '同行博主分析' },
            { value: res.data.type2TaskCount, name: '精准视频分析' }
          )
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
