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
      <button class="login-btn" @click="onWxLogin" v-if="!hasLogin">
        <view class="btn-content">
          <image class="wechat-icon" src="/static/image/tab-bar/default_avatar.png"></image>
          <text class="login-text">微信一键登录</text>
        </view>
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
    
    <!-- 用户协议弹窗 -->
    <view class="modal-overlay" v-if="showAgreementModal" @click.stop="closeModal('agreement')">
      <view class="modal-content" @click.stop>
        <view class="modal-title">用户协议</view>
        <view class="modal-body">
          <view class="agreement-text">
            <view class="agreement-item">就平台使用涉及的权利和义务与您做出如下约定：</view>
            <view class="agreement-item">1、您知晓并同意，登署本协议即代表您依照本协议公布的规则履行义务并享有权利。</view>
            <view class="agreement-item">2、您同意，注册并使用本平台服务时，需遵守相关法律法规和平台规定。</view>
            <view class="agreement-item">3、您同意，在使用平台服务过程中，遵守诚实信用原则，不发布违法、虚假或侵害他人权益的信息。</view>
            <view class="agreement-item">4、本平台保留对用户资料进行审核的权利，对违反协议的用户有权封禁账号。</view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="agree-btn" @click="closeModal('agreement')">我已悉知并同意</button>
        </view>
      </view>
    </view>
    
    <!-- 隐私政策弹窗 -->
    <view class="modal-overlay" v-if="showPrivacyModal" @click.stop="closeModal('privacy')">
      <view class="modal-content" @click.stop>
        <view class="modal-title">隐私政策</view>
        <view class="modal-body">
          <view class="agreement-text">
            <view class="agreement-item">本应用非常重视用户隐私政策并严格遵守相关法律法规：</view>
            <view class="agreement-item">1、我们只会收集必要的用户信息，包括但不限于用户昵称、头像等基本信息。</view>
            <view class="agreement-item">2、我们采取业界标准的安全防护措施保护您的个人信息安全。</view>
            <view class="agreement-item">3、未经您的同意，我们不会向任何第三方提供、出售、出租、分享或交易您的个人信息。</view>
            <view class="agreement-item">4、我们会通过合理有效的管理措施和技术手段，保护您提供的个人信息安全，防止信息泄露、损毁或丢失。</view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="agree-btn" @click="closeModal('privacy')">我已悉知并同意</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { Navigator, IndexRoutes } from '../../router/Router';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      hasLogin: false,
      userInfo: {
        nickName: '',
        avatarUrl: ''
      },
      showAgreementModal: false,
      showPrivacyModal: false,
    }
  },
  computed: {
    ...mapState('user/baseInfo', ['isRegistered', 'id', 'avatar', 'name', 'phoneNumber'])
  },
  onLoad() {
    this.checkLoginStatus();
  },
  methods: {
    ...mapMutations('user/baseInfo', ['SET_USER_INFO']),
    ...mapActions('user/baseInfo', ['updateUserInfo']),
    
    // 检查登录状态
    checkLoginStatus() {
      const token = uni.getStorageSync('token');
      
      if (token && this.isRegistered) {
        this.hasLogin = true;
        
        // 从Vuex获取用户信息
        this.userInfo = {
          nickName: this.name,
          avatarUrl: this.avatar
        };
      }
    },
    
    /**
     * 微信登录方法
     * @returns {void}
     */
    onWxLogin() {
      uni.showLoading({
        title: '登录中...'
      });
      
      uni.login({
        provider: 'weixin',
        success: async (res) => {
          try {
            const result = await uni.request({
              method: "POST",
              url: "http://localhost:8080/users/auth/wechat",
              data: {
                code: res.code
              }
            });
            
            console.log(result);
            
            // 检查请求是否成功
            if (result.statusCode === 200 && result.data) {
              // 存储token到本地
              uni.setStorageSync('token', result.data.token);
              
              // 存储用户ID
              if (result.data.userId) {
                uni.setStorageSync('userId', result.data.userId);
                
                // 使用Vuex mutation更新用户ID
                this.SET_USER_INFO({
                  id: result.data.userId,
                  isRegistered: 1 // 标记为已注册
                });
              }
              
              uni.hideLoading();
              
              // 提示登录成功
              uni.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 1500
              });
              
              // 设置登录状态
              this.hasLogin = true;
              
              // 跳转到信息完善页面
              setTimeout(() => {
                Navigator.redirectTo('/pages/login/login_detail');
              }, 1500);
            } else {
              uni.hideLoading();
              uni.showToast({
                title: '登录失败，请重试',
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('登录请求失败', error);
            uni.hideLoading();
            uni.showToast({
              title: '登录失败，请重试',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('微信登录失败', err);
          uni.hideLoading();
          uni.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          });
        }
      });
    },
    
    /**
     * 根据注册状态跳转到相应页面
     * @returns {void}
     */
    toHome() {
      Navigator.redirectTo(IndexRoutes.INDEX);
    },
    
    /**
     * 显示用户协议弹窗
     * @returns {void}
     */
    showAgreement() {
      this.showAgreementModal = true;
    },
    
    /**
     * 显示隐私政策弹窗
     * @returns {void}
     */
    showPrivacy() {
      this.showPrivacyModal = true;
    },
    
    /**
     * 关闭弹窗
     * @param {string} type - 要关闭的弹窗类型（'agreement'或'privacy'）
     * @returns {void}
     */
    closeModal(type) {
      if (type === 'agreement') {
        this.showAgreementModal = false;
      } else if (type === 'privacy') {
        this.showPrivacyModal = false;
      }
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
      padding: 0;
      border: none;
      box-shadow: 0 10rpx 20rpx rgba(7, 193, 96, 0.3);
      
      &.logged-in {
        background: linear-gradient(to right, #1989fa, #3194fa);
        box-shadow: 0 10rpx 20rpx rgba(25, 137, 250, 0.3);
      }

      .btn-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      
      .wechat-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 15rpx;
      }

      .login-text {
        display: inline-block;
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
  
  // 弹窗样式
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .modal-content {
    width: 80%;
    max-height: 70vh;
    background-color: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .modal-title {
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
    padding: 30rpx 0;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .modal-body {
    padding: 30rpx;
    flex: 1;
    overflow-y: auto;
  }
  
  .agreement-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
  }
  
  .agreement-item {
    margin-bottom: 20rpx;
    
  }
  
  .modal-footer {
    padding: 20rpx 30rpx 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .agree-btn {
      width: 80%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: linear-gradient(to right, #1989fa, #3194fa);
      color: #fff;
      font-size: 30rpx;
      border-radius: 40rpx;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
    }
  }
}
</style>