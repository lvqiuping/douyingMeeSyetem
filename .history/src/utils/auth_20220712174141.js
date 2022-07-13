import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken(name) {
  if (!name) {
    name = TokenKey
  }

  return Cookies.get(name)
}

export function setToken(name, value) {
  if (!name) {
    name = TokenKey
  }
  
  return Cookies.set(name, value)
}

export function removeToken(name) {
  if (!name) {
    name = TokenKey
  }
  return Cookies.remove(name)
}
