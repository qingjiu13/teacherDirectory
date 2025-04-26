<template>
  <view class="container">
    <text class="title">你的身份是：</text>

    <view class="card" @click="selectIdentity('student')">
      <view class="card-content">
        <image class="card-image" src="/static/image/tab-bar/default_avatar.png" mode="aspectFit" />
        <text class="card-text">我是同学~</text>
      </view>
    </view>

    <view class="card" @click="selectIdentity('teacher')">
      <view class="card-content">
        <image class="card-image" src="/static/image/tab-bar/default_avatar.png" mode="aspectFit" />
        <text class="card-text">我是老师~</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { Navigator } from '../../router/Router';
import store from '../../store' 

/**
 * 选择用户身份并更新到Vuex中
 * @param {string} identity - 用户身份类型 ('student'或'teacher')
 */
function selectIdentity(identity) {
  console.log("选中的身份是:", identity);
  // 更新vuex中的角色信息
  const role = identity === 'student' ? '学生' : '老师';
  store.commit('user/baseInfo/updateRole', role);
  Navigator.toLoginDetail();
}
</script>

<style scoped>
.container {
  padding: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 60rpx;
}

.card {
  border: 1px solid #ccc;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 40rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}

.card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.card-image {
  width: 140rpx;
  height: 140rpx;
  background-color: #f0f0f0;
  border-radius: 10rpx;
  margin-right: 30rpx;
}

.card-text {
  font-size: 32rpx;
}
</style>
