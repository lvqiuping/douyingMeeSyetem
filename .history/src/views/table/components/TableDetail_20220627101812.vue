<template>
  <div class="createPost-container">
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">
        Cancel
      </el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
        Confirm
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableDetail',
  data() {
    return {
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      calendarTypeOptions: [
        { key: 'CN', display_name: 'China' },
        { key: 'US', display_name: 'USA' },
        { key: 'JP', display_name: 'Japan' },
        { key: 'EU', display_name: 'Eurozone' }
      ]
    }
  }
}
</script>
