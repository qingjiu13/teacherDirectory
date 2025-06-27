<template>
    <view class="chat-page">
      <Header :title="chatTitle" :avatar="chatAvatar" @back="goBack" />
  
      <!-- 连接状态栏 -->
      <view class="connection-status" v-if="!isSocketOpen">
        <view class="status-info">
          <text class="status-text">{{
            isPolling ? "轮询模式" : "连接已断开"
          }}</text>
          <text class="status-detail">{{
            isPolling ? "每5秒检查新消息" : "无法实时接收消息"
          }}</text>
        </view>
        <button class="reconnect-btn" @click="manualReconnect">重新连接</button>
      </view>
  
      <!-- 消息列表 -->
      <scroll-view
        class="message-list-container"
        scroll-y
        :scroll-top="scrollTop"
        :scroll-with-animation="true"
        :style="{ height: messageListHeight + 'px' }"
      >
        <view class="message-list-content">
          <view v-for="item in messageListWithTimeTips" :key="item.id">
            <view v-if="item.type === 'time-tip'" class="time-tip-bar">
              {{ toTimeText(item.time) }}
            </view>
            <view
              v-else
              :class="[
                'message-row',
                { self: Number(item.senderId) === Number(selfId) },
              ]"
            >
              <ChatMessageItem
                :message="item"
                :is-self="Number(item.senderId) === Number(selfId)"
              />
            </view>
          </view>
        </view>
      </scroll-view>
  
      <!-- 底部输入栏 -->
      <view
        class="input-bar-container"
        :style="{ bottom: keyboardHeight + 'px' }"
      >
        <view class="input-bar">
          <view class="textarea-container">
            <scroll-view
              scroll-y
              :show-scrollbar="false"
              class="textarea-scroll-view"
            >
              <u--textarea
                class="input-textarea"
                v-model="textInput"
                placeholder="请输入内容"
                :showConfirmBar="false"
                autoHeight
                :adjustPosition="false"
                border="surround"
                :maxlength="500"
                @focus="onInputFocus"
                @blur="onInputBlur"
              />
            </scroll-view>
          </view>
          <!-- 根据是否有文本输入，切换图标和发送按钮 -->
          <view class="action-wrapper">
            <button
              v-if="textInput.length > 0"
              class="send-button"
              @click="sendSocketMessage"
              @longpress="showDebugInfo"
            >
              发送
            </button>
            <text
              v-else
              class="iconfont icon-add-bold icon"
              @click="handleMore"
              @longpress="showDebugInfo"
            ></text>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script setup>
  import { ref, computed, watch } from "vue";
  import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";
  import ChatMessageItem from "./components/chat-message-item/chat-message-item.vue";
  import UNI_APP from "./env.js";
  import Header from "@/components/navigationTitleBar/header.vue";
  import { getCurrentToken, getCurrentUserId } from "@/store/user/JWT.js";
  import pollingManager from "@/utils/pollingManager.js";
  import websocketManager from "@/utils/websocketManager.js";
  import { toTimeText } from "./common/date.js";
  
  // --- 数据定义 ---
  const chatId = ref(null);
  const selfId = ref(null);
  const chatTitle = ref("");
  const chatAvatar = ref("");
  const messages = ref([]);
  const textInput = ref("");
  const scrollTop = ref(0);
  const keyboardHeight = ref(0);
  const statusBarHeight = ref(0);
  const windowHeight = ref(0);
  const navbarHeight = ref(44); // 添加导航栏高度，默认44px
  
  // 客服ID
  const ADMIN_ID = 1;
  
  // 添加轮询相关变量
  const pollingInterval = ref(null);
  const lastMessageId = ref(0);
  const isPolling = computed(() => pollingManager.getStatus().isPolling);
  
  // WebSocket 相关变量
  const isSocketOpen = ref(false);
  let socketTask = null;
  
  // 计算消息列表高度
  const messageListHeight = computed(() => {
    return windowHeight.value - navbarHeight.value - 140 - keyboardHeight.value;
  });
  
  // --- 本地缓存相关 ---
  function getCacheKey() {
    return `chat_messages_${selfId.value}_${chatId.value}`;
  }
  
  function saveMessagesToCache() {
    try {
      const messagesToSave = messages.value.filter(
        (msg) => msg.status === "confirmed" || msg.isLocal
      );
      const maxCacheSize = 100;
      const messagesToCache = messagesToSave.slice(-maxCacheSize);
      const cacheKey = getCacheKey();
      uni.setStorageSync(cacheKey, messagesToCache);
    } catch (error) {}
  }
  
  function loadMessagesFromCache() {
    const cacheKey = getCacheKey();
    const cached = uni.getStorageSync(cacheKey) || [];
    if (cached.length === 0 && Number(chatId.value) === 1) {
      // 客服会话且无消息，插入欢迎语
      messages.value.splice(0, messages.value.length, {
        id: "welcome",
        senderId: 1,
        receiverId: selfId.value,
        content: "您好，我是小助手，有什么可以帮到您？",
        messageType: 1,
        createdAt: new Date().toISOString(),
        isSelf: false,
        status: "confirmed",
        isLocal: false,
      });
    } else {
      messages.value.splice(0, messages.value.length, ...cached);
    }
  }
  
  // --- 键盘事件处理 ---
  const onInputFocus = (e) => {
    // 键盘弹出时的处理
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  };
  
  const onInputBlur = () => {
    // 键盘收起时的处理
    keyboardHeight.value = 0;
  };
  
  // --- 键盘监听 ---
  const initKeyboardListener = () => {
    // 监听键盘高度变化
    uni.onKeyboardHeightChange((res) => {
      keyboardHeight.value = res.height || 0;
  
      // 键盘弹出时滚动到底部
      if (res.height > 0) {
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    });
  };
  
  // --- 生命周期 ---
  onLoad(async (options) => {
    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync();
    statusBarHeight.value = systemInfo.statusBarHeight || 0;
    windowHeight.value = systemInfo.windowHeight;
  
    // 初始化键盘监听
    initKeyboardListener();
  
    console.log("[调试] onLoad options:", options);
  
    // 校验 chatId 参数
    if (!options.id) {
      console.error("[调试] 错误：onLoad 未接收到 chatId 参数！");
      uni.showToast({ title: "参数错误", icon: "none" });
      setTimeout(() => uni.navigateBack(), 1500);
      return;
    }
  
    chatId.value = options.id;
    selfId.value = Number(getCurrentUserId() || 1);
    chatTitle.value = options.title ? decodeURIComponent(options.title) : "";
    chatAvatar.value =
      options.avatar || "/static/image/defaultAvatar/student-man.png";
    console.log(
      "[调试] onLoad chatId:",
      chatId.value,
      "selfId:",
      selfId.value,
      "chatId类型:",
      typeof chatId.value
    );
  
    // 拉取历史消息后，如果 chatTitle 还是空，就自动从消息里找
    if (!chatTitle.value) {
      // 找到第一条对方发来的消息
      const otherMsg = messages.value.find(
        (m) => m.senderId && m.senderId !== selfId.value && m.nickname
      );
      if (otherMsg && otherMsg.nickname) {
        chatTitle.value = otherMsg.nickname;
      }
    }
    if (!chatTitle.value) {
      chatTitle.value = "聊天";
    }
  
    // 先清空本地消息
    messages.value.splice(0, messages.value.length);
  
    // 检查网络连接和token
    const token = getCurrentToken();
    console.log("[调试] 页面加载，检查配置:", {
      chatId: chatId.value,
      chatIdType: typeof chatId.value,
      selfId: selfId.value,
      hasToken: !!token,
      baseUrl: UNI_APP.BASE_URL,
      wsUrl: UNI_APP.WS_URL,
    });
  
    if (!token) {
      console.error("[调试] 未找到token，无法建立连接");
      uni.showToast({ title: "请先登录", icon: "none" });
      return;
    }
  
    // 页面加载时读取缓存
    loadMessagesFromCache();
    console.log(
      "[调试] onLoad 缓存消息:",
      JSON.parse(JSON.stringify(messages.value))
    );
  
    // 确保 chatId 有效后再加载历史消息
    if (chatId.value) {
      await loadChatHistory();
    } else {
      console.error("[调试] chatId 无效，跳过历史消息加载");
    }
  
    // 设置当前页面为chat-box
    pollingManager.setCurrentPage("chat-box");
  
    // 注册轮询回调
    pollingManager.registerPollingCallback("chat-box", checkNewMessages);
  
    // 确保 chatId 有效后再连接 WebSocket
    if (chatId.value) {
      connectWebSocket();
    } else {
      console.error("[调试] chatId 无效，跳过 WebSocket 连接");
    }
  });
  
  onShow(() => {
    console.log("[调试] onShow - 页面显示");
    // 设置当前页面为聊天页面
    pollingManager.setCurrentPage("chat-box");
  
    // 如果WebSocket断开，尝试重连
    if (!isSocketOpen.value) {
      console.log("[调试] onShow - WebSocket断开，尝试重连");
      setTimeout(() => {
        connectWebSocket();
      }, 1000);
    }
  });
  
  onUnload(() => {
    console.log("[调试] onUnload - 页面卸载");
    // 注销轮询回调
    pollingManager.unregisterPollingCallback("chat-box");
  
    // 关闭WebSocket连接
    closeWebSocket();
  
    // 清理缓存
    saveMessagesToCache();
  });
  
  // --- API 调用 ---
  function getCurrentChatInfo() {
    // chatId为对方id
    const id = Number(chatId.value);
    // 由于无法直接导入chats，这里返回空对象
    // 如果需要获取聊天信息，可以通过API调用或本地存储获取
    return {};
  }
  
  const loadChatHistory = async () => {
    try {
      if (!chatId.value) return;
      loadMessagesFromCache();
      const token = getCurrentToken();
      if (!token) return;
      // 只用 chatId 作为目标用户，后端自动识别当前用户
      console.log("[调试] 拉取历史消息参数:", { targetUserId: chatId.value });
      const response = await uni.request({
        url: `${UNI_APP.BASE_URL}/yanshilu/chatMessage/history/${chatId.value}`,
        method: "GET",
        data: {
          chatId: chatId.value,
        },
        header: { Authorization: `Bearer ${token}` },
      });
      let resData = response[1] ? response[1] : response;
      if (
        resData &&
        resData.statusCode === 200 &&
        resData.data &&
        resData.data.code === 200
      ) {
        const history = resData.data.data || [];
        const historyMessages = history.map((msg) => ({
          id: msg.id || msg.chatMessageId,
          chatMessageId: msg.chatMessageId,
          senderId: msg.sendId || msg.senderId,
          receiverId: msg.receiverId,
          content: msg.content,
          messageType: msg.type || msg.msgType,
          createdAt: msg.sendTime || msg.send_time,
          isSelf: (msg.sendId || msg.senderId) === selfId.value,
          status: "confirmed",
          isLocal: false,
          avatar:
            msg.avatar ||
            msg.senderPicture ||
            msg.headImage ||
            "/static/image/defaultAvatar/student-man.png",
          nickname:
            msg.nickname ||
            msg.senderName ||
            msg.nickName ||
            `用户${msg.senderId || msg.sendId}`,
        }));
        const filtered = historyMessages.filter(
          (m) =>
            (m.senderId === selfId.value &&
              m.receiverId === Number(chatId.value)) ||
            (m.senderId === Number(chatId.value) && m.receiverId === selfId.value)
        );
        messages.value.splice(0, messages.value.length, ...filtered);
        saveMessagesToCache();
        scrollToBottom();
        // 拉取历史消息后，如果 chatTitle 还是空，就自动从消息里找
        if (!chatTitle.value) {
          const otherMsg = filtered.find(
            (m) => m.senderId && m.senderId !== selfId.value && m.nickname
          );
          if (otherMsg && otherMsg.nickname) {
            chatTitle.value = otherMsg.nickname;
          }
        }
        if (!chatTitle.value) {
          chatTitle.value = "聊天";
        }
      } else {
        console.log(
          "[调试] loadChatHistory 未通过判断，resData:",
          JSON.stringify(resData)
        );
      }
    } catch (e) {}
  };
  
  // 获取用户头像
  const getAvatarForUser = (senderId, chatId) => {
    if (senderId === selfId.value) {
      return (
        uni.getStorageSync("userAvatar") ||
        "/static/image/defaultAvatar/student-man.png"
      );
    } else if (senderId === chatId) {
      const chatInfo = getCurrentChatInfo();
      return (
        chatInfo.headImage ||
        chatInfo.chatAvatar ||
        "/static/image/defaultAvatar/student-man.png"
      );
    }
    return "/static/image/defaultAvatar/student-man.png";
  };
  
  // 2. 发送消息到 WebSocket
  const sendSocketMessage = () => {
    if (!isSocketOpen.value || !socketTask) {
      connectWebSocket();
      setTimeout(() => {
        if (isSocketOpen.value && socketTask) sendSocketMessage();
      }, 2000);
      return;
    }
    if (!textInput.value.trim()) return;
    if (!chatId.value) return;
  
    let fromUserId = selfId.value;
    let toUserId = Number(chatId.value);
  
    const messageId = `msg_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const content = textInput.value;
    const localMsg = {
      id: messageId,
      senderId: fromUserId,
      receiverId: toUserId,
      content,
      messageType: 1,
      createdAt: new Date().toISOString(),
      isSelf: true,
      status: "sending",
      isLocal: true,
    };
    messages.value.push(localMsg);
    scrollToBottom();
    saveMessagesToCache();
    textInput.value = "";
  
    const messagePayload = {
      category: "PRIVATE_CHAT",
      messageId,
      timestamp: Date.now(),
      payload: {
        receiveUserId: toUserId,
        content,
        messageType: 1,
      },
      metadata: {},
    };
    socketTask.send({
      data: JSON.stringify(messagePayload),
      success: () => {
        try {
          pollingManager.triggerPollingCallback &&
            pollingManager.triggerPollingCallback("chat-list-sessions");
        } catch (e) {
          console.error("[调试] 触发会话列表轮询失败", e);
        }
      },
      fail: (err) => {
        uni.showToast({ title: "消息发送失败", icon: "none" });
      },
    });
  };
  
  // WebSocket 核心逻辑
  function closeWebSocket() {
    if (socketTask) {
      try {
        socketTask.close();
      } catch (e) {}
      socketTask = null;
      isSocketOpen.value = false;
      // 通知WebSocket管理器连接断开
      websocketManager.setConnectionStatus(false);
    }
  }
  
  const connectWebSocket = () => {
    // 防重复连接：如果已连接则不再创建
    if (socketTask && isSocketOpen.value) {
      return;
    }
    closeWebSocket();
  
    const token = getCurrentToken() || "";
    if (!token) {
      console.error("聊天需要认证，但未找到token");
      uni.showToast({ title: "请先登录", icon: "none" });
      // 没有token时通知WebSocket管理器连接断开
      websocketManager.setConnectionStatus(false);
      return;
    }
  
    // 校验 chatId
    if (!chatId.value) {
      console.error("[调试] WebSocket连接失败：chatId 无效！");
      uni.showToast({ title: "会话参数错误", icon: "none" });
      websocketManager.setConnectionStatus(false);
      return;
    }
  
    const conversationId = chatId.value;
    const url = `${UNI_APP.WS_URL}/websocket/message?token=${encodeURIComponent(
      token
    )}&conversationId=${conversationId}`;
  
    try {
      socketTask = uni.connectSocket({
        url: url,
        success: () => {},
        fail: (err) => {
          websocketManager.setConnectionStatus(false);
        },
      });
  
      if (!socketTask) {
        websocketManager.setConnectionStatus(false);
        return;
      }
  
      socketTask.onOpen(() => {
        isSocketOpen.value = true;
        // 通知WebSocket管理器连接成功
        websocketManager.setConnectionStatus(true, conversationId);
  
        // 发送初始连接消息
        const initMessage = {
          category: "CONNECTION",
          messageId: "init_" + Date.now(),
          timestamp: Date.now(),
          payload: {
            type: "connect",
            conversationId: conversationId,
          },
        };
  
        try {
          socketTask.send({
            data: JSON.stringify(initMessage),
          });
        } catch (error) {}
      });
  
      socketTask.onClose((e) => {
        isSocketOpen.value = false;
        socketTask = null;
        // 通知WebSocket管理器连接断开
        websocketManager.setConnectionStatus(false);
      });
  
      socketTask.onError((err) => {
        isSocketOpen.value = false;
        socketTask = null;
        // 通知WebSocket管理器连接断开
        websocketManager.setConnectionStatus(false);
      });
  
      socketTask.onMessage((res) => {
        if (
          typeof res.data === "string" &&
          (res.data.trim().startsWith("{") || res.data.trim().startsWith("["))
        ) {
          try {
            const newMessage = JSON.parse(res.data);
            if (newMessage && typeof newMessage === "object") {
              // 处理连接确认消息
              if (newMessage.category === "CONNECTION_ACK") {
                return;
              }
  
              // 处理消息确认
              if (newMessage.category === "MESSAGE_CONFIRM") {
                const messageId = newMessage.payload?.messageId;
                if (messageId) {
                  // 更新本地消息状态为已确认
                  const msgIndex = messages.value.findIndex(
                    (m) => m.id === messageId
                  );
                  if (msgIndex !== -1) {
                    messages.value[msgIndex].status = "confirmed";
                    messages.value[msgIndex].isLocal = false; // 不再是本地消息
                    messages.value[msgIndex].chatMessageId =
                      newMessage.payload.messageId; // 保存服务器消息ID
                    saveMessagesToCache();
                  }
                }
                return;
              }
  
              // 处理错误消息
              if (newMessage.category === "MESSAGE_ERROR") {
                const messageId = newMessage.messageId;
                if (messageId) {
                  const msgIndex = messages.value.findIndex(
                    (m) => m.id === messageId
                  );
                  if (msgIndex !== -1) {
                    messages.value[msgIndex].status = "failed";
                    saveMessagesToCache();
                  }
                }
                uni.showToast({
                  title: newMessage.payload?.content || "消息发送失败",
                  icon: "none",
                });
                return;
              }
  
              // 处理私聊消息推送
              if (newMessage.category === "PRIVATE_CHAT") {
                // 只处理属于当前会话的消息
                const payload = newMessage.payload || {};
                if (
                  (payload.senderId === selfId.value &&
                    payload.receiveUserId === Number(chatId.value)) ||
                  (payload.senderId === Number(chatId.value) &&
                    payload.receiveUserId === selfId.value)
                ) {
                  const receivedMessage = {
                    id: newMessage.messageId || `server_${Date.now()}`,
                    senderId: payload.senderId,
                    receiverId: payload.receiveUserId,
                    content: payload.content,
                    messageType: payload.messageType,
                    createdAt: payload.createdAt || new Date().toISOString(),
                    isSelf: payload.senderId === selfId.value,
                    status: "received",
                    isLocal: false,
                    chatMessageId: payload.messageId,
                  };
                  messages.value.push(receivedMessage);
                  scrollToBottom();
                  saveMessagesToCache();
                }
                return;
              }
            } else {
            }
          } catch (error) {}
        } else {
        }
      });
    } catch (error) {
      websocketManager.setConnectionStatus(false);
    }
  };
  
  // 轮询获取新消息 - 移除原有的轮询逻辑，使用轮询管理器
  const startMessagePolling = () => {
    // 这个方法现在由轮询管理器统一管理，不再需要手动调用
  };
  
  const stopMessagePolling = () => {
    // 这个方法现在由轮询管理器统一管理，不再需要手动调用
  };
  
  // 检查新消息 - 保持原有逻辑，但由轮询管理器调用
  const checkNewMessages = async () => {
    try {
      if (!chatId.value) return;
      const token = getCurrentToken();
      if (!token) return;
      let fromUserId = selfId.value;
      let toUserId = Number(chatId.value);
      const response = await new Promise((resolve, reject) => {
        uni.request({
          url: `${UNI_APP.BASE_URL}/message/private/newMessages`,
          method: "GET",
          data: {
            fromUserId,
            toUserId,
            lastMessageId: lastMessageId.value,
            limit: 20,
            chatId: chatId.value,
          },
          header: { Authorization: `Bearer ${token}` },
          success: (res) => resolve(res),
          fail: (err) => reject(err),
        });
      });
      if (response.statusCode === 200 && response.data.code === 200) {
        const newMessages = response.data.data || [];
        newMessages.forEach((msg) => {
          const messageObj = {
            id: `msg_${msg.chatMessageId}`,
            chatMessageId: msg.chatMessageId,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            messageType: msg.msgType,
            createdAt: msg.sendTime,
            isSelf: msg.senderId === selfId.value,
            status: "received",
            isLocal: false,
          };
          // 只保留双方的消息
          if (
            (messageObj.senderId === fromUserId &&
              messageObj.receiverId === toUserId) ||
            (messageObj.senderId === toUserId &&
              messageObj.receiverId === fromUserId)
          ) {
            const exists = messages.value.find(
              (m) => m.chatMessageId === msg.chatMessageId
            );
            if (!exists) {
              messages.value.push(messageObj);
              lastMessageId.value = Math.max(
                lastMessageId.value,
                msg.chatMessageId
              );
            }
          }
        });
        scrollToBottom();
        saveMessagesToCache();
      }
    } catch (error) {}
  };
  
  // --- 辅助函数 ---
  const goBack = () => {
    uni.navigateBack();
  };
  
  const handleMore = () => {
    uni.showToast({
      title: "更多功能开发中",
      icon: "none",
    });
  };
  
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollTop.value = scrollTop.value + 9999;
    }, 100);
  };
  
  const manualReconnect = () => {
    uni.showToast({ title: "正在重新连接...", icon: "loading" });
    connectWebSocket();
  };
  
  // 显示调试信息
  const showDebugInfo = () => {
    const debugInfo = {
      chatId: chatId.value,
      selfId: selfId.value,
      isSocketOpen: isSocketOpen.value,
      isPolling: isPolling.value,
      hasSocketTask: !!socketTask,
      baseUrl: UNI_APP.BASE_URL,
      wsUrl: UNI_APP.WS_URL,
      hasToken: !!getCurrentToken(),
    };
  
    uni.showModal({
      title: "调试信息",
      content: JSON.stringify(debugInfo, null, 2),
      showCancel: false,
    });
  };
  
  // 检查连接状态
  const checkConnectionStatus = () => {
    websocketManager.setConnectionStatus(isSocketOpen.value, chatId.value);
  };
  
  // 在消息渲染前加日志（setup末尾）
  watch(messages, (val) => {
    console.log(
      "[调试] 消息 senderId/selfId 类型和值:",
      val.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        senderIdType: typeof m.senderId,
        selfId: selfId.value,
        selfIdType: typeof selfId.value,
        content: m.content,
      }))
    );
  });
  
  const FIVE_MINUTES = 5 * 60 * 1000;
  const messageListWithTimeTips = computed(() => {
    const result = [];
    let lastTime = null;
    messages.value.forEach((msg, idx) => {
      const msgTime = new Date(msg.createdAt || msg.sendTime).getTime();
      if (idx === 0 || (lastTime && msgTime - lastTime > FIVE_MINUTES)) {
        result.push({
          type: "time-tip",
          time: msgTime,
          id: `time_${msgTime}_${idx}`,
        });
      }
      result.push({
        type: "message",
        ...msg,
      });
      lastTime = msgTime;
    });
    return result;
  });
  </script>
  
  <style lang="scss" scoped>
  @import "./static/fonts/iconfont.css";
  
  .chat-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f4f4f4;
  }
  
  .message-list-container {
    width: 100%;
    box-sizing: border-box;
  }
  
  .message-list-content {
    width: 100%;
  }
  
  .message-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  
  .message-row.self {
    justify-content: flex-end;
  }
  
  .input-bar-container {
    position: fixed;
    width: 100%;
    background-color: #f7f7f7;
    border-top: 1px solid #e0e0e0;
    transition: bottom 0.3s ease;
  }
  
  .input-bar {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    padding: 12rpx 20rpx;
    padding-bottom: 24rpx;
  }
  
  .textarea-container {
    flex: 1;
    margin: 0;
  }
  
  .textarea-scroll-view {
    max-height: 160rpx;
  }
  
  .input-textarea {
    width: 100%;
    background-color: #fff;
    border-radius: 12rpx;
    border: 1px solid #c7c7c7;
    padding: 18rpx 20rpx;
    font-size: 32rpx;
    line-height: 1.5;
  }
  
  .action-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
    margin-left: 20rpx;
  }
  
  .icon {
    font-size: 44rpx;
    color: #339af0;
    transform: translateY(-14rpx);
  }
  
  .send-button {
    width: 120rpx;
    height: 68rpx;
    line-height: 68rpx;
    background-color: #339af0;
    color: #fff;
    border-radius: 12rpx;
    font-size: 28rpx;
    padding: 0;
    margin: 6rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
  
    &::after {
      border: none;
    }
  }
  
  .connection-status {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10rpx 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
  
    .status-info {
      flex: 1;
    }
  
    .status-text {
      font-size: 28rpx;
      color: #333;
    }
  
    .status-detail {
      font-size: 24rpx;
      color: #666;
    }
  
    .reconnect-btn {
      background-color: #339af0;
      color: #fff;
      border: none;
      border-radius: 12rpx;
      padding: 8rpx 20rpx;
      font-size: 28rpx;
    }
  }
  
  .time-tip-bar {
    width: 100%;
    text-align: center;
    color: #b3b3b3;
    font-size: 26rpx;
    margin: 18rpx 0 0 0;
    padding: 0 0 10rpx 0;
  }
  </style>
  