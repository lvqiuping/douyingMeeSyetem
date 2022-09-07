const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}

const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('请输入6位数的密码'))
  } else {
    callback()
  }
}

const validateTaskName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入任务名'))
  } else {
    callback()
  }
}

const validateTaskType = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请选择类型'))
  } else {
    callback()
  }
}

const validateTaskSource = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入正确的分析源'))
  } else {
    callback()
  }
}

const TaskTitle = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入标题'))
  } else {
    callback()
  }
}

const validateCommentKeyWords = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error('请选择或者自定义一个筛选关键词'))
  } else {
    callback()
  }
}
export {
  validateUsername,
  validatePassword,
  validateTaskName,
  validateTaskType,
  validateTaskSource,
  TaskTitle,
  validateCommentKeyWords
}
