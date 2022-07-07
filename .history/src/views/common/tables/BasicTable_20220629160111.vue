<template>
  <el-row>
    <el-col>
      <!-- <div class="m-2 text-right border-b pb-2 flex flex-row justify-between">
                <div>
                    <slot name="openAccountSlot" v-if="openAccountSlot"></slot>
                    <slot name="releaseNews" v-if="releaseNewsSlot"></slot>
                    <slot name="customerSlot" v-if="customerSlot"></slot>
                    <slot name="payingSlot" v-if="payingSlot"></slot>
                    <slot name="addNumberSlot" v-if="addNumberSlot"></slot>
                </div>
                <div v-if="buttonGroups">
                    <div class="flex flex-column justify-center items-center mx-4">
                        <slot name="batchImport" v-if="batchImportSlot === true"></slot>
                        <el-button @click="selectExportExcel(selectDate,tableTitle,exportName)">选择导出
                        </el-button>
                        <el-button @click="allExportExcel(tableData,tableTitle,exportName)">全部导出</el-button>
                        <el-popover placement="bottom" :width="150" popper-class="h-60 overflow-y-scroll" trigger="click">
                            <template #reference>
                                <el-button style="margin-right: 16px">筛选列</el-button>
                            </template>
                            <el-checkbox v-for="item in tableTitle" v-model="item.show" :label="item.label" size="large"/>
                        </el-popover>
                        <el-button plain class="mr-2">
                            <el-icon>
                                <refresh/>
                            </el-icon>
                        </el-button>
                    </div>
                </div>
            </div> -->

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
        >
          <!-- <template v-slot="scope" v-if="item.value === 'axb_number'">
                        <slot name="specialNumber" :scope="scope"></slot>
                    </template>
                    <template v-slot="scope" v-if="item.value === 'username'">
                        <slot name="specialUsername" :scope="scope"></slot>
                    </template>
                    <template v-slot="scope" v-if="item.value === 'user_id'">
                        <slot name="specialUser" :scope="scope"></slot>
                    </template> -->
        </el-table-column>
        <!-- <el-table-column
                    :label="isTest.label"
                    v-if="isTest"
                    prop="is_test"
                    :filters="[{ text: '是', value: '0' },{ text: '否', value: '1' }]"
                    :filter-method="filterIsTest"
                    filter-placement="bottom-end"
                    column-key="isTest"
                >
                    <template v-slot="scope">
                        <slot name="is_test" :scope="scope"></slot>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="status.label"
                    v-if="status"
                    prop="status"
                    :filters="[{ text: '禁用', value: false },{ text: '正常', value: true }]"
                    :filter-method="filterStatus"
                    filter-placement="bottom-end"
                    column-key="status"
                >
                    <template v-slot="scope">
                        <slot name="status" :scope="scope"></slot>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="payType.label"
                    v-if="payType"
                    prop="payType"
                    :filters="[{ text: '微信', value: '1' },{ text: '支付宝', value: '2' },{ text: '手动充值', value: '3' }]"
                    :filter-method="filterPayType"
                    filter-placement="bottom-end"
                    column-key="payType"
                >
                    <template v-slot="scope">
                        <slot name="payType" :scope="scope"></slot>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="payStatus.label"
                    v-if="payStatus"
                    prop="payStatus"
                    :filters="[{ text: '已付款', value: '1' },{ text: '未付款', value: '2' },{ text: '已关闭', value: '3' }]"
                    :filter-method="filterPayStatus"
                    filter-placement="bottom-end"
                    column-key="payStatus"
                >
                    <template v-slot="scope">
                        <slot name="payStatus" :scope="scope"></slot>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="testNumbers.label"
                    v-if="testNumbers"
                    prop="testNumbers"
                    :filters="[{ text: '是', value: '0' },{ text: '否', value: '1' }]"
                    :filter-method="filterTestNumbers"
                    filter-placement="bottom-end"
                    column-key="testNumbers"
                >
                    <template v-slot="scope">
                        <slot name="testNumbers" :scope="scope"></slot>
                    </template>
                </el-table-column> -->
        <!-- <el-table-column v-if="operates" :label="operates.label" fixed="right" :width="operatesWidth">
          <template v-slot="scope">
            <slot name="operates" :scope="scope" />
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <div v-if="pagination" class="table-bottom m-4">
        <v-pagination
          :page-size="params.limit"
          :total="total"
          :options="params"
          :render="getTableData"
        />
      </div> -->
    </el-col>
  </el-row>
</template>

<script>
import vPagination from '@/components/Pagination'
export default {
  name: 'BasicTable',
  components: {
    vPagination
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
    showSummary: { type: Boolean, default: false }
    // 特别操作
  },
  data() {
    return {
      selectDate: [],
      selectTableData: [],
      total: 0,
      loading: false,
      tableData: [],
      params: {
        page: 1,
        limit: 15
      }
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
