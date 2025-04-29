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
    // 延迟 300ms 显示 Loading，防止一闪而过
    timer = setTimeout(() => {
      app.globalData?.$loading?.show?.()
    }, 300)
  },
  onReady() {
    clearTimeout(timer)
    const app = getApp()
    app.globalData?.$loading?.hide?.()
  }
}
