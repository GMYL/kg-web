import Main from "@/views/Main.vue";

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: "/login",
  name: "login",
  meta: {
    title: "Login - 登录"
  },
  component: () => import("@/views/login.vue")
};

export const page404 = {
  path: "/*",
  name: "error-404",
  meta: {
    title: "404-页面不存在"
  },
  component: () => import("@/views/error-page/404.vue")
};

export const page403 = {
  path: "/403",
  meta: {
    title: "403-权限不足"
  },
  name: "error-403",
  component: () => import("@//views/error-page/403.vue")
};

export const page500 = {
  path: "/500",
  meta: {
    title: "500-服务端错误"
  },
  name: "error-500",
  component: () => import("@/views/error-page/500.vue")
};

export const locking = {
  path: "/locking",
  name: "locking",
  component: resolve => {
    require([
      "@/views/main-components/lockscreen/components/locking-page.vue"
    ], resolve);
  }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: "/",
  name: "otherRouter",
  redirect: "/home",
  component: Main,
  children: [
    {
      path: "home",
      title: "home",
      name: "my_home_index",
      component: resolve => {
        require(["@/views/home/home.vue"], resolve);
      }
    },
    {
      path: "ownspace",
      title: "个人中心",
      name: "ownspace_index",
      component: () => import("@/views/own-space/own-space.vue")
    },
    {
      path: "message",
      title: "消息中心",
      name: "message_index",
      component: resolve => {
        require(["@/views/message/list"], resolve);
      }
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: "/backend",
    icon: "ios-home",
    name: 'backend',
    title: "首页",
    component: Main,
    children: [
      {
        path: "/",
        icon: "ios-home",
        title: "系统首页",
        name: "home_index",
        component: resolve => {
          require(["@/views/home/home"], resolve);
        }
      }
    ]
  },
  {
    path: "/show",
    icon: "ios-home",
    name: 'show',
    title: "图谱展示",
    component: Main,
    children: [
      {
        path: "list",
        icon: "ios-home",
        title: "图谱展示",
        name: "show_list",
        component: resolve => {
          require(["@/views/show/list"], resolve);
        }
      }
    ]
  },
  {
    path: "/wizard",
    icon: "ios-flame",
    name: "wizard",
    title: "知识图谱",
    component: Main,
    children: [
      {
        //   path: 'list',
        //   icon: 'android-menu',
        //   title: '列表展示',
        //   name: 'wizard_list',
        //   component: resolve => {
        //     require(['@/views/wizard/list'], resolve);
        //   }
        // }, {
        path: "graph",
        icon: "ios-color-filter",
        title: "知识图谱",
        name: "wizard_graph",
        component: resolve => {
          require(["@/views/wizard/graph"], resolve);
        }
      },
      // {
      //   path: "groot",
      //   icon: "ios-color-filter",
      //   title: "新版知识图谱",
      //   name: "wizard_groot",
      //   component: resolve => {
      //     require(["@/views/wizard/groot"], resolve);
      //   }
      // }
    ]
  },
  {
    path: "/auth",
    icon: "person-stalker",
    name: "auth",
    title: "权限管理",
    component: Main,
    children: [
      {
        path: "role",
        icon: "ios-locked-outline",
        title: "角色管理",
        name: "auth_role",
        component: resolve => {
          require(["@/views/auth/role"], resolve);
        }
      },
      {
        path: "group",
        icon: "ios-people",
        title: "用户组管理",
        name: "auth_group",
        component: resolve => {
          require(["@/views/auth/group"], resolve);
        }
      },
      {
        path: "module",
        icon: "cube",
        title: "系统模块管理",
        name: "auth_module",
        component: resolve => {
          require(["@/views/auth/module"], resolve);
        }
      },
      {
        path: "category",
        icon: "ios-keypad",
        title: "分类管理",
        name: "auth_category",
        component: resolve => {
          require(["@/views/auth/category"], resolve);
        }
      }
    ]
  },
  {
    path: "/user",
    icon: "person-stalker",
    name: "user",
    title: "用户管理",
    component: Main,
    children: [
      {
        path: "list",
        icon: "android-person",
        title: "所有用户",
        name: "user_list",
        component: resolve => {
          require(["@/views/user/list"], resolve);
        }
      },
      {
        path: "register",
        icon: "android-person",
        title: "注册用户",
        name: "user_register",
        component: resolve => {
          require(["@/views/user/register"], resolve);
        }
      },
      {
        path: "admin",
        icon: "android-person",
        title: "内部员工列表",
        name: "user_admin",
        component: resolve => {
          require(["@/views/user/admin"], resolve);
        }
      }
    ]
  },
  {
    path: "/robot",
    icon: "social-octocat",
    name: "robot",
    title: "字典管理",
    component: Main,
    children: [
      // {
      //   path: "status",
      //   icon: "ios-analytics-outline",
      //   title: "运行状态",
      //   name: "robot_status",
      //   component: resolve => {
      //     require(["@/views/robot/status"], resolve);
      //   }
      // },
      // {
      //   path: 'rank',
      //   icon: 'ios-pie-outline',
      //   title: '词出现次数排序',
      //   name: 'robot_rank',
      //   component: resolve => {
      //     require(['@/views/robot/rank'], resolve);
      //   }
      // },
      {
        path: "dict",
        icon: "ios-keypad",
        title: "扩展词典",
        name: "robot_dict",
        component: resolve => {
          require(["@/views/robot/dict"], resolve);
        }
      },
      {
        path: "stopdict",
        icon: "ios-keypad",
        title: "停用词典",
        name: "robot_stopdict",
        component: resolve => {
          require(["@/views/robot/stopdict"], resolve);
        }
      },
      // {
      //   path: "dictUpload",
      //   icon: "android-upload",
      //   title: "扩展词典上传",
      //   name: "robot_dictUpload",
      //   component: resolve => {
      //     require(["@/views/robot/dictUpload"], resolve);
      //   }
      // },
      // {
      //   path: "stopdictUpload",
      //   icon: "android-upload",
      //   title: "停用词典上传",
      //   name: "robot_stopdictUpload",
      //   component: resolve => {
      //     require(["@/views/robot/stopdictUpload"], resolve);
      //   }
      // },
      // {
      //   path: "term",
      //   icon: "ios-settings-strong",
      //   title: "term分析",
      //   name: "robot_term",
      //   component: resolve => {
      //     require(["@/views/robot/term"], resolve);
      //   }
      // }
    ]
  },
  {
    path: "/system",
    icon: "android-boat",
    name: "system",
    title: "系统管理",
    component: Main,
    children: [
      {
    path: "/wizard",
    icon: "ios-flame",
    name: "wizard",
    title: "知识图谱",
    component: Main,
    children: [
      {
        //   path: 'list',
        //   icon: 'android-menu',
        //   title: '列表展示',
        //   name: 'wizard_list',
        //   component: resolve => {
        //     require(['@/views/wizard/list'], resolve);
        //   }
        // }, {
        path: "graph",
        icon: "ios-color-filter",
        title: "知识图谱",
        name: "wizard_graph",
        component: resolve => {
          require(["@/views/wizard/graph"], resolve);
        }
      },
      // {
      //   path: "groot",
      //   icon: "ios-color-filter",
      //   title: "新版知识图谱",
      //   name: "wizard_groot",
      //   component: resolve => {
      //     require(["@/views/wizard/groot"], resolve);
      //   }
      // }
    ]
  },
      // {
      //   path: "api",
      //   icon: "earth",
      //   title: "接口调用情况",
      //   name: "system_api",
      //   component: resolve => {
      //     require(["@/views/system/api"], resolve);
      //   }
      // },
      // {
      //   path: "search",
      //   icon: "magnet",
      //   title: "搜索引擎状况",
      //   name: "system_search",
      //   component: resolve => {
      //     require(["@/views/system/search"], resolve);
      //   }
      // },
      {
        path: "infolog",
        icon: "planet",
        title: "nginx日志",
        name: "system_info_log",
        component: resolve => {
          require(["@/views/system/systemInfoLog"], resolve);
        }
      },
      {
        path: "runninglog",
        icon: "earth",
        title: "系统运行日志",
        name: "system_runnning_log",
        component: resolve => {
          require(["@/views/system/systemRunningLog"], resolve);
        }
      },
      {
        path: "backup",
        icon: "android-refresh",
        title: "系统备份和恢复",
        name: "system_backup",
        component: resolve => {
          require(["@/views/system/backup"], resolve);
        }
      },
      // {
      //   path: "report-lawdist",
      //   icon: "clipboard",
      //   title: "法规库数据统计",
      //   name: "system_report_lawdist",
      //   component: resolve => {
      //     require(["@/views/system/report-lawdist"], resolve);
      //   }
      // },
      // {
      //   path: "report-qadist",
      //   icon: "clipboard",
      //   title: "问答库数据统计",
      //   name: "system_report_qadist",
      //   component: resolve => {
      //     require(["@/views/system/report-qadist"], resolve);
      //   }
      // },
      // {
      //   path: "report-articledist",
      //   icon: "clipboard",
      //   title: "文章库数据统计",
      //   name: "system_report_articledist",
      //   component: resolve => {
      //     require(["@/views/system/report-articledist"], resolve);
      //   }
      // },
      // {
      //   path: "report-graphdist",
      //   icon: "clipboard",
      //   title: "知识图谱数据统计",
      //   name: "system_report_graphdist",
      //   component: resolve => {
      //     require(["@/views/system/report-graphdist"], resolve);
      //   }
      // },
      // {
      //   path: "report-workflowdist",
      //   icon: "clipboard",
      //   title: "业务数据统计",
      //   name: "system_report_workflowdist",
      //   component: resolve => {
      //     require(["@/views/system/report-workflowdist"], resolve);
      //   }
      // }
    ]
  }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  locking,
  ...appRouter,
  page500,
  page403,
  page404
];
