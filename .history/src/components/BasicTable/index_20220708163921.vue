<template>
  <el-row>
    <el-col>
      <div style="display: flex;flex-direction: row;justify-content: space-between; margin-bottom: 20px;">
        <div>
          <el-button type="danger" icon="el-icon-delete">批量删除</el-button>
          <slot v-if="addSlot" name="addSlot" />
        </div>
        <div>
          <!-- <el-tooltip class="item" effect="dark" content="刷新" placement="top"> -->
          <el-button type="" icon="el-icon-refresh" style="margin-right: 10px;" />
          <!-- </el-tooltip> -->
          <el-popover
            placement="bottom"
            width="90"
            trigger="click"
          >
            <el-button slot="reference" type="" icon="el-icon-menu" />
            <div v-for="item in tableTitle" :key="item">
              <el-checkbox v-model="item.show" :label="item.label" size="large" />
            </div>
          </el-popover>

        </div>
      </div>
      <el-table
        v-if="showTable"
        ref="multipleTableRef"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        row-key="id"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="multipleTable === true" type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in tableTitle.filter(item2 => item2.show)"
          :key="index"
          :prop="item.value"
          :label="item.label"
          :sortable="item.sortable === true"
          align="center"
        />
        <el-table-column
          v-if="status"
          :label="status.label"
          :width="statusWidth"
          align="center"
        >
          <template v-slot="scope">
            <slot name="status" :scope="scope" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="operates"
          :label="operates.label"
          fixed="right"
          :width="operatesWidth"
          align="center"
        >
          <template v-slot="scope">
            <slot name="operates" :scope="scope" />
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'BasicTable',
  components: {

  },
  props: {
    // 基本
    tableTitle: { type: Array, default: Array },
    tableData: { type: Array, default: Array },
    operates: { type: Object, default: Object },
    operatesWidth: { type: Number, default: 160 },
    statusWidth: { type: Number, default: 100 },
    multipleTable: { type: Boolean, default: true },
    pagination: { type: Boolean, default: true },
    where: { type: Object, default: Object },
    showTable: { type: Boolean, default: true },
    status: { type: Object, default: Object },
    // 特别操作
    addSlot: { type: Boolean, default: false }
  },
  data() {
    return {
      selectDate: [],
      selectTableData: [],
      total: 0,
      loading: false

    }
  },
  watch: {
    // 需要每个页面传参数是因为搜索的时候，除了页码和每页数还有搜索字段要接收。
    where(newValue, oldValue) {
      this.getTableData()
    }
  },
  created() {
  },
  methods: {
    handleSelectionChange(val) {
      this.selectDate = val
      // $context.emit('selectDate', selectDate.value)
    }
  }
}
</script>

<style scoped>

</style>
