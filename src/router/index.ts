import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/Index.vue'
import nprogress from '@/utils/nprogress'
import menus from './menus'
import { ElMessage } from 'element-plus'
import tokenStore from '@/stores/token'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: menus,
      meta: {
        KeepAlive: true
      }
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404',
      meta: {
        showInbreadcrumb: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  nprogress.start()

  if (to.path == '/login') {
    next()
  } else {
    const token = tokenStore.value
    // token 不存在
    if (!token){
      ElMessage.error('您还没有登录，请先登录')
      next('/login')
    }
  }
  next()
})

router.afterEach(() => {
  nprogress.done()
})

export default router
