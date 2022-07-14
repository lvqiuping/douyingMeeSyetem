<template>
  <div>
    <el-form ref="searchForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="margin-left:50px;margin-right:50px;">
      <el-form-item v-show="searchVideoCapture === true" label="任务名" prop="TaskName">
        <el-input v-model="temp.TaskName" placeholder="随意取一个名字吧" />
      </el-form-item>
      <el-form-item label="分析源" prop="TaskSource">
        <el-input v-model="temp.TaskSource" placeholder="输入采集源" />
        <div class="secondColor">分析全网视频关键词，只能单个词。例如： 北京二手车</div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = $emit('dialogFormVisibleEmit', false)">
        取消
      </el-button>
      <el-button type="primary" :loading="loading" @click="dialogStatus==='create'?createData():updateData()">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
import { validateUsername } from '@/utils/validator'
export default {
  name: 'SearchForm',
  props: {
    searchVideoCapture: { type: Boolean, default: false }
  },
  data() {
    return {
      temp: {
        TaskName: '',
        TaskSource: ''
      },
      rules: {
        TaskName: [{ required: true, trigger: 'blur', validator: validateUsername }]
      }
    }
  },
  methods: {
    createData() {
      this.temp.CommentKeyWords = this.CommentKeyWords
      this.temp.CommentShieldWords = this.CommentShieldWords
      this.temp2 = `TaskName=${this.temp.TaskName}&TaskSource=${this.temp.TaskSource}&CommentKeyWords=${this.temp.CommentKeyWords}&CommentShieldWords=${this.temp.CommentShieldWords}&TitleKeyWords=${this.temp.TitleKeyWords}&SortBy=${this.temp.SortBy}&PublishFromNowDay=${this.temp.PublishFromNowDay}`
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.$emit('createDataEmit', this.temp2)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.secondColor{
  color: #606266;
  font-size: 12px;
  .seatColor{
    color: #909399;
  }
}
.dialog-footer{
  text-align: center;
}
</style>
