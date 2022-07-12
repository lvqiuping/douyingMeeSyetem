import { Message, MessageBox } from 'element-ui'

// 提示框
const TipsBox = (type, message) => {
  Message({
    type: type,
    message: message
  })
}
// 操作询问框
const QueryBox = (title, message, type, result) => {
  MessageBox({
    title: title,
    message: message,
    type: type,
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '确定'
        setTimeout(() => {
          done()
          setTimeout(() => {
            instance.confirmButtonLoading = false
          }, 300)
        }, 3000)
      } else {
        done()
      }
    }
  }).then(() => {
    Message({
      type: 'success',
      message: result
    })
  })
}
// 内容框
// const ContextBox = () => {
//   ElNotification({
//     title: '温馨提示',
//     message: h(
//       'div',
//       {
//         style: 'padding: 2px;'
//       },
//       [
//         h(
//           'div',
//           {
//             style: 'color: #E6A23C'
//           },
//           '1、只允许拨打本公司业务电话，不允许拨打其他行业电话。'
//         ),
//         h(
//           'div',
//           {
//             style: 'color: #E6A23C'
//           },
//           '2、拨号当中不允许出现：金融、地产相关高频行业。'
//         ),
//         h(
//           'div',
//           {
//             style: 'color: #E6A23C'
//           },
//           '3、通话中不允许出现：代开发票、造假等违法字眼。'
//         ),
//         h(
//           'div',
//           {
//             style: 'color: #E6A23C'
//           },
//           '4、不允许在通话中辱骂。'
//         )
//       ]
//     ),
//     type: 'info',
//     duration: 0
//   })
// }

// 其他方法
export { TipsBox, QueryBox }
