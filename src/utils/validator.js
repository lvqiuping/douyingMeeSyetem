// import { validUsername } from '@/utils/validate'
const validateUsername = (rule, value, callback) => {
  // if (!validUsername(value)) {
  //   callback(new Error('请输入正确的用户名'))
  // } else {
  //   callback()
  // }
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

export {
  validateUsername,
  validatePassword,
  validateTaskName,
  validateTaskType
}
