import App from './App'
import { createSSRApp } from 'vue'
import store from './store'

import { installDebugPlugin, installDebugForVue3 } from './utils/vuex-debug'
import { injectStoreSafety, checkStoreAvailability } from './store/inject-checker'
import LoadingPlugin from './components/loading'
import { useGlobalAnimationState } from './components/loading/useAnimationCache.js'

// 提前初始化全局动画状态
try {
  const { globalState, getGlobalStats, isAllAnimationsLoaded } = useGlobalAnimationState();
  
  // 尝试初始化全局对象
  if (typeof getApp === 'function') {
    try {
      const app = getApp();
      if (app) {
        app.globalData = app.globalData || {};
        
        // 预先创建$loading对象的基本结构
        if (!app.globalData.$loading) {
          app.globalData.$loading = {
            show: () => console.log('Loading组件尚未挂载，show方法未生效'),
            hide: () => console.log('Loading组件尚未挂载，hide方法未生效'),
            preload: () => console.log('Loading组件尚未挂载，preload方法未生效'),
            isPreloaded: { value: false },
            getStatus: () => ({ allLoaded: false, stats: null }),
            globalState
          };
        }
        
        console.log('全局动画状态已提前初始化');
      }
    } catch (e) {
      console.log('全局App尚未初始化，将在createApp中完成初始化');
    }
  }
} catch (err) {
  console.error('提前初始化全局动画状态失败:', err);
}

/**
 * 预加载函数，用于在页面渲染前预加载资源
 */
async function preloadResources() {
  try {
    // 检查全局app是否已初始化
    const globalApp = getApp()
    if (globalApp?.globalData?.$loading?.preload) {
      console.log('通过全局变量预加载动画资源')
      await globalApp.globalData.$loading.preload()
      
      // 挂载全局状态获取方法
      if (!globalApp.globalData.$animationState) {
        const { getGlobalStats, isAllAnimationsLoaded } = useGlobalAnimationState()
        globalApp.globalData.$animationState = {
          getStats: getGlobalStats,
          isAllLoaded: isAllAnimationsLoaded
        }
      }
    } else {
      console.log('全局变量未就绪，将在组件挂载时预加载')
    }
  } catch (err) {
    console.error('预加载资源失败:', err)
  }
}

export function createApp() {
  const app = createSSRApp(App)

  // ✅ 注册 Vuex
  app.use(store)

  // ✅ 注册加载动画插件
  app.use(LoadingPlugin, {
    preload: {
      animations: [
        'https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json'
      ]
    }
  })

  // ✅ 依赖注入方式提供 store
  app.provide('store', store)

  // ✅ 全局挂载 $store（兼容旧代码）
  app.config.globalProperties.$store = store
  
  // ✅ 注册全局动画状态
  const { globalState, getGlobalStats, isAllAnimationsLoaded } = useGlobalAnimationState()
  // 全局变量提供访问
  app.provide('animationState', {
    globalState,
    getStats: getGlobalStats,
    isAllLoaded: isAllAnimationsLoaded
  })
  
  // 全局属性挂载
  app.config.globalProperties.$animationState = {
    globalState,
    getStats: getGlobalStats,
    isAllLoaded: isAllAnimationsLoaded
  }
  
  // 确保全局App对象已初始化
  try {
    const globalApp = getApp();
    if (globalApp) {
      globalApp.globalData = globalApp.globalData || {};
      
      // 确保$loading对象已初始化
      if (!globalApp.globalData.$loading) {
        globalApp.globalData.$loading = {
          show: () => console.log('Loading组件尚未挂载，show方法未生效'),
          hide: () => console.log('Loading组件尚未挂载，hide方法未生效'),
          preload: () => console.log('Loading组件尚未挂载，preload方法未生效'),
          isPreloaded: { value: false },
          getStatus: () => ({ allLoaded: false, stats: null }),
          globalState
        };
      }
      
      // 确保$animationState对象已初始化
      globalApp.globalData.$animationState = {
        getStats: getGlobalStats,
        isAllLoaded: isAllAnimationsLoaded,
        globalState
      };
      
      console.log('全局动画状态已在createApp中初始化');
    }
  } catch (e) {
    console.error('初始化全局App对象失败:', e);
  }

  // ✅ 注册 mixin
  app.mixin(injectStoreSafety)

  // ✅ 全局错误处理
  const handleError = (err) => {
    console.error('捕获到全局错误:', err)
    // 可添加错误上报逻辑
  }

  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue错误:', err)
    console.info('错误来源:', info)
    handleError(err)
  }

  // ✅ 开发环境调试
  if (process.env.NODE_ENV !== 'production') {
    try {
      installDebugPlugin(store)
      installDebugForVue3(app, store)
      checkStoreAvailability(store)
      console.log('初始Vuex状态:', store.state)
      
      // 调试用 - 注册全局动画状态监听器
      if (typeof window !== 'undefined') {
        window.__ANIMATION_DEBUG__ = {
          getStats: getGlobalStats,
          isAllLoaded: isAllAnimationsLoaded,
          globalState
        }
        console.log('已注册动画状态调试工具，可通过 window.__ANIMATION_DEBUG__ 访问')
      }
    } catch (e) {
      console.error('调试插件初始化失败:', e)
    }
  }

  // ✅ 微信小程序错误监听
  if (uni.getSystemInfoSync().platform === 'mp-weixin') {
    console.log('当前运行环境: 微信小程序')
    
    // 配置微信小程序特有的处理
    try {
      // 全局错误监听
      uni.onError((err) => {
        console.error('小程序错误:', err)
        handleError(err)
      })
      
      // 网络请求错误
      uni.onNetworkStatusChange((res) => {
        console.log('网络状态变化:', res.isConnected ? '已连接' : '已断开')
        store.commit('app/setNetworkStatus', res.isConnected)
      })
      
      // 确保全局变量设置
      const app = getApp()
      if (app && !app.globalData) {
        app.globalData = {}
      }
      
      // 提供全局动画状态访问
      if (app && app.globalData) {
        app.globalData.$animationState = {
          getStats: getGlobalStats,
          isAllLoaded: isAllAnimationsLoaded,
          globalState
        }
      }
    } catch (e) {
      console.error('微信小程序配置失败:', e)
    }
  }

  // 尝试初始预加载
  preloadResources()

  // ✅ 返回给 uni-app
  return {
    app
  }
}
