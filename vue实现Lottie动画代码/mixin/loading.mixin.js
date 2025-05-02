// mixin/loading.mixin.js
let timer = null

/**
 * 全局加载动画混入
 * 在页面加载时自动显示和隐藏加载动画
 * @type {import('vue').ComponentOptions}
 */
export default {
  onLoad() {
    const app = getApp()
    if (!app || !app.globalData || !app.globalData.$loading) {
      console.warn('全局加载控制尚未初始化')
      return
    }
    
    // 延迟 300ms 显示 Loading，防止一闪而过
    timer = setTimeout(() => {
      try {
        app.globalData.$loading.show()
      } catch (err) {
        console.error('显示加载动画失败:', err)
      }
    }, 300)
  },
  onReady() {
    clearTimeout(timer)
    timer = null
    
    const app = getApp()
    if (!app || !app.globalData || !app.globalData.$loading) {
      console.warn('全局加载控制尚未初始化')
      return
    }
    
    try {
      app.globalData.$loading.hide()
    } catch (err) {
      console.error('隐藏加载动画失败:', err)
    }
  },
  onUnload() {
    // 确保组件卸载时清除定时器
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    
    // 确保离开页面时隐藏loading
    const app = getApp()
    if (app?.globalData?.$loading?.hide) {
      app.globalData.$loading.hide()
    }
  }
}
