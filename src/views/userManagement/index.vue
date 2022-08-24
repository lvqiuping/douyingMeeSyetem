<template>
  <div class="app-container">
    <password-form
      :loading="loading"
      :passwordtemp="passwordtemp"
      @createPassword="createPassword"
    />
  </div>
</template>
<script>
import PasswordForm from '@/views/userManagement/components/passwordForm.vue'
import { UpdatePassword } from '@/api/user'
import { TipsBox } from '@/utils/feedback.js'
export default {
  name: 'ChangePwd',
  components: { PasswordForm },
  data() {
    return {
      loading: false,
      passwordtemp: {
        newPassword: '',
        userId: this.$store.state.user.userId
      }
    }
  },
  created() {
    this.resetPasswordtemp()
  },
  methods: {
    resetPasswordtemp() {
      this.passwordtemp = {
        newPassword: '',
        userId: this.$store.state.user.userId
      }
    },
    createPassword(v) {
      console.log(v)
      UpdatePassword(v).then((res) => {
        console.log(res)
        this.loading = true
        if (res.statusCode === 200) {
          this.loading = false
          TipsBox('success', res.data)
          this.resetPasswordtemp()
        }
      })
    }
  }
}
</script>
