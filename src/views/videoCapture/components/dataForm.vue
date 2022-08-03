<template>
  <div>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="margin-left:50px;margin-right:50px;">
      <el-form-item label="任务名" prop="TaskName">
        <el-input v-model.trim="temp.TaskName" placeholder="随意取一个名字吧" />
      </el-form-item>
      <el-form-item label="分析源" prop="TaskSource">
        <el-input v-model.trim="temp.TaskSource" placeholder="输入采集源" />
        <div v-show="taskType === 0"> <div class="secondColor">填只能单个的关键词。例如： 北京二手车</div></div>
        <div v-show="taskType === 1"> <div class="secondColor">填抖音当前博主首页的网址。例如： https://www.douyin.com/user/***</div></div>
        <div v-show="taskType === 2"> <div class="secondColor">填当前分析视频的网址（搜索视频列表点击详情，或者博主作品点击进去的地址）。例如： https://www.douyin.com/video/***</div></div>
      </el-form-item>
      <el-form-item label="评论筛选关键词">
        <el-drag-select v-model="CommentKeyWords" style="width:500px;" multiple placeholder="请选择">
          <el-option v-for="item in options1" :key="item" :label="item" :value="item" />
        </el-drag-select>
        <div class="secondColor">系统推荐关键词<span class="seatColor">（选择关键词快速添加到词库）</span></div>
      </el-form-item>

      <el-form-item label="评论屏蔽关键词">
        <el-drag-select v-model="CommentShieldWords" style="width:500px;" multiple placeholder="请选择">
          <el-option v-for="item in options2" :key="item" :label="item" :value="item" />
        </el-drag-select>
        <div class="secondColor">系统推荐屏蔽关键词<span class="seatColor">（选择屏蔽关键词快速添加到词库）</span></div>
      </el-form-item>

      <el-form-item label="视频标题再筛选">
        <el-input v-model.trim="temp.TitleKeyWords" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" placeholder="如：二手车，北京二手车，车子" />
        <div class="secondColor">
          <span class="seatColor">（该功能慎用，设置不正确可能会导致采集不到视频）在分析源搜索出来的视频再做一次筛选，可设置多个关键词，用逗号隔开。比如：二手车，北京二手车，车子</span>
        </div>
      </el-form-item>
      <el-form-item label="视频抓取数量上限" prop="VideoUpLimitCount">
        <el-input-number v-model="temp.VideoUpLimitCount" :min="0" :max="300" size="small" @change="changeVideoUpLimitCount" />
        <!-- <div class="secondColor"><span class="seatColor">（填0则不限制点数）</span></div> -->
      </el-form-item>
      <el-form-item v-show="taskType === 1" label="评论抓取数量上限" prop="CommentUpLimitCount">
        <el-input-number v-model="temp.CommentUpLimitCount" :min="0" :max="1000" size="small" @change="changeCommentUpLimitCount" />
        <!-- <div class="secondColor"><span class="seatColor">（填0则不限制点数）</span></div> -->
      </el-form-item>
      <el-form-item v-show="taskType === 2" label="评论抓取数量上限" prop="CommentUpLimitCount">
        <el-input-number v-model="temp.CommentUpLimitCount" :min="0" :max="10000" size="small" @change="changeCommentUpLimitCount" />
        <!-- <div class="secondColor"><span class="seatColor">（填0则不限制点数）</span></div> -->
      </el-form-item>
      <el-form-item label="搜索排序" prop="SortBy">
        <el-radio v-model="temp.SortBy" label="0">默认排序</el-radio>
        <el-radio v-model="temp.SortBy" label="1">最多点赞</el-radio>
        <el-radio v-model="temp.SortBy" label="2">最新发布</el-radio>
      </el-form-item>

      <el-form-item label="发布时间" prop="PublishFromNowDay">
        <el-radio v-model="temp.PublishFromNowDay" label="0">默认</el-radio>
        <el-radio v-model="temp.PublishFromNowDay" label="1">三天内</el-radio>
        <el-radio v-model="temp.PublishFromNowDay" label="2">一周内</el-radio>
        <el-radio v-model="temp.PublishFromNowDay" label="3">半个月内</el-radio>
        <el-radio v-model="temp.PublishFromNowDay" label="4">一个月内</el-radio>
        <el-radio v-model="temp.PublishFromNowDay" label="5">半年内</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = $emit('dialogFormVisibleEmit', false)">
        取消
      </el-button>
      <el-button type="primary" :loading="loading" @click="dialogStatus==='create'?createData() : updateData()">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { updateTable } from '@/api/table'
import { validateTaskName } from '@/utils/validator'
export default {
  name: 'DataForm',
  components: { ElDragSelect },
  props: {
    dialogStatus: { type: String, default: String },
    loading: { type: Boolean, default: false },
    taskType: { type: Number, default: null },
    options1: { type: Array, default: null },
    options2: { type: Array, default: null }

  },
  data() {
    return {
      temp: {
        TaskName: '',
        TaskType: this.taskType, // 这是后台让传的参数：关键词分析0，同行分析1，精准分析2。必填
        TaskSource: '',
        TitleKeyWords: '',
        SortBy: '0',
        PublishFromNowDay: '0',
        VideoUpLimitCount: 300,
        CommentUpLimitCount: 10000
      },
      rules: {
        TaskName: [{ required: true, trigger: 'blur', validator: validateTaskName }],
        TaskSource: [{ required: true, trigger: 'blur', validator: this.validateTaskSource }]
      },
      CommentKeyWords: [],
      CommentShieldWords: []
    }
  },
  methods: {
    // 单独验证分析源
    validateTaskSource(rule, value, callback) {
      // var reg = /^(http([s]{0, 1}):\/\/)(www.douyin.com\/user\/.+)$/gi
      if (this.taskType === 0) {
        if (value === '') {
          callback(new Error('请输入分析源'))
        } else {
          callback()
        }
      } else if (this.taskType === 1) {
        if (value.indexOf('https://www.douyin.com/user/') < 0) {
          callback(new Error('请输入正确的分析源'))
        } else {
          callback()
        }
      } else if (this.taskType === 2) {
        if (value.indexOf('https://www.douyin.com/video/') < 0) {
          callback(new Error('请输入正确的分析源'))
        } else {
          callback()
        }
      }
    },
    changeVideoUpLimitCount(value) {
      this.VideoUpLimitCount = value
    },
    changeCommentUpLimitCount(value) {
      this.CommentUpLimitCount = value
    },
    createData() {
      this.temp.CommentKeyWords = this.CommentKeyWords
      this.temp.CommentShieldWords = this.CommentShieldWords
      this.temp2 = `TaskName=${this.temp.TaskName}&TaskType=${this.temp.TaskType}&TaskSource=${this.temp.TaskSource}&CommentKeyWords=${this.temp.CommentKeyWords}&CommentShieldWords=${this.temp.CommentShieldWords}&TitleKeyWords=${this.temp.TitleKeyWords}&SortBy=${this.temp.SortBy}&PublishFromNowDay=${this.temp.PublishFromNowDay}&VideoUpLimitCount=${this.temp.VideoUpLimitCount}&CommentUpLimitCount=${this.temp.CommentUpLimitCount}`
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$emit('createDataEmit', this.temp2)
        }
      })
    },
    // 确认编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateTable(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
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
