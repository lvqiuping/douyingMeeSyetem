<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :operates="operates"
      :add-slot="true"
      :multiple-table="false"
      :batch-deleted-button="false"
      :search-form="'user'"
      :operates-width="280"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
    >
      <template v-slot:addSlot>
        <div>
          <el-button type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
        </div>
      </template>
      <template v-slot:operates="scope">
        <table-operation
          :operations="scope.scope.row.userStatus === 0 ? operations : operations2"
          :raw-data="scope.scope.row"
          @handleOperation="handleOperation"
        />
      </template>
    </basic-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
    <el-dialog :title="'新增'" :visible.sync="dialogFormVisible" top="3%">
      <div class="el-dialog-div">
        <data-form
          :loading="loading"
          :temp="temp"
          @createDataEmit="createDataEmit"
          @dialogFormVisibleEmit="dialogFormVisibleEmit"
        />
      </div>
    </el-dialog>
    <el-dialog :title="'修改密码'" :visible.sync="dialogPasswordVisible" top="3%">
      <div class="el-dialog-div">
        <password-form
          :loading="loading"
          :passwordtemp="passwordtemp"
          @createPassword="createPassword"
          @dialogPasswordVisibleEmit="dialogPasswordVisibleEmit"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DataForm from '@/views/systemManagement/components/dataForm.vue'
import PasswordForm from '@/views/systemManagement/components/passwordForm.vue'
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { getUserList, DisableUser, EnableUser, UpdatePassword, DeleteUsers } from '@/api/user'
import { createUser } from '@/api/system'
import { TipsBox } from '@/utils/feedback.js'
import { getList } from '@/utils'
import { QueryBox } from '@/utils/feedback'
export default {
  name: 'UerStatistics',
  components: { BasicTable, Pagination, TableOperation, DataForm, PasswordForm },
  data() {
    return {
      dialogFormVisible: false,
      dialogPasswordVisible: false,
      // user: {},
      loading: false,
      operates: {
        operate: true,
        label: '操作'
      },
      operations: [
        {
          types: 'password',
          title: '修改密码',
          type: 'primary',
          size: 'mini',
          icon: ['far', 'trash-can']

        },
        {
          types: 'disable',
          title: '禁用',
          type: 'warning',
          size: 'mini',
          icon: ['far', 'trash-can']

        },
        {
          types: 'del',
          title: '删除',
          type: 'danger',
          size: 'mini',
          icon: ['far', 'trash-can']

        }
      ],
      operations2: [
        {
          types: 'password',
          title: '修改密码',
          type: 'primary',
          size: 'mini',
          icon: ['far', 'trash-can']

        },
        {
          types: 'usering',
          title: '启用',
          type: 'success',
          size: 'mini',
          icon: ['far', 'trash-can']

        },
        {
          types: 'del',
          title: '删除',
          type: 'danger',
          size: 'mini',
          icon: ['far', 'trash-can']

        }
      ],
      tableTitle: [
        {
          label: 'ID',
          value: 'id',
          show: true
        },
        {
          label: '用户名',
          value: 'userName',
          show: true
        },
        {
          label: '真实姓名',
          value: 'realName',
          show: true
        },
        {
          label: '角色名',
          value: 'roleName',
          show: true
        },
        {
          label: '创建人',
          value: 'createUserName',
          show: true
        },
        {
          label: '创建时间',
          value: 'createOn',
          show: true
        }
      ],
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      temp: {
        UserName: '',
        RealName: '',
        Pwd: ''
      },
      passwordtemp: {
        newPassword: '',
        userId: ''
      }
    }
  },
  created() {
    // this.user = this.$store.state.user
    this.getPageList()
  },
  methods: {
    dialogFormVisibleEmit(v) {
      this.dialogFormVisible = v
    },
    dialogPasswordVisibleEmit(v) {
      this.dialogPasswordVisible = v
    },
    // sousuo
    searchFormEmit2(v) {
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    // add
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
    },
    resetTemp() {
      this.temp = {
        UserName: '',
        RealName: '',
        Pwd: ''
      }
    },
    resetPasswordtemp() {
      this.passwordtemp = {
        newPassword: '',
        userId: ''
      }
    },
    createDataEmit(v) {
      createUser(v).then((res) => {
        this.loading = true
        if (res.statusCode === 200) {
          this.loading = false
          TipsBox('success', res.data)
          this.dialogFormVisible = false
          this.getPageList()
        }
      })
    },
    createPassword(v) {
      UpdatePassword(v).then((res) => {
        this.loading = true
        if (res.statusCode === 200) {
          this.loading = false
          TipsBox('success', res.data)
          this.dialogPasswordVisible = false
          this.getPageList()
        }
      })
    },
    // 获取表格数据
    getPageList() {
      this.loading = true
      getList(this, getUserList, this.listQuery)
    },
    // 操作列按钮
    handleOperation(op, row) {
      if (op.types === 'usering') {
        QueryBox('是否启用此用户').then(() => {
          const params = `userId=${row.id}`
          EnableUser(params).then((res) => {
            this.loading = true
            if (res.statusCode === 200) {
              this.loading = false
              TipsBox('success', res.data)
              this.getPageList()
            }
          })
        })
          .catch(err => { console.error(err) })
      } else if (op.types === 'disable') {
        QueryBox('是否禁用此用户').then(() => {
          const params = `userId=${row.id}`
          DisableUser(params).then((res) => {
            this.loading = true
            if (res.statusCode === 200) {
              this.loading = false
              TipsBox('success', res.data)
              this.getPageList()
            }
          })
        })
          .catch(err => { console.error(err) })
      } else if (op.types === 'password') {
        this.dialogPasswordVisible = true
        this.resetPasswordtemp()
        this.passwordtemp.userId = row.id
      } else if (op.types === 'del') {
        QueryBox().then(() => {
          const params = `userIds=${row.id}`
          this.del(params)
        })
          .catch(err => { console.error(err) })
      }
    },
    del(p) {
      DeleteUsers(p).then(response => {
        if (response.statusCode === 200) {
          TipsBox('success', response.data)
          this.getPageList()
        }
      })
    }
  }
}
</script>
