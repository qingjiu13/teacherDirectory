import App from './App'
import request from './common/request';
import emotion from './common/emotion.js';
import url from './common/url.js';
import * as  enums from './common/enums.js';
import * as date from './common/date';
import * as socketApi from './common/wssocket';
import * as messageType from './common/messageType';
import { createSSRApp } from 'vue'
import uviewPlus from '@/uni_modules/uview-plus'
import * as pinia from 'pinia';

// 引入store
import useChatStore from './store/chatStore.js';
import useFriendStore from './store/friendStore.js';
import useConfigStore from './store/configStore.js';
import useUserStore from './store/userStore.js';
import useGroupStore from './store/groupStore.js';

// 引入环境配置
import UNI_APP from './env.js';

// 引入uni-ui组件
import uniSearchBar from '@/uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.vue'

// 创建Pinia实例
const piniaInstance = pinia.createPinia();

// 导入分包所需的组件
import barGroup from '/pagesChat/components/bar/bar-group'
import arrowBar from '/pagesChat/components/bar/arrow-bar'
import btnBar from '/pagesChat/components/bar/btn-bar'
import switchBar from '/pagesChat/components/bar/switch-bar'

// 导入聊天相关组件
import navBar from '/pagesChat/components/nav-bar/nav-bar'
import loading from '/pagesChat/components/loading/loading'
import longPressMenu from '/pagesChat/components/long-press-menu/long-press-menu'
import chatItem from '/pagesChat/components/chat-item/chat-item'

// #ifdef H5
import * as recorder from './common/recorder-h5';
import ImageResize from "quill-image-resize-mp";
import Quill from "quill"; 
// 以下组件用于兼容部分手机聊天边框无法输入的问题
window.Quill = Quill;  
window.ImageResize = { default: ImageResize };  
// 调试器
// import VConsole from 'vconsole'
// new VConsole();
// #endif
// #ifndef H5
import * as recorder from './common/recorder-app';
// #endif

// 全局 pinia 实例，以便在组件外部使用
let _app = null;

// 添加webrtc配置到UNI_APP（如果不存在）
if (!UNI_APP.WEBRTC) {
  UNI_APP.WEBRTC = {
    ICE_SERVERS: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
    MAX_CHANNEL: 6 // 最大通话人数
  };
}

// 预先创建的Store实例
const chatStore = useChatStore(piniaInstance);
const friendStore = useFriendStore(piniaInstance);
const configStore = useConfigStore(piniaInstance);
const userStore = useUserStore(piniaInstance);
const groupStore = useGroupStore(piniaInstance);

// 重新修复导出的Store获取函数
function getChatStore() {
  return chatStore;
}

function getFriendStore() {
  return friendStore;
}

function getConfigStore() {
  return configStore;
}

function getUserStore() {
  return userStore;
}

function getGroupStore() {
  return groupStore;
}

export function createApp() {
  const app = createSSRApp(App)
  // 保存 app 实例以便全局访问
  _app = app;
  
  app.use(uviewPlus);
  app.use(piniaInstance);
  
  // 注册导航和表单组件
  app.component('bar-group', barGroup);
  app.component('arrow-bar', arrowBar);
  app.component('btn-bar', btnBar);
  app.component('switch-bar', switchBar);
  
  // 注册聊天相关组件
  app.component('nav-bar', navBar);
  app.component('loading', loading);
  app.component('long-press-menu', longPressMenu);
  app.component('chat-item', chatItem);
  
  // 注册uni-ui组件
  app.component('uni-search-bar', uniSearchBar);
  
  // 重要：将$enums添加为全局属性，确保所有组件都能访问
  app.config.globalProperties.$enums = enums;
  app.config.globalProperties.$http = request;
  app.config.globalProperties.$wsApi = socketApi;
  app.config.globalProperties.$msgType = messageType;
  app.config.globalProperties.$emo = emotion;
  app.config.globalProperties.$url = url;
  app.config.globalProperties.$date = date;
  app.config.globalProperties.$rc = recorder;
  app.config.globalProperties.UNI_APP = UNI_APP;
  
  // 添加store实例到全局属性
  app.config.globalProperties.chatStore = chatStore;
  app.config.globalProperties.friendStore = friendStore;
  app.config.globalProperties.configStore = configStore;
  app.config.globalProperties.userStore = userStore;
  app.config.globalProperties.groupStore = groupStore;
  
  // 添加获取store的方法到全局属性
  app.config.globalProperties.getChatStore = getChatStore;
  app.config.globalProperties.getFriendStore = getFriendStore;
  app.config.globalProperties.getConfigStore = getConfigStore;
  app.config.globalProperties.getUserStore = getUserStore;
  app.config.globalProperties.getGroupStore = getGroupStore;
  
  return {
    app,
    pinia: piniaInstance
  }
}

// 导出全局方法，让组件可以安全访问 pinia
export function getApp() {
  return _app;
}

// 导出 pinia 实例，以便在组件外部使用
export function getPinia() {
  return piniaInstance;
}

// 导出所有Store访问方法
export {
  getChatStore,
  getFriendStore,
  getConfigStore,
  getUserStore,
  getGroupStore
};

// 导出环境配置，供其他模块使用
export default UNI_APP;
