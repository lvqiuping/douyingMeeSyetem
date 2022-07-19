const StatusFilter = (status) => {
  const statusMap = {
    0: 'success',
    1: 'info',
    2: 'danger'
  }
  return statusMap[status]
}

export { StatusFilter }
