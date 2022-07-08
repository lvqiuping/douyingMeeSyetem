<template>
  <div>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style=" margin-left:50px;margin-right:50px;">
      <el-form-item label="任务名" prop="title">
        <el-input v-model="temp.title" placeholder="随意取一个名字吧" />
      </el-form-item>
      <el-form-item label="分析源" prop="title2">
        <el-input v-model="temp.title2" placeholder="输入采集源" />
        <div class="secondColor">分析全网视频关键词，只能单个词。例如： 北京二手车</div>
      </el-form-item>
      <el-form-item label="评论筛选关键词">
        <el-drag-select v-model="value1" style="width:500px;" multiple placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-drag-select>
        <div class="secondColor">系统推荐关键词<span class="seatColor">（选择关键词快速添加到词库）</span></div>
      </el-form-item>
      <el-form-item label="评论屏蔽关键词">
        <el-drag-select v-model="value2" style="width:500px;" multiple placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-drag-select>
        <div class="secondColor">系统推荐屏蔽关键词<span class="seatColor">（选择屏蔽关键词快速添加到词库）</span></div>
      </el-form-item>
      <el-form-item label="视频标题再筛选">
        <el-input v-model="temp.title3" :autosize="{ minRows: 2, maxRows: 10}" type="textarea" placeholder="如：二手车，北京二手车，车子" />
        <div class="secondColor">
          <span class="seatColor">（该功能慎用，设置不正确可能会导致采集不到视频）在分析源搜索出来的视频再做一次筛选，可设置多个关键词，用逗号隔开。比如：二手车，北京二手车，车子</span>
        </div>
      </el-form-item>

      <el-form-item label="搜索排序" prop="searchSort">
        <el-radio v-model="temp.searchSort" label="1">默认排序</el-radio>
        <el-radio v-model="temp.searchSort" label="2">最多点赞</el-radio>
        <el-radio v-model="temp.searchSort" label="3">最新发布</el-radio>
      </el-form-item>
      <el-form-item label="发布时间" prop="publicTime">
        <el-radio v-model="temp.publicTime" label="1">默认</el-radio>
        <el-radio v-model="temp.publicTime" label="2">3天内</el-radio>
        <el-radio v-model="temp.publicTime" label="3">一周内</el-radio>
        <el-radio v-model="temp.publicTime" label="4">15天内</el-radio>
        <el-radio v-model="temp.publicTime" label="5">一个月内</el-radio>
        <el-radio v-model="temp.publicTime" label="6">半年内</el-radio>
      </el-form-item>
      <el-form-item label="消耗点数上限" prop="title4">
        <el-input-number v-model="temp.title4" :min="0" :max="10" size="small" @change="handleChange1" /><span>点</span>
        <div class="secondColor"><span class="seatColor">（填0则不限制点数）</span></div>
      </el-form-item>
      <el-form-item label="定时监控频率" prop="title5">
        <span>每</span><el-input-number v-model="temp.title5" :min="0" size="small" @change="handleChange2" /><span>天运行一次</span>
        <div class="secondColor"><span class="seatColor">（默认为0，不开启自动监控）</span></div>
      </el-form-item>
      <el-form-item label="最长监控天数" prop="title6">
        <span>持续监控</span><el-input-number v-model="temp.title6" :min="0" size="small" @change="handleChange3" /><span>天后停止</span>
        <div class="secondColor"><span class="seatColor">（默认为0，不开启自动监控）</span></div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = $emit('dialogFormVisibleEmit', false)">
        取消
      </el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { createTable, updateTable } from '@/api/table'

export default {
  name: 'DataForm',
  components: { ElDragSelect },
  props: {
    dialogStatus: { type: String, default: String }
  },
  data() {
    return {
      temp: {
        id: undefined,
        title: '',
        title2: '',
        title3: '',
        title4: '0',
        title5: '0',
        title6: '0',
        searchSort: '1',
        publicTime: '1',
        value1: [],
        value2: []

      },
      rules: {
        title: [{ required: true, message: '请随意起个名字吧！', trigger: 'blur' }]
      },
      value1: ['Apple', 'Banana', 'Orange'],
      value2: ['Banana', 'Orange'],
      options: [{
        value: 'Apple',
        label: 'Apple'
      }, {
        value: 'Banana',
        label: 'Banana'
      }, {
        value: 'Orange',
        label: 'Orange'
      }, {
        value: 'Pear',
        label: 'Pear'
      }, {
        value: 'Strawberry',
        label: 'Strawberry'
      }]
    }
  },
  methods: {
    createData() {
      this.temp.value1 = this.value1
      this.temp.value2 = this.value2
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$emit('createDataEmit', this.temp)
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
