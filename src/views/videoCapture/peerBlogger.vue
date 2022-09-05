<template>
  <div class="app-container">
    <analysis-template :task-type="1" :task-type-comment="1000" />
  </div>
</template>
<script>
import AnalysisTemplate from '@/views/videoCapture/components/analysisTemplate.vue'

export default {
  name: 'KeywordAnalysis',
  components: { AnalysisTemplate },
  // eslint-disable-next-line vue/require-prop-types
  props: ['createby'],
  setup(props) {
    console.log(props)
  }
}
</script>

