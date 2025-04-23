import App from './App.vue'
import { createSSRApp } from 'vue'



// 全局错误处理
const handleError = (err) => {
  console.error('捕获到全局错误:', err);
  // 可以在这里添加自定义错误上报逻辑
};

export function createApp() {
  const app = createSSRApp(App)
  
  
  // 添加全局错误处理
  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue错误:', err);
    console.info('错误来源:', info);
    handleError(err);
  };
  
  
  // 针对小程序环境的全局配置
  if (uni.getSystemInfoSync().platform === 'mp-weixin') {
    console.log('当前运行环境: 微信小程序');
    
    
    // 针对微信小程序环境的特殊处理
    uni.onError((err) => {
      console.error('小程序错误:', err);
      handleError(err);
    });
    


  }
  
  return {
    app
  }
} 