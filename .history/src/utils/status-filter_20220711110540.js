const statusMap = {
  published: 'success',
  draft: 'info',
  deleted: 'danger'
}
const statusFilter = (status) => {
  return statusMap[status]
}
export { statusFilter }
