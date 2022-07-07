<template>
  <el-row>
    <el-col>
      <div style="display: flex; flex-de">
        <div>
          <slot v-if="addSlot" name="addSlot" />
        </div>
        <div>
          <el-popover
            placement="bottom"
            width="90"
            trigger="click"
          >
            <el-button slot="reference">筛选列</el-button>
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
        :sum-text="'合计'"
        :show-summary="showSummary"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="selectionType === true" type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in tableTitle.filter(item2 => item2.show)"
          :key="index"
          :prop="item.value"
          :label="item.label"
          :sortable="item.sortable === true"
        />
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
    selectionType: { type: Boolean, default: true },
    pagination: { type: Boolean, default: true },
    where: { type: Object, default: Object },
    buttonGroups: { type: Boolean, default: true },
    operatesWidth: { type: Number, default: 120 },
    showTable: { type: Boolean, default: true },
    showSummary: { type: Boolean, default: false },
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
