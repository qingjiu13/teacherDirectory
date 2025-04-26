<template>
  <view class="login-container">
    <!-- 顶部背景图 -->
    <view class="header-bg">
      <image class="bg-image" src="/static/image/login_qianduan_test.png" mode="widthFix"></image>
    </view>
    
    <!-- 内容区域 -->
    <view class="content">
      <!-- 欢迎文案 -->
      <view class="welcome-text">
        <text class="title">欢迎使用</text>
        <text class="subtitle">请先登录以享受完整服务</text>
      </view>
      
      <!-- 用户头像占位 -->
      <view class="avatar-container">
        <image class="avatar" :src="userInfo.avatarUrl || '/static/image/tab-bar/default_avatar.png'" mode="aspectFill"></image>
        <text class="nickname" v-if="userInfo.nickName">{{userInfo.nickName}}</text>
        <text class="nickname" v-else>未登录</text>
      </view>
      
      <!-- 微信登录按钮 -->
      <button class="login-btn" open-type="getUserInfo" @getuserinfo="onGetUserInfo" v-if="!hasLogin">
        <image class="wechat-icon" src="/static/image/tab-bar/default_avatar.png"></image>
        <text>微信一键登录</text>
      </button>
      
      <!-- 已登录状态 -->
      <button class="login-btn logged-in" v-else @click="toHome">
        <text>进入应用</text>
      </button>
      
      <!-- 协议声明 -->
		<view class="agreement">
		  <text>登录即表示同意</text>
		  <view class="link-group">
			<text class="link" @click="showAgreement">《用户协议》</text>
			<text>和</text>
			<text class="link" @click="showPrivacy">《隐私政策》</text>
		  </view>
		</view>
    </view>
    

  </view>
</template>

<script>
	
import { Navigator } from '../../router/Router';
	
export default {
  data() {
    return {
      hasLogin: false,
      userInfo: {
        nickName: '',
        avatarUrl: ''
      }
    }
  },
  onLoad() {
    this.checkLoginStatus();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const userInfo = uni.getStorageSync('userInfo');
      const token = uni.getStorageSync('token');
      
      if (userInfo && token) {
        this.userInfo = userInfo;
        this.hasLogin = true;
      }
    },
    
    // 获取用户信息
    onGetUserInfo(e) {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        // 用户授权成功
        this.userInfo = e.detail.userInfo;
        this.loginWithWechat();
      } else {
        // 用户拒绝授权
        uni.showToast({
          title: '您已拒绝授权',
          icon: 'none'
        });
      }
    },
    
    // 微信登录
    loginWithWechat() {
      uni.showLoading({
        title: '登录中...'
      });
      
      // 这里替换为你的实际登录逻辑
      // 1. 调用微信登录接口获取code
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          // 2. 将code发送到你的后端服务器获取token
          // 这里模拟一个登录请求
          setTimeout(() => {
            uni.hideLoading();
            
            // 模拟登录成功
            const token = 'mock_token_' + Date.now();
            uni.setStorageSync('token', token);
            uni.setStorageSync('userInfo', this.userInfo);
            
            this.hasLogin = true;
            
            uni.showToast({
              title: '登录成功',
              icon: 'success'
            });
            
            // 登录成功后跳转首页
            this.toHome();
          }, 1500);
        },
        fail: (err) => {
          uni.hideLoading();
          uni.showToast({
            title: '登录失败',
            icon: 'none'
          });
          console.error('微信登录失败:', err);
        }
      });
    },
    
    // 跳转首页
    toHome() {
		Navigator.toLogin()
    },
    
    // 显示用户协议
    showAgreement() {
      uni.navigateTo({
        url: '/pages/agreement/index?type=user'
      });
    },
    
    // 显示隐私政策
    showPrivacy() {
      uni.navigateTo({
        url: '/pages/agreement/index?type=privacy'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  
  .header-bg {
    width: 100%;
    height: 300rpx;
    position: relative;
    
    .bg-image {
      width: 100%;
      height: 100%;
    }
  }
  
  .content {
    flex: 1;
    padding: 0 60rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .welcome-text {
      margin-top: 40rpx;
      margin-bottom: 80rpx;
      text-align: center;
      
      .title {
        display: block;
        font-size: 48rpx;
        font-weight: bold;
        color: #333;
      }
      
      .subtitle {
        display: block;
        font-size: 28rpx;
        color: #999;
        margin-top: 20rpx;
      }
    }
    
    .avatar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 80rpx;
      
      .avatar {
        width: 140rpx;
        height: 140rpx;
        border-radius: 50%;
        border: 4rpx solid #fff;
        box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
      }
      
      .nickname {
        margin-top: 20rpx;
        font-size: 32rpx;
        color: #333;
      }
    }
    
    .login-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      border-radius: 45rpx;
      background: linear-gradient(to right, #07C160, #09BB07);
      color: #fff;
      font-size: 32rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      box-shadow: 0 10rpx 20rpx rgba(7, 193, 96, 0.3);
      
      &.logged-in {
        background: linear-gradient(to right, #1989fa, #3194fa);
        box-shadow: 0 10rpx 20rpx rgba(25, 137, 250, 0.3);
      }
      
      .wechat-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 15rpx;
      }
    }
    
.agreement {
  margin-top: 40rpx;
  font-size: 24rpx;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;

  .link-group {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 6rpx; // 控制《用户协议》和之间的间距
    margin-left: 8rpx;
  }

  .link {
    color: #1989fa;
  }
}
  }
  
}
</style>