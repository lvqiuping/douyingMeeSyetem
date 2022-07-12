const StatusFilter = (s) => {
  const statusMap = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[s]
}
export { StatusFilter }
