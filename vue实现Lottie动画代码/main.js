// Vue 3方式的应用入口
import App from './App'
import { createApp as createVueApp } from 'vue'
// 导入Vuex store
import store from './store'
// 导入调试工具
import { installDebugPlugin, installDebugForVue3 } from './utils/vuex-debug'
// 导入store安全访问混入
import { injectStoreSafety, checkStoreAvailability } from './store/inject-checker'

// 创建应用实例
const app = createVueApp(App)

// 使用Vuex
app.use(store)

// 提供store给应用（依赖注入方式）
app.provide('store', store)

// 全局错误处理
const handleError = (err) => {
  console.error('捕获到全局错误:', err);
  // 可以在这里添加自定义错误上报逻辑
};

// 添加全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue错误:', err);
  console.info('错误来源:', info);
  handleError(err);
};

// 为兼容性添加共享对象，使旧代码中的this.$store仍能工作
app.config.globalProperties.$store = store

// 注册安全访问混入（Vue 3方式）
app.mixin(injectStoreSafety)

// 在开发环境下安装调试插件
if (process.env.NODE_ENV !== 'production') {
  // 安装调试插件（适配Vue 3）
  installDebugPlugin(store);
  // 安装Vue 3调试混入
  installDebugForVue3(app, store);
  
  // 检查store可用性
  checkStoreAvailability(store);
  
  // 输出初始状态
  console.log('初始Vuex状态:', store.state);
}

// 针对小程序环境的全局配置
if (uni.getSystemInfoSync().platform === 'mp-weixin') {
  console.log('当前运行环境: 微信小程序');
  
  // 针对微信小程序环境的特殊处理
  uni.onError((err) => {
    console.error('小程序错误:', err);
    handleError(err);
  });
}

// 挂载应用
app.mount('#app')

// 导出创建的应用实例 - uni-app规范方式
export function createApp() {
  return {
    app
  }
} 