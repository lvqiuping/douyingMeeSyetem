const statusMap = {
  published: 'success',
  draft: 'info',
  deleted: 'danger'
}
const statusFilter = (s) => {
  return statusMap[s]
}
export { statusFilter }
