import GlobalLoading from './GlobalLoading.vue'
import LoadingAnimation from './LoadingAnimation.vue'
import { useAnimationCache, useGlobalAnimationState, preloadAnimations } from './useAnimationCache.js'

/**
 * 安装全局加载插件
 * @param {Object} app - Vue应用实例
 * @param {Object} options - 插件选项
 */
export function install(app, options = {}) {
  // 注册组件
  app.component('GlobalLoading', GlobalLoading)
  app.component('LottieLoading', LoadingAnimation)
  
  // 注册全局属性
  app.config.globalProperties.$loading = {
    show: () => {
      // 访问全局App对象获取loading控制
      const globalApp = getApp()
      if (globalApp && globalApp.globalData && globalApp.globalData.$loading) {
        return globalApp.globalData.$loading.show()
      }
      return false
    },
    hide: () => {
      const globalApp = getApp()
      if (globalApp && globalApp.globalData && globalApp.globalData.$loading) {
        return globalApp.globalData.$loading.hide()
      }
      return false
    },
    preload: async () => {
      const globalApp = getApp()
      if (globalApp && globalApp.globalData && globalApp.globalData.$loading) {
        return await globalApp.globalData.$loading.preload()
      }
      return false
    }
  }
  
  // 注入全局动画状态对象
  const { 
    globalState, 
    getGlobalStats, 
    isAllAnimationsLoaded,
    preloadAnimation
  } = useGlobalAnimationState()
  
  app.provide('animationState', {
    globalState,
    getStats: getGlobalStats,
    isAllLoaded: isAllAnimationsLoaded,
    preload: preloadAnimation
  })
  
  // 注册mixin
  app.mixin({
    beforeCreate() {
      this.$animationState = {
        globalState,
        getStats: getGlobalStats,
        isAllLoaded: isAllAnimationsLoaded,
        preload: preloadAnimation
      }
    }
  })
  
  // 如果有预加载选项，执行
  if (options.preload) {
    const { animations } = options.preload
    if (animations && Array.isArray(animations) && animations.length > 0) {
      // 延迟执行，以确保应用已完全初始化
      setTimeout(() => {
        preloadAnimations(animations, (progress) => {
          console.log(`预加载进度: ${progress.progress.toFixed(2)}%`)
        })
        .then(result => {
          console.log(`预加载完成: 成功${result.totalSuccess}个, 失败${result.totalFailed}个`)
        })
      }, 100)
    }
  }
}

/**
 * 创建加载组件插件
 * @param {Object} options - 插件选项
 * @returns {Object} 插件对象
 */
export function createLoadingPlugin(options = {}) {
  return {
    install: (app) => install(app, options)
  }
}

// 直接导出组件和钩子
export {
  GlobalLoading,
  LoadingAnimation,
  useAnimationCache,
  useGlobalAnimationState,
  preloadAnimations
}

// 导出默认插件
export default {
  install
} 