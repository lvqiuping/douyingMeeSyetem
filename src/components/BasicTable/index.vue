<template>
  <div>
    <div style="display: flex;flex-direction: row;justify-content: space-between; margin-bottom: 20px;height: 40px;">
      <div>
        <div v-if="leftButton" style="display: flex;flex-direction: row;justify-content: space-between;">
          <search-form
            v-if="searching"
            :search-form="searchForm"
            @searchFormEmit="searchFormEmit"
          />
          <slot v-if="addSlot" name="addSlot" />
          <el-button v-if="batchDeletedButton" type="danger" icon="el-icon-delete" style="margin-left: 10px;" @click="batchDeleted">批量删除</el-button>
        </div>
      </div>
      <div style="display: flex;flex-direction: row;justify-content: space-between;">
        <el-button type="" icon="el-icon-refresh" style="margin-right: 10px; margin-left: 10px;" @click="refresh" />
        <el-popover
          placement="bottom"
          width="90"
          trigger="click"
        >
          <el-button slot="reference" type="" icon="el-icon-menu" />
          <div v-for="(item, index) in tableTitle" :key="index">
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
      border
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
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
        v-if="createBy&&this.$store.state.user.isAdmin"
        :label="createBy.label"
        align="center"
      >
        <template v-slot="scope">
          <slot name="createBy" :scope="scope" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="typeOne"
        :label="typeOne.label"
        prop="type0TaskCount"
        sortable="custom"
        align="center"
      >
        <template v-slot="scope">
          <slot name="typeOne" :scope="scope" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="typeTwo"
        :label="typeTwo.label"
        prop="type1TaskCount"
        sortable="custom"
        align="center"
      >
        <template v-slot="scope">
          <slot name="typeTwo" :scope="scope" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="typeThree"
        :label="typeThree.label"
        prop="type2TaskCount"
        sortable="custom"
        align="center"
      >
        <template v-slot="scope">
          <slot name="typeThree" :scope="scope" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="videoCount"
        :label="videoCount.label"
        align="center"
      >
        <template v-slot="scope">
          <slot name="videoCount" :scope="scope" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="commentCount"
        :label="commentCount.label"
        align="center"
      >
        <template v-slot="scope">
          <slot name="commentCount" :scope="scope" />
        </template>
      </el-table-column>
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
        v-if="refreshStatus"
        :label="refreshStatus.label"
        align="center"
      >
        <template v-slot="scope">
          <slot name="refreshStatus" :scope="scope" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="playUrl"
        :label="playUrl.label"
        :width="playUrl.width"
        align="center"
      >
        <template v-slot="scope">
          <slot name="playUrl" :scope="scope" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="homePageUrl"
        :label="homePageUrl.label"
        :width="homePageUrl.width"
        align="center"
      >
        <template v-slot="scope">
          <slot name="homePageUrl" :scope="scope" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="userHomeUrl"
        :label="userHomeUrl.label"
        :width="userHomeUrl.width"
        align="center"
      >
        <template v-slot="scope">
          <slot name="userHomeUrl" :scope="scope" />
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
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm/index.vue'
export default {
  name: 'BasicTable',
  components: { SearchForm },
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
    status: { type: Object, default: null },
    searchForm: { type: String, default: null },
    loading: { type: Boolean, default: false },
    leftButton: { type: Boolean, default: true },
    searching: { type: Boolean, default: true },
    batchDeletedButton: { type: Boolean, default: true },
    // 特别操作
    addSlot: { type: Boolean, default: false },
    playUrl: { type: Object, default: null },
    homePageUrl: { type: Object, default: null },
    userHomeUrl: { type: Object, default: null },
    commentCount: { type: Object, default: null },
    videoCount: { type: Object, default: null },
    createBy: { type: Object, default: null },
    refreshStatus: { type: Object, default: null },
    typeOne: { type: Object, default: null },
    typeTwo: { type: Object, default: null },
    typeThree: { type: Object, default: null }
  },
  data() {
    return {
      selectDate: [],
      selectTableData: [],
      total: 0,
      b_data: {},
      temp: {
        orderBy: ''
      }
    }
  },
  methods: {
    sortChange({ column, prop, order }) {
      if (order === 'ascending') {
        this.temp.orderBy = prop
      } else if (order === 'descending') {
        this.temp.orderBy = prop + ' desc'
      }
      this.$emit('sortChange', this.temp)
    },
    searchFormEmit(v) {
      this.b_data = v
      this.$emit('searchFormEmit2', this.b_data)
    },
    handleSelectionChange(val) {
      this.selectDate = val
    },
    batchDeleted() {
      this.$emit('batchDeleted', this.selectDate)
    },
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped>

</style>
