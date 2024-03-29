import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getRefreshToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
/* Layout */
import Layout from '@/layout'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
let isAddRouter = false
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  const hasRefreshToken = getRefreshToken()

  if (hasToken && hasRefreshToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.userName
      if (hasGetUserInfo) {
        if (store.state.user.isAdmin) {
          if (!isAddRouter) {
            isAddRouter = true
            router.addRoutes([
              {
                path: '/systemManagement',
                component: Layout,
                redirect: '/systemManagement/index',
                alwaysShow: true,
                name: '系统管理',
                meta: {
                  title: '系统管理',
                  icon: 'el-icon-s-tools'
                },
                children: [
                  {
                    path: 'index',
                    name: '系统用户',
                    component: () => import('@/views/systemManagement/index'),
                    meta: { title: '系统用户', icon: 'el-icon-user' }
                  }
                ]
              },
              {
                path: '/userStatistics',
                component: Layout,
                redirect: '/userStatistics/index',
                alwaysShow: true,
                name: '用户统计',
                meta: {
                  title: '用户统计',
                  icon: 'el-icon-s-tools'
                },
                children: [
                  {
                    path: 'index',
                    name: '用户统计',
                    component: () => import('@/views/userStatistics/index'),
                    meta: { title: '用户统计', icon: 'el-icon-user' }
                  }
                ]
              }
            ])

            router.options.routes.push({
              path: '/systemManagement',
              component: Layout,
              redirect: '/systemManagement/index',
              alwaysShow: true,
              name: '系统管理',
              meta: {
                title: '系统管理',
                icon: 'el-icon-s-tools'
              },
              children: [
                {
                  path: 'index',
                  name: '系统用户',
                  component: () => import('@/views/systemManagement/index'),
                  meta: { title: '系统用户', icon: 'el-icon-user' }
                }
              ]
            },
            {
              path: '/userStatistics',
              component: Layout,
              redirect: '/userStatistics/index',
              alwaysShow: true,
              name: '用户统计',
              meta: {
                title: '用户统计',
                icon: 'el-icon-s-data'
              },
              children: [
                {
                  path: 'index',
                  name: '用户统计',
                  component: () => import('@/views/userStatistics/index'),
                  meta: { title: '用户统计', icon: 'el-icon-data-analysis' }
                }
              ]
            }
            )
          }
        }
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          console.log('error', error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
