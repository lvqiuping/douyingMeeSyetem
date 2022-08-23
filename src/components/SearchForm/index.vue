<template>
  <div>
    <el-form ref="searchForm" :model="temp" label-position="" label-width="" style="display: flex;height: 40px;">
      <el-form-item v-show="searchForm === 'videoCapture'" prop="TaskName" style="margin-right: 10px;">
        <el-input v-model.trim="temp.taskName" clearable placeholder="请输入任务名" @keyup.enter.native="searching()" />
      </el-form-item>
      <el-form-item v-show="searchForm === 'videoCapture' && this.$store.state.user.userName === 'admin'" prop="createby" style="margin-right: 10px;">
        <el-input v-model.trim="temp.createby" clearable placeholder="请输入创建人" @keyup.enter.native="searching()" />
      </el-form-item>
      <el-form-item v-show="searchForm === 'video'" prop="title">
        <el-input v-model.trim="temp.title" clearable placeholder="输入标题" @keyup.enter.native="searching()" />
      </el-form-item>
      <el-form-item v-show="searchForm === 'comment'" prop="title">
        <span>咨询时间：</span>
        <el-date-picker
          v-model="temp.commentTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="yyyy-MM-dd HH:MM:ss"
        />
      </el-form-item>
      <el-form-item v-show="searchForm === 'user'" prop="userName" style="margin-right: 10px;">
        <el-input v-model.trim="temp.userName" clearable placeholder="输入用户名" @keyup.enter.native="searching()" />
      </el-form-item>
      <el-form-item v-show="searchForm === 'user'" prop="realName" style="margin-right: 10px;">
        <el-input v-model.trim="temp.realName" clearable placeholder="输入真实姓名" @keyup.enter.native="searching()" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" style="margin-right: 10px;" @click.native.prevent="searching()" />
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SearchForm',
  props: {
    searchForm: { type: String, default: null }
  },
  data() {
    return {
      temp: {
        taskName: '',
        title: '',
        commentTime: '',
        userName: '',
        realName: '',
        createby: ''
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '全部',
            onClick(picker) {
              const end = ''
              const start = ''
              picker.$emit('pick', [start, end])
            }
          },
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
      }
    }
  },
  watch: {
    // 监听对象temp，
    temp: {
      handler(newVal) {
        this.$emit('searchFormEmit', newVal)
      },
      deep: true
    }
  },
  methods: {
    searching() {
      this.$emit('searchFormEmit', this.temp)
    }
  }
}
</script>
