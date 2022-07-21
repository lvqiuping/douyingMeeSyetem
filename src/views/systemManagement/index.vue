<template>
  <div class="app-container">
    <data-form @createDataEmit="createDataEmit" />
  </div>
</template>
<script>
import DataForm from '@/views/systemManagement/components/dataForm.vue'
import { createUser } from '@/api/system'
import { TipsBox } from '@/utils/feedback.js'
export default {
  name: 'SystemManagement',
  components: { DataForm },
  data() {
    return {

    }
  },
  methods: {
    createDataEmit(v) {
      console.log('添加参数', v)
      createUser(v).then((res) => {
        this.loading = true
        if (res.statusCode === 200) {
          this.loading = false
          TipsBox('success', res.data)
        }
      })
    }
  }
}
</script>

