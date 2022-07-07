<template>
  <el-row>
    <el-col>
      <el-button
        v-for="(op,index) in operations"
        :key="index"
        :type="op.type"
        :size="op.size"
        plain
        @click="clickOperation(op)"
      >
        {{ op.title }}
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'TableOperation',
  props: {
    operations: { type: Array, default: Array },
    rawData: { type: Object, default: Object }
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
