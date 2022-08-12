<template>
  <div>
    <el-form ref="searchForm" :model="temp" label-position="" label-width="" style="display: flex;height: 40px;">
      <el-form-item v-show="searchForm === 'videoCapture'" prop="TaskName">
        <el-input v-model.trim="temp.TaskName" clearable placeholder="请输入任务名" @keyup.enter.native="searching(temp.TaskName)" />
      </el-form-item>
      <el-form-item v-show="searchForm === 'video'" prop="title">
        <el-input v-model.trim="temp.title" clearable placeholder="输入标题" @keyup.enter.native="searching(temp.title)" />
      </el-form-item>
      <el-form-item v-show="searchForm === 'comment'" prop="title">
        <el-date-picker
          v-model="temp.commentTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="yyyy-MM-dd HH:MM:ss"
          @change="getCommentTime"
        />
      </el-form-item>
      <el-form-item v-show="searchForm === 'user'" prop="userName" style="margin-right: 10px;">
        <el-input v-model.trim="temp.userName" clearable placeholder="输入用户名" @keyup.enter.native="searching(temp.userName)" />
      </el-form-item>
      <el-form-item v-show="searchForm === 'user'" prop="realName" style="margin-right: 10px;">
        <el-input v-model.trim="temp.realName" clearable placeholder="输入真实姓名" @keyup.enter.native="searching(temp.realName)" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" style="margin-right: 10px;" @click.native.prevent="searching(temp)" />
    </el-form>
  </div>
</template>

<script>
import { TipsBox } from '@/utils/feedback'
export default {
  name: 'SearchForm',
  props: {
    searchForm: { type: String, default: null }
  },
  data() {
    return {
      temp: {
        TaskName: '',
        title: '',
        commentTime: '',
        userName: '',
        realName: ''
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '3天内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '一周内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '半年内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '一年内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      params: ''
    }
  },
  methods: {
    //
    getCommentTime(v) {
    },
    //
    searching(p) {
      if (this.searchForm === 'videoCapture') {
        this.params = p.TaskName
        if (!this.params) {
          TipsBox('warning', '请输入任务名')
          return
        }
      } else if (this.searchForm === 'video') {
        this.params = p.title
        if (!this.params) {
          TipsBox('warning', '请输入标题')
          return
        }
      } else if (this.searchForm === 'comment') {
        this.params = p.commentTime
        if (!this.params) {
          TipsBox('warning', '请选择时间')
          return
        }
      } else if (this.searchForm === 'user') {
        if (p.userName === '' && p.realName === '') {
          TipsBox('warning', '请输入用户名或真实姓名')
          return
        }
        this.params = { 'userName': p.userName, 'realName': p.realName }
      }
      this.$emit('searchFormEmit', this.params)
    }
  }
}
</script>
