<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" :style="{backgroundImage: `url(${panelImage})`}">
        <div class="card-panel-text">
          当前运行任务
        </div>
        <div class="card-panel-content">
          <img src="@/assets/panel1.png" style="width: 100px; height: auto;">
          <count-to :start-val="0" :end-val="panelData.processingTaskCount" :duration="2600" class="card-panel-num color1" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" :style="{backgroundImage: `url(${panelImage})`}">
        <div class="card-panel-text">
          获取客户档案
        </div>
        <div class="card-panel-content">
          <img src="@/assets/panel2.png" style="width: 100px; height: auto">
          <count-to :start-val="0" :end-val="panelData.commentTotalCount" :duration="2600" class="card-panel-num color2" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" :style="{backgroundImage: `url(${panelImage})`}">
        <div class="card-panel-text">
          总视频数
        </div>
        <div class="card-panel-content">
          <img src="@/assets/panel3.png" style="width: 100px; height: auto">
          <count-to :start-val="0" :end-val="panelData.videoTotalCount" :duration="2600" class="card-panel-num color3" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: { panelData: { type: Object, default: null }},
  data() {
    return {
      panelImage: require('@/assets/panel.png')
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;

  }

  .card-panel {
    cursor: pointer;
    font-size: 12px;
    position: relative;
    color: #666;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    height: 300px;
      .card-panel-text {
        text-align: center;
        line-height: 18px;
        color: #BDE4FF;
        font-size: 25px;
      }
      .card-panel-content {
        text-align: center;
        line-height: 350px;
      }
  }
   .card-panel-num {
        font-size: 25px;
        margin-left: 20px;
      }
      .color1{
            color: #FE693B;
        }
         .color2{
            color: #F6C603;
        }
         .color3{
            color: #01FBAF;
        }
}
</style>
