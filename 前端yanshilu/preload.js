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
  
  // 逐个加载页面
  pages.forEach(page => {
    // 使用require.context预加载各个页面
    try {
      import(`@/${page}.uvue`).then(() => {
        console.log(`预加载页面成功: ${page}`);
      }).catch(err => {
        console.warn(`预加载页面失败: ${page}`, err);
      });
    } catch (e) {
      console.warn(`预加载页面出错: ${page}`, e);
    }
  });
} 