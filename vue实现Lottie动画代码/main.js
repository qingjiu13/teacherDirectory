import App from './App'
import { createSSRApp } from 'vue'
import store from './store'

import { installDebugPlugin, installDebugForVue3 } from './utils/vuex-debug'
import { injectStoreSafety, checkStoreAvailability } from './store/inject-checker'
import loadingMixin from './mixin/loading.mixin.js'

export function createApp() {
  const app = createSSRApp(App)

  // ✅ 注册 Vuex
  app.use(store)

  // ✅ 依赖注入方式提供 store
  app.provide('store', store)

  // ✅ 全局挂载 $store（兼容旧代码）
  app.config.globalProperties.$store = store

  // ✅ 注册 mixin
  app.mixin(loadingMixin)
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
    } catch (e) {
      console.error('微信小程序配置失败:', e)
    }
  }

  // ✅ 返回给 uni-app
  return {
    app
  }
}
