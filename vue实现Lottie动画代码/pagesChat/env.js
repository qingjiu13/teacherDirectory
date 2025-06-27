//设置环境(打包前修改此变量)
const ENV = "DEV";
const UNI_APP = {};

// 每个会话最大消息缓存数量，-1表示不限制
UNI_APP.MAX_MESSAGE_SIZE = 3000;
// 表情包路径

if (ENV == "DEV") {
  // 本地测试服务器配置
  UNI_APP.BASE_URL = "http://x62e45a8.natappfree.cc";
  UNI_APP.WS_URL = "ws://x62e45a8.natappfree.cc";

  // 如果需要使用natapp内网穿透，取消下面的注释
  // UNI_APP.BASE_URL = "http://w83ee856.natappfree.cc";
  // UNI_APP.WS_URL = "ws://w83ee856.natappfree.cc/websocket";

  // H5 走本地代理解决跨域问题
  // #ifdef H5
  UNI_APP.BASE_URL = "/api";
  UNI_APP.WS_URL = "ws://localhost:8081"; // H5环境下的WebSocket地址
  // #endif
}
if (ENV == "PROD") {
  UNI_APP.BASE_URL = "https://www.boxim.online/api";
  UNI_APP.WS_URL = "wss://www.boxim.online/im";
}
export default UNI_APP;
