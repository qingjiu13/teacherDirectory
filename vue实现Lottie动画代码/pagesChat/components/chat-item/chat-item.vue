<template>
  <view class="chat-item" @click="showChatBox" :class="{ active: active }">
    <view class="avatar-section">
      <head-image
        :url="chat.headImage"
        :name="chat.showName"
        :size="96"
      ></head-image>
      <view v-if="chat.unreadCount > 0" class="unread-badge-container">
        <uni-badge
          :text="chat.unreadCount"
          type="error"
          :max-num="99"
          size="small"
        ></uni-badge>
      </view>
    </view>

    <view class="content-section">
      <view class="content-top">
        <text class="name">{{ chat.showName }}</text>
        <text class="time">{{ formatTime(chat.lastSendTime, true) }}</text>
      </view>
      <view class="content-bottom">
        <text class="message" :class="{ 'at-text': atText }">{{
          atText || chat.lastContent
        }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { toTimeText } from "../../common/date.js";
import HeadImage from "/pagesChat/components/head-image/head-image";

const props = defineProps({
  chat: Object,
  active: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const formatTime = (timestamp, simple) => {
  if (!timestamp) return "";
  return toTimeText(timestamp, simple);
};

const showChatBox = () => {
  emit("click");
};

const atText = computed(() => {
  if (props.chat.atMe) return "[有人@我]";
  if (props.chat.atAll) return "[@全体成员]";
  return "";
});
</script>

<style scoped lang="scss">
.chat-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24rpx 30rpx;
  background-color: #fff;
  transition: background-color 0.2s;
  border-bottom: 1px solid #efefef;

  &:active {
    background-color: #f7f7f7;
  }
}

.avatar-section {
  position: relative;
  margin-right: 24rpx;

  .unread-badge-container {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    ::v-deep .uni-badge {
      font-size: 20rpx;
      line-height: 1.4;
    }
  }
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  text-align: left;
}

.content-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 12rpx;

  .name {
    font-size: 34rpx;
    color: #1a1a1a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
  }

  .time {
    font-size: 24rpx;
    color: #b3b3b3;
    padding-left: 20rpx;
    white-space: nowrap;
    flex-shrink: 0;
  }
}

.content-bottom {
  text-align: left;
  .message {
    font-size: 28rpx;
    color: #999999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.at-text {
      color: #e64340;
    }
  }
}
</style>
