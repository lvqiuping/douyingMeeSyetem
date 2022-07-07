<template>
  <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
    <el-form-item label="Type" prop="type">
      <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>
    <el-form-item label="Date" prop="timestamp">
      <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
    </el-form-item>
    <el-form-item label="Title" prop="title">
      <el-input v-model="temp.title" />
    </el-form-item>
    <el-form-item label="Remark">
      <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
    </el-form-item>
  </el-form>
  <!-- <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">
      Cancel
    </el-button>
    <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
      Confirm
    </el-button>
  </div> -->
</template>

<script>
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
import { createTable, updateTable } from '@/api/table'

export default {
  name: 'DataForm',
  components: {},
  filters: {
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  props: {

  },
  data() {
    return {
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      calendarTypeOptions

    }
  },
  methods: {
    // 确认新增
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createTable(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 编辑
    handleUpdate(row) {
      console.log('row', row)
      this.temp = Object.assign({}, row) // copy obj 热更新
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
