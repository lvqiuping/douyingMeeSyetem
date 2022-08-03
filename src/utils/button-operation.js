// import { TipsBox, QueryBox } from '@/utils/feedback.js'
// import { unique, getFormData } from '@/utils/others.js'

// /**
//  * 表单数据收集
//  */
// export function getFormData(params, idsName) {
//   let p = []
//   if (typeof params === 'string') {
//     p.push(params)
//   } else {
//     p = params
//   }
//   const form = new FormData()
//   for (let i = 0; i < p.length; i++) {
//     form.append(idsName, p[i])
//   }

//   return form
// }

// export function batchDeleted(v) {
//   console.log(v)
//   if (!v.length) {
//     TipsBox('warning', '请选择需要删除的数据')
//     return false
//   }
//   QueryBox().then(() => {
//     var parmas = unique(v) // 去重
//     const form = getFormData(parmas, 'videoIds[]')
//     this.del(form)
//   })
// }

// export function del(p) {
//   DeleteVideos(p).then(response => {
//     if (response.statusCode === 200) {
//       TipsBox('success', response.data)
//       this.getPageList(this.taskId)
//     }
//   })
// }
