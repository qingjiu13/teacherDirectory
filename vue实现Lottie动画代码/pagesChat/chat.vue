<template>
  <view class="chat-list-page">
    <view class="scroll-wrapper">
      <view class="nav-search">
        <uni-search-bar
          :focus="false"
          radius="100"
          v-model="searchText"
          cancelButton="none"
          placeholder="搜索"
          @input="onSearchInput"
        ></uni-search-bar>
      </view>
      <!-- 消息列表 -->
      <scroll-view class="message-scroll-view" scroll-y>
        <view v-if="filteredChats.length === 0" class="empty-tip">
          {{ keyword ? `没有找到与"${keyword}"相关的结果` : "暂无消息" }}
        </view>
        <view v-else>
          <chat-item
            v-for="chat in filteredChats"
            :key="chat.id"
            :chat="chat"
            @click="goToChat(chat)"
          ></chat-item>
        </view>
      </scroll-view>
    </view>

    <!-- 底部导航栏 -->
    <tab-bar class="tab-bar-container" pageName="message"></tab-bar>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ChatItem from "./components/chat-item/chat-item.vue";
import TabBar from "./components/tab-bar/tab-bar.vue";
// import { http } from "./common/http.js";
import { apiRequest,getCurrentUserId } from "@/store/user/JWT.js";
import pollingManager from "@/utils/pollingManager.js";
import { useGlobalStore } from "@/store/global.js";
const getApiPrefix = () => {
    const globalStore = useGlobalStore()
    return globalStore.apiBaseUrl
}
const searchText = ref("");

// 真实聊天列表数据
const chats = ref([]);

// 添加keyword变量
const keyword = computed(() => searchText.value);

const ADMIN_ID = 1;

/**
 * 获取会话列表
 * @async
 * @function fetchChatSessions
 * @description 从服务器获取用户的聊天会话列表，支持客服端和普通用户端两种模式
 * @returns {Promise<void>} 无返回值，直接更新chats.value
 * @throws {Error} 当API请求失败时抛出错误
 */
const fetchChatSessions = async () => {
  try {
    console.log("[调试] 开始获取会话列表");
    
    // 使用 apiRequest 发送请求
    const response = await apiRequest(
      `${getApiPrefix()}/yanshilu/chatMessage/sessionList`,
      "GET",
      {},
      {
        requireAuth: true,
        showError: false // 手动处理错误提示
      }
    );
    
    console.log("[调试] apiRequest 响应:", response);
    
    // 检查请求是否成功
    if (!response.success) {
      throw new Error(response.message || "获取会话列表失败");
    }
    
    let sessionList = [];
    const responseData = response.data;
    
    // 兼容后端返回的各种结构
    if (Array.isArray(responseData)) {
      sessionList = responseData;
    } else if (Array.isArray(responseData?.rows)) {
      sessionList = responseData.rows;
    } else if (responseData && Array.isArray(responseData.data)) {
      sessionList = responseData.data;
    } else if (responseData?.rows) {
      // 兼容微信小程序对象
      sessionList = Object.values(responseData.rows);
    }
    
    // 强制转为标准数组，兼容uniapp/小程序环境
    if (!Array.isArray(sessionList)) {
      sessionList = Object.values(sessionList || {});
    }
    
    console.log("[调试] sessionList 转换后:", sessionList);
    
    // === 调试代码开始 ===
    sessionList.forEach((item, idx) => {
      console.log(`[调试] session item[${idx}]:`, JSON.stringify(item));
    });
    // === 调试代码结束 ===

    const currentUserId = getCurrentUserId();
    console.log("[调试] 当前用户ID:", currentUserId);
    console.log("[调试] 当前用户ID类型:", typeof currentUserId);
    console.log("[调试] ADMIN_ID:", ADMIN_ID);
    console.log("[调试] ADMIN_ID类型:", typeof ADMIN_ID);
    console.log("[调试] 是否相等:", currentUserId === ADMIN_ID);

    if (currentUserId === ADMIN_ID) {
      console.log("[调试] 进入客服端逻辑");
      // 客服端：chatId用对方用户ID，无论谁发的消息
      sessionList.forEach((item) => {
        // 对方用户ID
        item.chatId =
          item.senderId === ADMIN_ID ? item.receiverId : item.senderId;
        // 防御性昵称策略，优先用对方昵称和用户名
        item.showName =
          item.chat_user_nick_name ||
          item.chatUserNickName ||
          item.chat_user_user_name ||
          item.chatUserUserName ||
          "匿名用户";
        // 头像优先用对方头像
        item.headImage =
          item.chat_user_avatar ||
          item.senderPicture ||
          item.receiverPicture ||
          "/static/image/defaultAvatar/student-man.png";
        item.lastContent = item.content || "";
        item.lastSendTime = item.sendTime || "";
        item.id = item.chatMessageId;
      });
      chats.value = sessionList.filter(
        (item) => item.chatId && item.chatId !== ADMIN_ID
      );
      console.log("[调试] 客服端会话列表:", chats.value);
    } else {
      console.log("[调试] 进入普通用户端逻辑");
      console.log("[调试] sessionList 数据:", sessionList);
      console.log(
        "[调试] currentUserId:",
        currentUserId,
        "类型:",
        typeof currentUserId
      );
      console.log("[调试] ADMIN_ID:", ADMIN_ID, "类型:", typeof ADMIN_ID);

      // 普通用户端：处理sessionList数据，显示与客服的真实会话
      if (sessionList && sessionList.length > 0) {
        // 找到与客服的会话
        const customerServiceSession = sessionList.find((item) => {
          console.log("[调试] 检查会话项:", item);
          console.log(
            "[调试] item.senderId:",
            item.senderId,
            "类型:",
            typeof item.senderId
          );
          console.log(
            "[调试] item.receiverId:",
            item.receiverId,
            "类型:",
            typeof item.receiverId
          );
          const isMatch =
            (item.senderId === ADMIN_ID && item.receiverId === currentUserId) ||
            (item.senderId === currentUserId && item.receiverId === ADMIN_ID);
          console.log("[调试] 是否匹配:", isMatch);
          return isMatch;
        });

        console.log("[调试] 找到的客服会话:", customerServiceSession);

        if (customerServiceSession) {
          // 使用真实的后端数据
          chats.value = [
            {
              id: customerServiceSession.chatMessageId || 1,
              chatId: ADMIN_ID,
              showName: "小助手",
              headImage: "/static/image/defaultAvatar/kefu.png",
              lastContent:
                customerServiceSession.content || "您好，请问有什么可以帮您？",
              lastSendTime: customerServiceSession.sendTime || Date.now(),
              unreadCount: 0,
            },
          ];
        } else {
          console.log("[调试] 未找到客服会话，创建默认会话");
          // 如果没有找到会话，创建默认会话
          chats.value = [
            {
              id: 1,
              chatId: ADMIN_ID,
              showName: "小助手",
              headImage: "/static/image/defaultAvatar/kefu.png",
              lastContent: "您好，请问有什么可以帮您？",
              lastSendTime: Date.now(),
              unreadCount: 0,
            },
          ];
        }
      } else {
        console.log("[调试] sessionList为空，创建默认会话");
        // 如果sessionList为空，创建默认会话
        chats.value = [
          {
            id: 1,
            chatId: ADMIN_ID,
            showName: "小助手",
            headImage: "/static/image/defaultAvatar/kefu.png",
            lastContent: "您好，请问有什么可以帮您？",
            lastSendTime: Date.now(),
            unreadCount: 0,
          },
        ];
      }
      console.log("[调试] 普通用户端会话列表:", chats.value);
    }
    sortChats();
  } catch (error) {
    console.error("[调试] 获取会话失败:", error);
    
    // 显示错误提示
    uni.showToast({ 
      title: error.message || "获取会话失败", 
      icon: "none",
      duration: 2000
    });
    
    // 如果API调用失败，创建默认的小助手会话
    const currentUserId = getCurrentUserId();
    chats.value = [
      {
        id: 1,
        chatId: ADMIN_ID, // 小助手ID
        showName: "小助手",
        headImage: "/static/image/defaultAvatar/kefu.png",
        lastContent: "您好，请问有什么可以帮您？",
        lastSendTime: Date.now(),
        unreadCount: 0,
      },
    ];
    
    console.log("[调试] 使用默认会话列表:", chats.value);
  }
};

// 轮询检查新会话
const checkNewSessions = async () => {
  // try {
  //   console.log("[轮询] 检查新会话");
  //   await fetchChatSessions();
  // } catch (error) {
  //   console.error("[轮询] 检查新会话失败:", error);
  // }
};

// 排序聊天列表
const sortChats = () => {
  chats.value.sort((a, b) => {
    // 小助手置顶
    if (a.showName === "小助手") return -1;
    if (b.showName === "小助手") return 1;
    // 其他按时间倒序
    return new Date(b.lastSendTime) - new Date(a.lastSendTime);
  });
};

onMounted(() => {
  fetchChatSessions();

  // 设置当前页面为chat-list
  pollingManager.setCurrentPage("chat-list");

  // 注册轮询回调
  pollingManager.registerPollingCallback(
    "chat-list-sessions",
    checkNewSessions
  );
});

// 页面显示时更新轮询状态 - 使用uni-app的页面生命周期
const onShow = () => {
  // 设置当前页面为chat-list
  pollingManager.setCurrentPage("chat-list");
};

// 页面隐藏时停止轮询 - 使用uni-app的页面生命周期
const onHide = () => {
  // 如果离开chat-list页面，设置页面为other
  pollingManager.setCurrentPage("other");
};

// 页面卸载时清理 - 使用uni-app的页面生命周期
const onUnload = () => {
  // 注销轮询回调
  pollingManager.unregisterPollingCallback("chat-list-sessions");

  // 设置页面为other
  pollingManager.setCurrentPage("other");
};

const filteredChats = computed(() => {
  if (!searchText.value) {
    return chats.value;
  }
  const lowerCaseKeyword = searchText.value.toLowerCase();
  return chats.value.filter(
    (chat) =>
      (chat.showName &&
        chat.showName.toLowerCase().includes(lowerCaseKeyword)) ||
      (chat.lastContent &&
        chat.lastContent.toLowerCase().includes(lowerCaseKeyword))
  );
});

const goToChat = (chat) => {
  if (!chat.chatId) {
    uni.showToast({ title: "会话ID无效", icon: "none" });
    return;
  }
  uni.navigateTo({
    url: `/pagesChat/chat-box?id=${chat.chatId}&title=${encodeURIComponent(
      chat.showName
    )}&avatar=${encodeURIComponent(chat.headImage)}`,
  });
};

// 添加搜索输入处理函数
const onSearchInput = (value) => {
  // 搜索逻辑已经在computed中处理，这里可以添加额外的搜索逻辑
  console.log("[搜索] 搜索关键词:", value);
};

function goBack() {
  uni.navigateBack();
}

// 导出uni-app页面生命周期函数
defineExpose({
  onShow,
  onHide,
  onUnload,
});
</script>

<style lang="scss" scoped>
.chat-list-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f8f8;
  padding-top: 110rpx;
}

.scroll-wrapper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.nav-search {
  width: 60vw;
  margin-left: 40rpx;
  margin-bottom: 32rpx;
}
::v-deep .uni-searchbar {
  background: #f5f6fa;
  border-radius: 16rpx;
  border: 1px solid #e0e0e0;
  min-height: 64rpx;
  height: 64rpx;
  box-shadow: none;
  padding: 0;
}
::v-deep .uni-searchbar__box {
  background: #f5f6fa;
  border-radius: 16rpx;
  border: none;
  min-height: 64rpx;
  height: 64rpx;
  box-shadow: none;
  padding-left: 12rpx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
::v-deep .uni-searchbar__input {
  font-size: 28rpx;
  color: #333;
  background: transparent;
  text-align: left;
  padding-left: 0;
}
::v-deep .uni-searchbar__icon-search {
  margin-left: 0;
  text-align: left;
}

.message-scroll-view {
  flex: 1;
  background-color: #fff;
}

.empty-tip {
  color: #999;
  text-align: center;
  padding-top: 200rpx;
  font-size: 28rpx;
}

.tab-bar-container {
  height: 120rpx;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
}
</style>
