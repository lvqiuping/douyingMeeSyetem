<template>
  <div class="dashboard-editor-container" :style="{backgroundImage: `url(${bgi})`}">

    <div class="dashtitle" :style="{backgroundImage: `url(${titleIamge})`}">喵客获客系统</div>
    <div class="dashboard-editor">
      <panel-group :panel-data="panelData" />
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="card-panel" :style="{backgroundImage: `url(${pieIamge})`}">
            <div class="card-panel-text">
              历史统计分析
            </div>
            <div class="card-panel-content">
              <pie-chart v-if="flag" :pie-chart-data="pieChartData" />
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="16">
          <div class="card-panel" :style="{backgroundImage: `url(${barIamge})`}">
            <div class="card-panel-text">
              任务获客量统计
            </div>
            <div class="card-panel-content">
              <bar-chart v-if="flag" :bar-chart-data="barChartData" />
            </div>
          </div>

        </el-col>
      </el-row>
    </div>

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
      pieChartData: [],
      bgi: require('@/assets/bgi.png'),
      titleIamge: require('@/assets/title.png'),
      pieIamge: require('@/assets/pie.png'),
      barIamge: require('@/assets/bar.png')
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
.dashtitle{
  text-align: center;
  color: #BDE4FF;
  font-size: 36px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  margin-bottom: 50px;
  padding: 10px 0;
}
.dashboard-editor-container {
  padding: 0 32px 0 32px;
  background-color: #304156;
  position: relative;
  min-height: inherit;
   background-repeat: no-repeat;
    background-position: center;
    background-size: 50%;
    
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .card-panel {
    font-size: 12px;
    position: relative;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 440px;
      .card-panel-text {
        text-align: center;
        line-height: 18px;
        color: #BDE4FF;
        font-size: 25px;
      }
      .card-panel-content {
        text-align: center;
       margin-top: 120px;
      }
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
