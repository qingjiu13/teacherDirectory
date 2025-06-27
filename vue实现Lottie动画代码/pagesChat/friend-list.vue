<template>
  <view class="friend-list-page">
    <view class="header">消息会话</view>
    <view class="friend-list">
      <!-- 调试：直接显示 friendList 的 JSON 内容 -->
      <view style="font-size: 24rpx; color: #333; padding: 20rpx">{{
        friendList
      }}</view>
      <friend-item
        v-for="item in friendList"
        :key="item.id"
        :friend="item"
        @click.native="goChat(item)"
      />
      <view v-if="friendList.length === 0" class="empty-tip">暂无会话</view>
    </view>
  </view>
</template>

<script>
import FriendItem from "./components/friend-item/friend-item.vue";
import { getCurrentUserId } from "./store/user/JWT.js";
export default {
  name: "FriendList",
  components: { FriendItem },
  data() {
    return {
      friendList: [],
      selfId: getCurrentUserId() || 1, // 当前登录用户id
      isCustomerService: false,
    };
  },
  created() {
    this.isCustomerService = this.selfId == 1;
    // this.loadSessionList(); // 暂时注释掉自动轮询，便于调试
  },
  methods: {
    async loadSessionList() {
      try {
        const ADMIN_ID = 1;
        if (this.selfId === ADMIN_ID) {
        }

        const res = await uni.request({
          url: "/yanshilu/chatMessage/sessionList",
          method: "GET",
          header: {
            Authorization: `Bearer ${uni.getStorageSync("jwtToken")}`,
          },
        });

        // 聚合会话，字段名全部用下划线风格
        const userMap = new Map();
        const messages = res.data.data || res.data.rows || [];

        // 打印原始消息数据
        console.log("消息列表原始数据：", messages);

        // 先清空 userMap，防止变量冲突
        userMap.clear();
        const chatUserMap = new Map();
        messages.forEach((msg) => {
          // 只要不是自己，就聚合
          let chatUserId =
            msg.sender_id === this.selfId ? msg.receiver_id : msg.sender_id;
          if (chatUserId && chatUserId !== this.selfId) {
            if (!chatUserMap.has(chatUserId)) {
              chatUserMap.set(chatUserId, []);
            }
            chatUserMap.get(chatUserId).push(msg);
          }
        });

        chatUserMap.forEach((msgList, chatUserId) => {
          // 按时间排序，取最新一条消息
          const sortedMsgs = msgList.sort(
            (a, b) => new Date(a.send_time) - new Date(b.send_time)
          );
          const lastMsg = sortedMsgs[sortedMsgs.length - 1];
          // 优先取对方的昵称和头像
          let peerMsg =
            msgList.find((m) => m.sender_id == chatUserId) || lastMsg;
          let nickName = peerMsg
            ? peerMsg.chat_user_nick_name ||
              peerMsg.chatUserNickName ||
              peerMsg.chat_user_user_name ||
              peerMsg.chatUserUserName ||
              peerMsg.sender_name ||
              peerMsg.senderName ||
              `用户${chatUserId}`
            : `用户${chatUserId}`;
          let headImage = peerMsg
            ? peerMsg.sender_picture ||
              peerMsg.senderPicture ||
              "/static/image/defaultAvatar/student-man.png"
            : "/static/image/defaultAvatar/student-man.png";
          let lastMessage = lastMsg ? lastMsg.content : "暂无消息";
          let lastTime = lastMsg ? lastMsg.send_time : null;

          userMap.set(chatUserId, {
            id: chatUserId,
            nickName,
            headImage,
            online: true,
            lastMessage,
            lastTime,
            unreadCount: 0,
          });
        });

        let list = Array.from(userMap.values());

        // 如果不是管理员，确保小助手在第一位
        if (this.selfId !== ADMIN_ID) {
          list.unshift({
            id: 1,
            nickName: "小助手",
            headImage: "/static/image/defaultAvatar/kefu.png",
            online: true,
          });
        }

        this.friendList = list;
      } catch (e) {
        uni.showToast({ title: "加载会话失败", icon: "none" });
      }
    },
    goChat(item) {
      uni.navigateTo({
        url: `/pagesChat/chat-box?id=${item.id}&title=${item.nickName}`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.friend-list-page {
  min-height: 100vh;
  background: #f4f4f4;
  .header {
    font-size: 36rpx;
    font-weight: bold;
    padding: 40rpx 30rpx 20rpx 30rpx;
    background: #fff;
    border-bottom: 1px solid #eee;
  }
  .friend-list {
    padding: 0 0 20rpx 0;
  }
  .empty-tip {
    text-align: center;
    color: #999;
    margin-top: 60rpx;
    font-size: 30rpx;
  }
}
</style>
