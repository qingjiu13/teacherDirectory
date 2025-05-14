# 触摸移动事件监听：在根视图上添加 @touchmove 事件，这样当用户在组件上滑动时会触发
# 全局事件监听：使用 uni.$on 和 uni.$off 注册和解绑全局自定义事件 'page-scroll'，这允许页面组件通过 uni.$emit('page-scroll') 通知所有组件有页面滚动发生

// 在您的页面组件中
要让这个功能完全生效，您还需要在页面组件中添加以下代码来发送滚动事件：
这样当页面滚动时，下拉框就会自动收起，不会影响用户体验。
export default {
  onPageScroll() {
    // 通知所有组件页面已滚动
    uni.$emit('page-scroll');
  }
}