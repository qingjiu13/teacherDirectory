<template>
  <template v-if="message.content && message.content.trim() !== ''">
    <view class="message-wrapper" :class="{ self: isSelfMsg }">
      <view class="bubble-row" :class="{ self: isSelfMsg }">
        <image
          v-if="!isSelfMsg"
          class="avatar"
          :src="avatarSrc"
          mode="aspectFill"
        />
        <view class="message-bubble">
          <text class="message-text">{{ message.content }}</text>
        </view>
        <image
          v-if="isSelfMsg"
          class="avatar"
          :src="avatarSrc"
          mode="aspectFill"
        />
      </view>
    </view>
  </template>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from "vue";
const ADMIN_ID = 1;
// 默认头像路径
const DEFAULT_AVATAR = {
  ai: "/static/image/defaultAvatar/kefu.png",
  student: "/static/image/defaultAvatar/student-man.png",
  teacher: "/static/image/defaultAvatar/teacher-man.png",
  user: "/static/image/defaultAvatar/student-man.png",
};
const props = defineProps({
  message: { type: Object, required: true },
  isSelf: { type: Boolean, default: false },
});
const isAssistantMsg = computed(() => {
  return (
    props.message.senderId == ADMIN_ID || props.message.senderId === "admin"
  );
});
const avatarSrc = computed(() => {
  // 小助手消息和欢迎语都用固定头像
  if (isAssistantMsg.value) return DEFAULT_AVATAR.ai;
  if (props.message.avatar) return props.message.avatar;
  if (props.message.role === "teacher") return DEFAULT_AVATAR.teacher;
  return DEFAULT_AVATAR.user;
});
const spacerWidth = ref(48);
const nicknameRef = ref(null);
const updateSpacer = () => {
  if (nicknameRef.value && nicknameRef.value.offsetWidth) {
    spacerWidth.value = 40 + 8 + nicknameRef.value.offsetWidth;
  } else {
    spacerWidth.value = 48;
  }
};
onMounted(() => {
  nextTick(updateSpacer);
});
watch(
  () => props.message.nickname,
  () => nextTick(updateSpacer)
);
const isWelcomeMsg = computed(() => {
  // 判断是否为小助手欢迎语（可根据id或内容）
  return (
    props.message.id === "welcome" ||
    (props.message.senderId == ADMIN_ID &&
      typeof props.message.content === "string" &&
      props.message.content.includes("小助手") &&
      props.message.content.includes("帮"))
  );
});
const isSelfMsg = computed(() => {
  // 欢迎语强制左侧显示，其余按原逻辑
  if (isWelcomeMsg.value) return false;
  return props.isSelf;
});
</script>

<style lang="scss" scoped>
.message-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 30rpx;
  position: relative;

  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 10rpx;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: top;
  }
  .bubble-row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 0;
    width: 100%;
    position: relative;
  }
  .bubble-row.self {
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
  }
  .bubble-spacer {
    flex-shrink: 0;
    height: 2rpx;
  }
  .message-bubble {
    position: relative;
    background: #fff;
    border-radius: 16rpx;
    box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
    padding: 20rpx 24rpx;
    max-width: 70vw;
    word-break: break-all;
    overflow: visible;
    font-size: 32rpx;
    line-height: 1.5;
  }
  .message-bubble::before {
    content: " ";
    position: absolute;
    top: 24rpx;
    left: -16rpx;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 12rpx 16rpx 12rpx 0;
    border-color: transparent #ffffff transparent transparent;
  }
}
.message-wrapper.self {
  align-items: flex-end;
  .message-bubble {
    background: #d0ebff;
    margin-right: 16rpx;
    margin-left: 0;
  }
  .message-bubble::before {
    content: " ";
    position: absolute;
    top: 24rpx;
    right: -16rpx;
    left: auto;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 12rpx 0 12rpx 16rpx;
    border-color: transparent transparent transparent #d0ebff;
  }
}
</style>
