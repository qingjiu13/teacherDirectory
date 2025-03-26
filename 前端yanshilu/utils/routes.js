/**
 * @description 统一路由管理
 * 集中管理所有页面的路由路径，提供导航方法
 */

import { pageMap } from '../config.js';

/**
 * @description 主要页面路径
 */
export const MainRoutes = {
  // 主页面
  INDEX: '/pages/index/index',
  MESSAGE: '/pages/message/message',
  PUBLISH: '/pages/publish/publish',
  MINE: '/pages/mine/mine',
  
  // 获取主页面路径
  getPath(pageName) {
    return pageMap[pageName] || this.INDEX;
  }
};

/**
 * @description 消息页面路径
 */
export const MessageRoutes = {
  // 消息主页
  MESSAGE_HOME: '/pages/message/message',
  // 聊天页面
  CHAT: '/pages/message/chat',
  // 系统通知
  NOTIFICATION: '/pages/message/notification/notification',
  // 好友申请
  FRIEND_REQUEST: '/pages/message/add',
  // 好友详情
  FRIEND_DETAIL: '/pages/message/friend/detail'
};

/**
 * @description 发布页面路径
 */
export const PublishRoutes = {
  // 发布主页
  PUBLISH_HOME: '/pages/publish/publish',
  // 发布文章
  PUBLISH_ARTICLE: '/pages/publish/article/article',
  // 发布问题
  PUBLISH_QUESTION: '/pages/publish/question/question',
  // 发布动态
  PUBLISH_MOMENT: '/pages/publish/moment/moment'
};

/**
 * @description 我的页面路径
 */
export const MineRoutes = {
  // 我的主页
  MINE_HOME: '/pages/mine/mine',
  // 个人信息
  PROFILE: '/pages/mine/profile/profile',
  // 我的收藏
  FAVORITES: '/pages/mine/favorites/favorites',
  // 我的发布
  MY_POSTS: '/pages/mine/posts/posts',
  // 设置
  SETTINGS: '/pages/mine/settings/settings'
};

/**
 * @description 老师相关页面路径
 */
export const TeacherRoutes = {
  // 老师列表
  TEACHER_LIST: '/pages/teacher/list/list',
  // 老师详情
  TEACHER_DETAIL: '/pages/teacher/detail/detail',
  // 约见老师
  TEACHER_APPOINTMENT: '/pages/teacher/appointment/appointment'
};

/**
 * @description 帖子相关页面路径
 */
export const PostRoutes = {
  // 帖子详情
  POST_DETAIL: '/pages/post/detail/detail',
  // 评论列表
  POST_COMMENTS: '/pages/post/comments/comments'
};

/**
 * @description 匹配相关页面路径
 */
export const MatchRoutes = {
  // 匹配主页
  MATCH_HOME: '/pages/match/match',
  // 匹配详情
  MATCH_DETAIL: '/pages/match/detail',
  // 匹配结果
  MATCH_RESULT: '/pages/match/result'
};

/**
 * @description AI助手相关页面路径
 */
export const AIRoutes = {
  // AI助手主页
  AI_HOME: '/pages/AI/AI',
  // AI聊天记录
  AI_HISTORY: '/pages/AI/history',
  // AI设置
  AI_SETTINGS: '/pages/AI/settings'
};

/**
 * @description 公共页面路径
 */
export const CommonRoutes = {
  // 登录页
  LOGIN: '/pages/login/login',
  // 注册页
  REGISTER: '/pages/login/register',
  // 关于页面
  ABOUT: '/pages/common/about/about',
  // 隐私政策
  PRIVACY: '/pages/common/privacy/privacy',
  // 用户协议
  TERMS: '/pages/common/terms/terms',
  // 常见问题
  FAQ: '/pages/common/faq/faq',
  // 404页面
  NOT_FOUND: '/pages/common/404/404'
};

/**
 * @description 导航方法集合
 */
export const Navigator = {
  /**
   * @description 普通页面跳转
   * @param {string} url 页面路径
   * @param {Object} params 页面参数
   */
  navigateTo(url, params = null) {
    if (params) {
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      url = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
    }
    
    uni.navigateTo({
      url: url
    });
  },
  
  /**
   * @description 重定向页面（关闭当前页面）
   * @param {string} url 页面路径
   * @param {Object} params 页面参数
   */
  redirectTo(url, params = null) {
    if (params) {
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      url = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
    }
    
    uni.redirectTo({
      url: url
    });
  },
  
  /**
   * @description 切换Tab页面
   * @param {string} url Tab页面路径
   */
  switchTab(url) {
    uni.switchTab({
      url: url
    });
  },
  
  /**
   * @description 返回上一页
   * @param {number} delta 返回的层级
   */
  navigateBack(delta = 1) {
    uni.navigateBack({
      delta: delta
    });
  },
  
  /**
   * @description 重启到首页
   */
  reLaunch(url = MainRoutes.INDEX) {
    uni.reLaunch({
      url: url
    });
  },
  
  /**
   * @description 跳转到帖子详情页
   * @param {string} postId 帖子ID
   */
  toPostDetail(postId) {
    this.navigateTo(PostRoutes.POST_DETAIL, { id: postId });
  },
  
  /**
   * @description 跳转到老师详情页
   * @param {string} teacherId 老师ID
   */
  toTeacherDetail(teacherId) {
    this.navigateTo(TeacherRoutes.TEACHER_DETAIL, { id: teacherId });
  },
  
  /**
   * @description 跳转到AI助手页面
   */
  toAI() {
    this.navigateTo(AIRoutes.AI_HOME);
  },
  
  /**
   * @description 跳转到登录页
   * @param {string} redirect 登录后跳转的页面
   */
  toLogin(redirect = null) {
    const params = redirect ? { redirect } : null;
    this.navigateTo(CommonRoutes.LOGIN, params);
  }
};

/**
 * @description 默认导出所有路由
 */
export default {
  main: MainRoutes,
  message: MessageRoutes,
  publish: PublishRoutes,
  mine: MineRoutes,
  teacher: TeacherRoutes,
  post: PostRoutes,
  match: MatchRoutes,
  ai: AIRoutes,
  common: CommonRoutes,
  navigator: Navigator
}; 