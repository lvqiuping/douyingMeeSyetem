const StatusFilter = (status) => {
  const statusMap = {
    0: 'primary',
    1: 'danger',
    2: 'warning',
    3: 'success'
  }
  return statusMap[status]
}

export { StatusFilter }
