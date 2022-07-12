const statusFilter = (s) => {
  const statusMap = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  statusMap[s]
}
export { statusFilter }
