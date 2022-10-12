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
      <el-form-item label="抓取平台">
        <el-select v-model="temp.GrabPlatform" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="筛选关键词" prop="CommentKeyWords">
        <el-drag-select v-model="temp.CommentKeyWords" style="width:500px;" multiple placeholder="请选择">
          <el-option v-for="item in options1" :key="item" :label="item" :value="item" />
        </el-drag-select>
        <div style="display: flex;">
          <div class="secondColor">系统推荐关键词<span class="seatColor">（选择关键词快速添加到词库）</span></div>
          <span style="color: #409eff" @click="zidingyi2=!zidingyi2">点击自定义值(每次定义一个值，回车即可)</span>
        </div>
        <el-input v-show="zidingyi2 === true" v-model.trim="temp.CommentKeyWords2" placeholder="如：二手车" @keyup.enter.native="getWords2(temp.CommentKeyWords2)" />
      </el-form-item>

      <el-form-item label="屏蔽关键词">
        <el-drag-select v-model="temp.CommentShieldWords" style="width:500px;" multiple placeholder="请选择">
          <el-option v-for="item in options2" :key="item" :label="item" :value="item" />
        </el-drag-select>
        <div style="display: flex;">
          <div class="secondColor">系统推荐屏蔽关键词<span class="seatColor">（选择屏蔽关键词快速添加到词库)</span></div>
          <span style="color: #409eff" @click="zidingyi3=!zidingyi3">点击自定义值(每次定义一个值，回车即可)</span>
        </div>
        <el-input v-show="zidingyi3 === true" v-model.trim="temp.CommentShieldWords2" placeholder="如：二手车" @keyup.enter.native="getWords3(temp.CommentShieldWords2)" />
      </el-form-item>

      <el-form-item label="视频标题再筛选">
        <el-input v-model.trim="temp.TitleKeyWords" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" placeholder="如：二手车，北京二手车，车子" />
        <div class="secondColor">
          <span class="seatColor">（该功能慎用，设置不正确可能会导致采集不到视频）在分析源搜索出来的视频再做一次筛选，可设置多个关键词，用逗号隔开。比如：二手车，北京二手车，车子)</span>
        </div>
      </el-form-item>
      <el-form-item label="视频抓取数量上限" prop="VideoUpLimitCount">
        <el-input-number v-model="temp.VideoUpLimitCount" :min="0" :max="300" size="small" @change="changeVideoUpLimitCount" />
      </el-form-item>
      <el-form-item v-show="taskType === 0" label="抓取数量上限" prop="CommentUpLimitCount">
        <el-input-number v-model="temp.CommentUpLimitCount" :min="0" :max="taskTypeComment" size="small" @change="changeCommentUpLimitCount" />
      </el-form-item>
      <el-form-item v-show="taskType === 1" label="抓取数量上限" prop="CommentUpLimitCount">
        <el-input-number v-model="temp.CommentUpLimitCount" :min="0" :max="taskTypeComment" size="small" @change="changeCommentUpLimitCount" />
      </el-form-item>
      <el-form-item v-show="taskType === 2" label="抓取数量上限" prop="CommentUpLimitCount">
        <el-input-number v-model="temp.CommentUpLimitCount" :min="0" :max="taskTypeComment" size="small" @change="changeCommentUpLimitCount" />
      </el-form-item>
      <el-form-item label="任务刷新" prop="RefreshStatus">
        <el-switch
          v-model="temp.RefreshStatus"
          active-text="启用"
          inactive-text="不启用"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item v-show="temp.RefreshStatus == 1" label="刷新周期（天）" prop="RefreshInterval">
        <el-input-number v-model="temp.RefreshInterval" :min="1" size="small" @change="changeRefreshInterval" />
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
import { validateTaskName, validateCommentKeyWords } from '@/utils/validator'
export default {
  name: 'DataForm',
  components: { ElDragSelect },
  props: {
    temp: { type: Object, default: Object },
    dialogStatus: { type: String, default: String },
    loading: { type: Boolean, default: false },
    taskType: { type: Number, default: null },
    taskTypeComment: { type: Number, default: null },
    options1: { type: Array, default: null },
    options2: { type: Array, default: null }
  },
  data() {
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      options: [
        {
          value: 0,
          label: '抖音'
        },
        {
          value: 1,
          label: '快手'
        }
      // {
      //   value: 2,
      //   label: '视频号'
      // }
      ],
      zidingyi2: false,
      zidingyi3: false,
      rules: {
        TaskName: [{ required: true, trigger: 'blur', validator: validateTaskName }],
        TaskSource: [{ required: true, trigger: 'blur', validator: this.validateTaskSource }],
        CommentKeyWords: [{ required: true, trigger: 'change', validator: validateCommentKeyWords }]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs['dataForm'].clearValidate()
    })
  },
  methods: {
    // 单独验证分析源
    validateTaskSource(rule, value, callback) {
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
          return false
        } else {
          callback()
        }
      }
    },
    changeRefreshInterval(value) {
      this.temp.RefreshInterval = value
    },
    changeVideoUpLimitCount(value) {
      this.temp.VideoUpLimitCount = value
    },
    changeCommentUpLimitCount(value) {
      this.temp.CommentUpLimitCount = value
    },
    getWords2(v) {
      this.temp.CommentKeyWords.push(v)
      this.temp.CommentKeyWords2 = ''
      this.zidingyi2 = false
    },
    getWords3(v) {
      this.temp.CommentShieldWords.push(v)
      this.temp.CommentShieldWords2 = ''
      this.zidingyi3 = false
    },
    createData() {
      this.temp2 = `TaskName=${this.temp.TaskName}&TaskType=${this.temp.TaskType}&TaskSource=${this.temp.TaskSource}&CommentKeyWords=${this.temp.CommentKeyWords}&CommentShieldWords=${this.temp.CommentShieldWords}&TitleKeyWords=${this.temp.TitleKeyWords}&SortBy=${this.temp.SortBy}&PublishFromNowDay=${this.temp.PublishFromNowDay}&VideoUpLimitCount=${this.temp.VideoUpLimitCount}&CommentUpLimitCount=${this.temp.CommentUpLimitCount}&RefreshStatus=${this.temp.RefreshStatus}&RefreshInterval=${this.temp.RefreshInterval}&GrabPlatform=${this.temp.GrabPlatform}`
      this.$refs['dataForm'].validate((valid) => {
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
