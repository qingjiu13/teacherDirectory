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
    installDebugPlugin(store)
    installDebugForVue3(app, store)
    checkStoreAvailability(store)
    console.log('初始Vuex状态:', store.state)
  }

  // ✅ 微信小程序错误监听
  if (uni.getSystemInfoSync().platform === 'mp-weixin') {
    console.log('当前运行环境: 微信小程序')
    uni.onError((err) => {
      console.error('小程序错误:', err)
      handleError(err)
    })
  }

  // ✅ 返回给 uni-app
  return {
    app
  }
}
