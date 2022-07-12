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
