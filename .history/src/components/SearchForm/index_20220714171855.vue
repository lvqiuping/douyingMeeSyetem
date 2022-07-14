<template>
  <div>
    99999999999999
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
