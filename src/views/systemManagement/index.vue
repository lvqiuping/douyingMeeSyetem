<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :add-slot="true"
      :multiple-table="false"
      :batch-deleted-button="false"
      :search-form="'user'"
      @refresh="getPageList"
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
  </div>
</template>
<script>
import DataForm from '@/views/systemManagement/components/dataForm.vue'
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import TableOperation from '@/components/BasicTable/TableOperation.vue'
import { getUserList, DisableUser, EnableUser } from '@/api/user'
import { createUser } from '@/api/system'
import { TipsBox } from '@/utils/feedback.js'
import { getList } from '@/utils'
import { QueryBox } from '@/utils/feedback'
export default {
  name: 'SystemUser',
  components: { BasicTable, Pagination, TableOperation, DataForm },
  data() {
    return {
      dialogFormVisible: false,
      user: {},
      loading: false,
      operates: {
        operate: true,
        label: '操作'
      },
      operations: [
        {
          types: 'del',
          title: '禁用',
          type: 'danger',
          size: 'mini',
          icon: ['far', 'trash-can']

        }
      ],
      operations2: [
        {
          types: 'usering',
          title: '启用',
          type: 'success',
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
          label: '用户名',
          value: 'userName',
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
        pageSize: 10,
        taskId: ''
      },
      temp: {
        UserName: '',
        RealName: '',
        Pwd: ''
      }
    }
  },
  created() {
    this.user = this.$store.state.user
    this.getPageList()
    // this.user.userName
  },
  methods: {
    dialogFormVisibleEmit(v) {
      this.dialogFormVisible = v
    },
    // sousuo
    searchFormEmit2(v) {
      this.listQuery.pageIndex = 1
      this.getPageList(v)
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
    // 获取表格数据
    getPageList(userName) {
      this.loading = true
      const params = { 'pageIndex': this.listQuery.pageIndex, 'pageSize': this.listQuery.pageSize, 'userName': userName }
      getList(this, getUserList, params)
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
      } else if (op.types === 'del') {
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
      }
    }
  }
}
</script>
