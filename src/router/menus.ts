const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '首页',
      icon: 'menu',
      showMenu: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: '关于',
      icon: 'about',
      showInbreadcrumb: true,
      showMenu: false
    }
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      title: '用户中心',
      icon: 'location',
      showMenu: true,
      keepAlive: true
    },
    children: [
      {
        path: '/user/list',
        name: 'userList',
        component: () => import('@/views/user/List.vue'),
        meta: {
          title: '用户列表',
          icon: 'User',
          showMenu: true,
          keepAlive: true
        }
      },
      {
        path: '/user/job',
        name: 'userJob',
        component: () => import('@/views/user/Job.vue'),
        meta: {
          title: '岗位中心',
          icon: 'Postcard',
          showMenu: true,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/book',
    name: 'book',
    meta: {
      title: '图书管理',
      icon: 'Reading',
      showMenu: true,
      keepAlive: true
    },
    children: [
      {
        path: '/book/list',
        name: 'bookList',
        component: () => import('@/views/book/List.vue'),
        meta: {
          title: '图书列表',
          icon: 'List',
          showMenu: true,
          keepAlive: true
        }
      },
      {
        path: '/book/category',
        name: 'bookCategory',
        component: () => import('@/views/book/Category.vue'),
        meta: {
          title: '图书分类',
          icon: 'Collection',
          showMenu: true,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/vendor',
    name: 'Vendor',
    component: () => import('@/views/vendor.vue'),
    meta: {
      title: '供应商管理',
      icon: 'CirclePlus',
      showMenu: true,
      keepAlive: true
    }
  },
  {
    // 业务
    path: '/business',
    name: 'business',
    meta: {
      title: '业务管理',
      icon: 'Edit',
      showMenu: true,
      keepAlive: true
    },
    children: [
      {
        path: '/business/sale',
        name: 'Sale',
        component: () => import('@/views/business/sale.vue'),
        meta: {
          title: '销售记录',
          icon: 'ShoppingCart',
          showMenu: true,
          keepAlive: true
        }
      },
      {
        path: '/business/purchase',
        name: 'Purchase',
        component: () => import('@/views/business/purchase.vue'),
        meta: {
          title: '进货管理',
          icon: 'Box',
          showMenu: true,
          keepAlive: true
        }
      },
      {
        path: '/business/dailyCounting',
        name: 'dailyCounting',
        component: () => import('@/views/business/dailyCounting.vue'),
        meta: {
          title: '日清',
          icon: 'Sunny',
          showMenu: true,
          keepAlive: true
        }
      },
      {
        path: '/business/monthlyCounting',
        name: 'monthlyCounting',
        component: () => import('@/views/business/monthlyCounting.vue'),
        meta: {
          title: '月结',
          icon: 'Moon',
          showMenu: true,
          keepAlive: true
        }
      }
    ]
  }, 
  {
    path: '/admin',
    name: 'admin',
    meta: {
      title: '管理员',
      icon: 'Avatar',
      showMenu: true
    },
    children: [
      {
        path: '/admin/list',
        name: 'adminList',
        component: () => import('@/views/admin/List.vue'),
        meta: {
          title: '管理员列表',
          showMenu: true
        }
      }
    ]
  },
  {
    path: '/sys',
    name: 'sys',
    component: () => import('@/views/Sys.vue'),
    meta: {
      title: '系统设置',
      icon: 'setting',
      showMenu: true
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404.vue')
  }
]

export default routes
