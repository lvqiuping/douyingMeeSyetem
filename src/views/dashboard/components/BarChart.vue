<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'chart'
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    barChartData: {
      type: Object,
      default: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      this.setOptions(this.barChartData)
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption(this.barChartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        // title: { text: '任务获客量统计' },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow' this.barChartData.data
          }
        },
        grid: {
          top: 0,
          left: '2%',
          right: '2%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: actualData,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: { // x轴文字
            textStyle: {
              color: '#BDE4FF'
            }
          },
          axisLine: { // x轴线
            show: false,
            lineStyle: {
              color: '#BDE4FF'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLabel: { // y轴文字
            textStyle: {
              color: '#BDE4FF'
            }
          },
          axisLine: { // y轴线
            show: true,
            lineStyle: {
              color: '#BDE4FF'
            }
          }
        }],
        series: [{
          name: '获客',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: expectedData,
          animationDuration,
          color: [ // 柱子颜色
            '#58D6FF'
          ]
        }]
      })
    }
  }
}
</script>
