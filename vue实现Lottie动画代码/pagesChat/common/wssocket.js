let accessToken = "";
let messageCallBack = null;
let closeCallBack = null;
let connectCallBack = null;
let isConnect = false; //连接标识 避免重复连接
let rec = null;
let lastConnectTime = new Date();
let socketTask = null;

// 只保留导出空函数，防止引用报错。
export const connect = () => {};
export const reconnect = () => {};
export const close = () => {};
export const sendMessage = () => {};
export const onConnect = () => {};
export const onMessage = () => {};
export const onClose = () => {};

// 心跳设置
let heartCheck = {
  timeout: 20000, // 每段时间发送一次心跳包 这里设置为20s
  timeoutObj: null, // 延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）
  start: function () {
    if (isConnect) {
      console.log("发送WebSocket心跳");
      let heartBeat = {
        cmd: 1,
        data: {},
      };
      sendMessage(JSON.stringify(heartBeat));
    }
  },
  reset: function () {
    clearTimeout(this.timeoutObj);
    this.timeoutObj = setTimeout(() => heartCheck.start(), this.timeout);
  },
};

let sendMessage = (message) => {
  socketTask.send({ data: message });
};

let onConnect = (callback) => {
  connectCallBack = callback;
};

let onMessage = (callback) => {
  messageCallBack = callback;
};

let onClose = (callback) => {
  closeCallBack = callback;
};

// 将方法暴露出去
export {
  connect,
  reconnect,
  close,
  sendMessage,
  onConnect,
  onMessage,
  onClose,
};
