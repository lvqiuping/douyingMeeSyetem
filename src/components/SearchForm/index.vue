<template>
  <div>
    <el-form ref="searchForm" :model="temp" label-position="" label-width="" class="flex flex-row h-10 w-64">
      <el-form-item v-if="searchForm === 'videoCapture'" prop="TaskName">
        <el-input v-model="temp.TaskName" placeholder="请输入任务名" />
      </el-form-item>
      <el-form-item v-if="searchForm === 'videoCapture2'" prop="TaskSource">
        <el-input v-model="temp.TaskSource" placeholder="输入采集源" />
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" class="mr-2.5" @click.native.prevent="searching" />
      </div>
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
