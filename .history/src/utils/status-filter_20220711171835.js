// 状态展示
const StatusFilter = (status) => {
  const statusMap = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}
// 去重
const unique = (arr) => {
  const newArr = []
  arr.forEach((item) => {
    if (newArr.indexOf(item.id) === -1) {
      newArr.push(item.id)
    }
    return newArr
  })
}

export { StatusFilter, unique }
