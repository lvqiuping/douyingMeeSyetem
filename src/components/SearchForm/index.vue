<template>
  <div>
    <el-form ref="searchForm" :model="temp" label-position="" label-width="" style="display: flex;height: 40px;">
      <el-form-item v-show="searchForm === 'videoCapture'" prop="TaskName">
        <el-input v-model="temp.TaskName" placeholder="请输入任务名" />
      </el-form-item>
      <el-form-item v-show="searchForm === 'videoCapture2'" prop="TaskSource">
        <el-input v-model="temp.TaskSource" placeholder="输入采集源" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" style="margin-right: 10px;" @click.native.prevent="searching" />
    </el-form>
  </div>
</template>

<script>
import { TipsBox } from '@/utils/feedback.js'
export default {
  name: 'SearchForm',
  props: {
    searchForm: { type: String, default: null }
  },
  data() {
    return {
      temp: {
        TaskName: ''
      }
    }
  },
  methods: {
    searching() {
      console.log(this.temp.TaskName)
      if (!this.temp.TaskName) {
        TipsBox('warning', '请输入任务名')
        return false
      }
      this.$emit('searchFormEmit', this.temp.TaskName)
    }
  }
}
</script>
