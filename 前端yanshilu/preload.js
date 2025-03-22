/**
 * 页面预加载
 * 用于提前加载页面组件，减少首次加载页面时的编译时间
 */
export default function() {
  // 预加载所有主要页面
  const pages = [
    'pages/index/index',
    'pages/message/message',
    'pages/publish/publish',
    'pages/mine/mine',
    'pages/match/match',
    'pages/publish/editor',
    'pages/post/detail',
    'pages/teacher/profile'
  ];
  
  // 使用glob导入所有页面
  const modules = import.meta.glob('./**/*.uvue');
  
  // 逐个加载页面
  pages.forEach(page => {
    try {
      // 构造正确的路径格式
      const pagePath = `./${page}.uvue`;
      
      // 检查页面是否在预加载列表中
      if (modules[pagePath]) {
        modules[pagePath]().then(() => {
          console.log(`预加载页面成功: ${page}`);
        }).catch(err => {
          console.warn(`预加载页面失败: ${page}`, err);
        });
      } else {
        console.warn(`预加载页面不存在: ${page}`);
      }
    } catch (e) {
      console.warn(`预加载页面出错: ${page}`, e);
    }
  });
} 