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

<script>
import { Navigator } from '../../router/Router';
import store from '../../store' 

export default {
  methods: {
    /**
     * 选择用户身份并更新到Vuex中
     * @param {string} identity - 用户身份类型 ('student'或'teacher')
     */
    selectIdentity(identity) {
      console.log("选中的身份是:", identity);
      
      try {
        // 直接使用导入的store实例调用mutation
        // 传递英文的角色代码，让mutation内部处理角色名称转换
        store.commit('user/baseInfo/updateRole', identity);
        
        // 导航到下一页
        Navigator.toLoginDetail();
      } catch (error) {
        console.error('选择身份时出错:', error);
        uni.showToast({
          title: '系统错误，请重试',
          icon: 'none'
        });
      }
    }
  }
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
