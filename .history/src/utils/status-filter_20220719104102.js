const StatusFilter = (status) => {
  const statusMap = {
    0: 'info',
    1: 'info',
    2: 'danger'
  }
  return statusMap[status]
}

export { StatusFilter }
