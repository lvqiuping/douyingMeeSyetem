<template>
  <div style="width:75%;text-align:center;margin:auto;">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="margin-left:50px;margin-right:50px;">
      <el-form-item label="用户名" prop="UserName">
        <el-input v-model.trim="temp.UserName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="RealName">
        <el-input v-model.trim="temp.RealName" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="密码" prop="Pwd">
        <el-input type="password" v-model.trim="temp.Pwd" placeholder="请输入密码" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" @click="createData()">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
import { updateTable } from '@/api/table'
import { validateUsername, validatePassword } from '@/utils/validator'
export default {
  name: 'DataForm',
  props: {
  },
  data() {
    return {
      loading: false,
      temp: {
        UserName: '',
        RealName: '',
        Pwd: ''
      },
      rules: {
        UserName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        Pwd: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  methods: {
    createData() {
      this.temp2 = `UserName=${this.temp.UserName}
      &RealName=${this.temp.RealName}
      &Pwd=${this.temp.Pwd}`
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
