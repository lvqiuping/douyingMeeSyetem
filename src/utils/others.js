// 去重
const unique = (arr) => {
  const newArr = []
  arr.forEach((item) => {
    if (newArr.indexOf(item.id) === -1) {
      newArr.push(item.id)
    }
  })
  return newArr
}

export { unique }

/**
 * 表单数据收集
 */
export function getFormData(params, idsName) {
  let p = []
  if (typeof params === 'string') {
    p.push(params)
  } else {
    p = params
  }
  const form = new FormData()
  for (let i = 0; i < p.length; i++) {
    form.append(idsName, p[i])
  }

  return form
}
