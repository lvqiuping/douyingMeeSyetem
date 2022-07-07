<template>
  <el-row>
    <el-col>

      <el-button
        v-for="(op,index) in operations"
        :key="index"
        :type="op.type"
        size="small"
        plain
        @click="clickOperation(op)"
      >
        <font-awesome-icon :icon="op.icon" />
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'TableOperation',
  props: {
    operations: { type: Object, default: Object },
    rawData: { type: Array, default: Array }
  },
  methods: {
    clickOperation(operation) {
      this.$emit('handleOperation', operation, this.rawData)
    }
  }
}
</script>

<style scoped>

</style>
