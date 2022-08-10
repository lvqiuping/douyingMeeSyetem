<template>
  <div class="qrBox">
    <div id="qrCodeId" ref="qrCodeRef" />
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'QrCode',
  props: {
    qrCodeId: {
      type: String,
      default: 'qrCodeId'
    },
    link: {
      type: String,
      default: ''
    }
  },
  watch: {
    link(newVal, oldVal) {
      this.showQR(newVal)
    }
  },
  mounted() {
    this.showQR()
  },
  methods: {
    showQR() {
      this.$refs.qrCodeRef.innerHTML = ''
      new QRCode(this.$refs.qrCodeRef, {
        width: 200, // 二维码宽度，单位像素
        height: 200, // 二维码高度，单位像素
        text: this.link // 生成二维码的链接
      })
    }
  }
}
</script>
<style scoped>
.qrBox{
  width: 200px;
  height: 200px;
  margin: auto;
}
</style>
