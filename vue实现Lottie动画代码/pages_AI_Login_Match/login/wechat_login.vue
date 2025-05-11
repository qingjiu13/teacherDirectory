<template>
  <view class="login-container">
    <!-- 顶部背景图 -->
    <view class="header-bg">
      <image class="bg-image" src="./login/login_qianduan_test.png" mode="widthFix"></image>
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
        <image class="avatar" :src="userInfo.avatarUrl || '/static/image/defaultAvatar/teacher-man.png'" mode="aspectFill"></image>
        <text class="nickname" v-if="userInfo.nickName">{{userInfo.nickName}}</text>
        <text class="nickname" v-else>未登录</text>
      </view>
      
      <!-- 微信登录按钮 -->
      <button class="login-btn" @click="onWxLogin" v-if="!hasLogin">
        <view class="btn-content">
          <image class="wechat-icon" src="/static/image/defaultAvatar/teacher-man.png"></image>
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
    
    <!-- 微信授权弹窗（底部弹出） -->
    <view class="auth-popup" :class="{'auth-popup-show': showAuthPopup}">
      <view class="auth-popup-mask" @click="cancelAuth"></view>
      <view class="auth-popup-content">
        <view class="auth-popup-header">
          <text class="auth-popup-title">{{authPopupTitle}}</text>
          <text class="auth-popup-close" @click="cancelAuth">×</text>
        </view>
        
        <!-- 头像授权步骤 -->
        <view class="auth-step" v-if="authStep === 'avatar'">
          <view class="auth-desc">请选择您的头像</view>
          <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
            选择头像
          </button>
          <button class="auth-next-btn" @click="goToNicknameStep">跳过</button>
        </view>
        
        <!-- 昵称授权步骤 -->
        <view class="auth-step" v-if="authStep === 'nickname'">
          <view class="nickname-input-wrap">
            <text class="input-label">昵称</text>
            <input class="nickname-input" type="nickname" placeholder="请输入您的昵称" :value="tempUserInfo.nickName" @input="onInputNickname" />
          </view>
          <button class="auth-next-btn" @click="goToPhoneStep" :disabled="!tempUserInfo.nickName">下一步</button>
        </view>
        
        <!-- 手机号授权步骤 -->
        <view class="auth-step" v-if="authStep === 'phone'">
          <view class="phone-auth-desc">
            <view class="phone-icon">📱</view>
            <view class="phone-text">授权获取手机号</view>
            <view class="phone-tip">应用将获取您微信绑定的手机号</view>
          </view>
          <button class="phone-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            一键授权手机号
          </button>
          <view class="phone-skip" @click="skipPhoneAuth">
            <text>暂不授权</text>
          </view>
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
      // 新增授权相关数据
      showAuthPopup: false,
      authStep: 'avatar', // 'avatar', 'nickname', 'phone'
      tempUserInfo: {
        nickName: '',
        avatarUrl: '',
        phoneNumber: ''
      },
      wxLoginCode: '', // 存储微信登录的code
    }
  },
  computed: {
    ...mapState('user/baseInfo', ['isRegistered', 'id', 'avatar', 'name', 'phoneNumber']),
    
    /**
     * 根据当前授权步骤返回弹窗标题
     * @returns {string} 弹窗标题
     */
    authPopupTitle() {
      const titles = {
        'avatar': '选择头像',
        'nickname': '设置昵称',
        'phone': '绑定手机号'
      };
      return titles[this.authStep] || '微信授权';
    }
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
     * 微信登录方法 - 更新为新流程
     * @returns {void}
     */
    onWxLogin() {
      uni.showLoading({
        title: '登录中...'
      });
      
      uni.login({
        provider: 'weixin',
        success: (res) => {
          uni.hideLoading();
          if (res.code) {
            // 保存code用于后续请求
            this.wxLoginCode = res.code;
            
            // 显示授权弹窗
            this.showAuthPopup = true;
            this.authStep = 'avatar';
          } else {
            uni.showToast({
              title: '微信登录失败，请重试',
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
     * 处理用户选择头像事件
     * @param {Object} e - 微信返回的头像信息
     */
    onChooseAvatar(e) {
      if (e.detail && e.detail.avatarUrl) {
        this.tempUserInfo.avatarUrl = e.detail.avatarUrl;
        // 同时更新顶部头像显示
        this.userInfo.avatarUrl = e.detail.avatarUrl;
        
        // 自动跳转到昵称步骤
        this.goToNicknameStep();
      }
    },
    
    /**
     * 处理用户输入昵称事件
     * @param {Object} e - 输入事件对象
     */
    onInputNickname(e) {
      this.tempUserInfo.nickName = e.detail.value;
      // 同时更新顶部昵称显示
      this.userInfo.nickName = e.detail.value;
    },
    
    /**
     * 进入昵称设置步骤
     */
    goToNicknameStep() {
      this.authStep = 'nickname';
    },
    
    /**
     * 进入手机号授权步骤
     */
    goToPhoneStep() {
      this.authStep = 'phone';
    },
    
    /**
     * 获取微信绑定手机号
     * @param {Object} e - 微信返回的加密数据
     */
    getPhoneNumber(e) {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        // 准备提交所有用户信息到后端
        this.submitUserInfo({
          code: this.wxLoginCode,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          avatarUrl: this.tempUserInfo.avatarUrl,
          nickName: this.tempUserInfo.nickName
        });
      } else {
        uni.showToast({
          title: '未授权手机号，请重试',
          icon: 'none'
        });
      }
    },
    
    /**
     * 跳过手机号授权
     */
    skipPhoneAuth() {
      // 只提交头像和昵称
      this.submitUserInfo({
        code: this.wxLoginCode,
        avatarUrl: this.tempUserInfo.avatarUrl,
        nickName: this.tempUserInfo.nickName
      });
    },
    
    /**
     * 提交用户信息到后端
     * @param {Object} data - 要提交的用户数据
     */
    async submitUserInfo(data) {
      uni.showLoading({
        title: '提交中...'
      });
      
      try {
        const result = await uni.request({
          method: "POST",
          url: "http://localhost:8080/users/auth/wechat/profile",
          data: data
        });
        
        if (result.statusCode === 200 && result.data) {
          // 存储token到本地
          uni.setStorageSync('token', result.data.token);
          
          // 存储用户信息
          if (result.data.userId) {
            uni.setStorageSync('userId', result.data.userId);
            
            // 使用Vuex更新用户信息
            this.SET_USER_INFO({
              id: result.data.userId,
              isRegistered: 1,
              name: this.tempUserInfo.nickName,
              avatar: this.tempUserInfo.avatarUrl,
              phoneNumber: result.data.phoneNumber || ''
            });
            
            // 更新本地显示的用户信息
            this.userInfo = {
              nickName: this.tempUserInfo.nickName,
              avatarUrl: this.tempUserInfo.avatarUrl
            };
          }
          
          uni.hideLoading();
          
          // 提示登录成功
          uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          });
          
          // 设置登录状态并关闭弹窗
          this.hasLogin = true;
          this.showAuthPopup = false;
          
          // 延迟跳转
          setTimeout(() => {
            Navigator.redirectTo(IndexRoutes.INDEX);
          }, 1500);
        } else {
          uni.hideLoading();
          uni.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('提交用户信息失败', error);
        uni.hideLoading();
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      }
    },
    
    /**
     * 取消授权，关闭弹窗
     */
    cancelAuth() {
      this.showAuthPopup = false;
      this.wxLoginCode = '';
      this.tempUserInfo = {
        nickName: '',
        avatarUrl: '',
        phoneNumber: ''
      };
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
  
  // 新增授权弹窗样式
  .auth-popup {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    visibility: hidden;
    transform: translateY(100%);
    transition: all 0.3s ease;
    
    &.auth-popup-show {
      visibility: visible;
      transform: translateY(0);
    }
    
    .auth-popup-mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .auth-popup-content {
      position: relative;
      background-color: #fff;
      border-radius: 24rpx 24rpx 0 0;
      padding: 30rpx;
      
      .auth-popup-header {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        padding-bottom: 30rpx;
        border-bottom: 1px solid #f0f0f0;
        
        .auth-popup-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
        
        .auth-popup-close {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 40rpx;
          color: #999;
          padding: 10rpx;
        }
      }
    }
  }
  
  // 头像选择步骤样式
  .auth-step {
    padding: 40rpx 0;
    
    .auth-desc {
      text-align: center;
      font-size: 28rpx;
      color: #666;
      margin-bottom: 30rpx;
    }
    
    .avatar-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      border-radius: 45rpx;
      background-color: #07C160;
      color: #fff;
      font-size: 32rpx;
      margin-bottom: 30rpx;
    }
    
    .auth-next-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      border-radius: 45rpx;
      background-color: #1989fa;
      color: #fff;
      font-size: 32rpx;
      
      &[disabled] {
        background-color: #cccccc;
        color: #ffffff;
        opacity: 0.6;
      }
    }
    
    // 昵称输入样式
    .nickname-input-wrap {
      margin-bottom: 40rpx;
      
      .input-label {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      .nickname-input {
        width: 100%;
        height: 90rpx;
        border: 1px solid #e5e5e5;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
      }
    }
    
    // 手机号授权样式
    .phone-auth-desc {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40rpx;
      
      .phone-icon {
        font-size: 60rpx;
        margin-bottom: 20rpx;
      }
      
      .phone-text {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
      }
      
      .phone-tip {
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .phone-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      border-radius: 45rpx;
      background-color: #07C160;
      color: #fff;
      font-size: 32rpx;
      margin-bottom: 20rpx;
    }
    
    .phone-skip {
      text-align: center;
      font-size: 28rpx;
      color: #999;
      padding: 20rpx;
    }
  }
}
</style> 