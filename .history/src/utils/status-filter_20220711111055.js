const statusMap = {
  published: 'success',
  draft: 'info',
  deleted: 'danger'
}
const statusFilter = (s) => {
  statusMap[s]
}
export { statusFilter }
