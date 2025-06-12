<template>
  <view class="background-image">
    <image
      class="background-image-img"
      src="/static/image/bgPicture/background1.png"
      mode="aspectFill" alt="背景图"
    />
  </view>
  <view class="background-image">
    <image
      class="background-image-img"
      src="/static/image/bgPicture/background.png"
      mode="aspectFill" alt="背景图"
    />
  </view>
  <image
      class="nav-back"
      src="/static/image/navBack.png"
      mode="aspectFit"
      @click="goBack"
  />
  <view class="login-container">
    <!-- 内容区域 -->
    <view class="content">
      <!-- 欢迎文案 -->
      <view class="welcome-text">
        <text class="title">欢迎使用</text>
        <text class="subtitle">请先登录以享受完整服务</text>
      </view>
      
      <!-- 用户头像占位 -->
      <view class="avatar-container">
        <view class="avatar-mask-outer" @click="changeAvatar">
          <view class="avatar-mask-inner"></view>
          <image class="avatar-img" :src="currentAvatar" mode="aspectFill"></image>
        </view>
        <view class="nickname-container" @click="editNickname">
          <view class="nickname-text-container">
            <text class="nickname">{{currentNickname}}</text>
            <view class="nickname-underline" :style="{width: nicknameWidth + 'px'}"></view>
          </view>
          <image class="edit-icon" src="../static/login/edit.png" mode="aspectFill"></image>
        </view>
      </view>
      
      <!-- 一键登录按钮 -->
      <button class="login-btn" @click="showPhoneAuthModal" v-if="!loginstate">
        <view class="btn-content">
          <text class="login-text">一键登录</text>
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
    
    <!-- 简化的手机号显示弹窗 -->
    <view class="phone-auth-modal" v-if="showPhoneModal" @click.stop="hidePhoneModal">
      <view class="phone-modal-mask" @click="hidePhoneModal"></view>
      <view class="phone-modal-content" @click.stop :class="{'show': showPhoneModal}">
        <!-- 顶部标题栏 -->
        <view class="phone-modal-header">
          <view class="phone-modal-top-bar">
            <view class="phone-modal-logo">
              <image class="app-logo" src="../static/login/logo.png" mode="aspectFit"></image>
              <text class="app-name">师门</text>
            </view>
            <view class="phone-modal-subtitle">申请获取并验证你的手机号</view>
          </view>
          <text class="phone-modal-description">提供账号注册及登录功能、实现司乘联系、通过短信/外呼等方式向您进行信息推送（包括服务消息、活动宣传或其他商业性信息）</text>
        </view>
        
        <!-- 手机号显示区域 - 点击直接完成登录 -->
        <view class="phone-number-display" @click="completeLogin">
          <text class="phone-number-text">{{maskedPhoneNumber}}</text>
          <text class="phone-provider">微信绑定号码</text>
        </view>
        
        <!-- 不允许按钮 -->
        <view class="phone-modal-actions" @click="hidePhoneModal">
          <text class="phone-deny-btn">不允许</text>
        </view>
        
        <!-- 使用其它号码 -->
        <view class="phone-alternative" @click="useOtherPhone">
          <text class="alternative-text">使用其它号码</text>
        </view>
      </view>
    </view>
    
    <!-- 头像选择弹窗 -->
    <view class="avatar-modal" v-if="showAvatarModal" @click.stop="hideAvatarModal">
      <view class="avatar-modal-content" @click.stop>
        <view class="avatar-modal-title">选择头像</view>
        <view class="avatar-grid">
          <view 
            class="avatar-item" 
            v-for="(avatar, index) in avatarList" 
            :key="index"
            @click="selectAvatar(avatar)"
          >
            <image class="avatar-option" :src="avatar" mode="aspectFill"></image>
          </view>
          <!-- 自定义头像选项 -->
          <view class="avatar-item custom-avatar-item" @click="selectCustomAvatar">
            <view class="custom-avatar-container">
              <view class="custom-avatar-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9H21ZM15 3L19 7H15V3ZM5 5H13V9H19V21H5V5ZM12 10L10.5 12.5L9 11L6 15H18L15 11L12 10Z" fill="#999"/>
                </svg>
              </view>
              <text class="custom-avatar-text">自定义</text>
            </view>
          </view>
        </view>
        <button class="avatar-close-btn" @click="hideAvatarModal">取消</button>
      </view>
    </view>
    
    <!-- 昵称编辑弹窗 -->
    <view class="nickname-modal" v-if="showNicknameModal" @click.stop="hideNicknameModal">
      <view class="nickname-modal-content" @click.stop>
        <view class="nickname-modal-title">修改昵称</view>
        <view class="nickname-input-container">
          <input 
            class="nickname-input" 
            v-model="editingNickname" 
            placeholder="请输入昵称" 
            maxlength="20"
          />
        </view>
        <view class="nickname-modal-actions">
          <button class="nickname-cancel-btn" @click="hideNicknameModal">取消</button>
          <button class="nickname-confirm-btn" @click="confirmNickname">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { Navigator } from '../../router/Router';
import { generateRandomNickName } from './randomNickName.js';
import { getWechatLoginCode, getOpenidAndSessionKey, getStoredOpenid, getMaskedPhone } from './phoneNumberApi.js';
import { postUserInfo } from './postWechatApi.js';

export default {
  data() {
    return {
      openid: "",
      loginstate: "",
      showPhoneModal: false, // 手机号授权弹窗
      showAgreementModal: false,
      showPrivacyModal: false,
      showAvatarModal: false, // 头像选择弹窗
      showNicknameModal: false, // 昵称编辑弹窗
      currentNickname: "", // 当前昵称
      editingNickname: "", // 编辑中的昵称
      currentAvatar: '/static/image/defaultAvatar/teacher-man.png', // 当前头像
      nicknameWidth: 0, // 昵称文字宽度
      avatarList: [
        '/static/image/defaultAvatar/teacher-man.png',
        '/static/image/defaultAvatar/teacher-woman.png',
        '/static/image/defaultAvatar/student-man.png',
        '/static/image/defaultAvatar/student-woman.png'
      ],
      maskedPhoneNumber: ""
    }
  },
  
  /**
   * 页面加载时初始化
   */
  onLoad() {
    this.initializeUserInfo();
    this.getWechatOpenid();
    this.checkLoginState();
  },
  
  mounted() {
    // 计算昵称宽度
    this.$nextTick(() => {
      this.calculateNicknameWidth();
    });
  },
  
  watch: {
    currentNickname() {
      this.$nextTick(() => {
        this.calculateNicknameWidth();
      });
    }
  },
  
  methods: {
    /**
     * 初始化用户信息
     */
    initializeUserInfo() {
      // 从缓存获取昵称，如果没有则生成随机昵称
      uni.getStorage({
        key: 'currentNickname',
        success: (res) => {
          this.currentNickname = res.data;
        },
        fail: () => {
          this.currentNickname = generateRandomNickName();
          uni.setStorage({
            key: 'currentNickname',
            data: this.currentNickname
          });
        }
      });
      
      // 从缓存获取头像
      uni.getStorage({
        key: 'currentAvatar',
        success: (res) => {
          this.currentAvatar = res.data;
        }
      });
    },
    
    /**
     * 获取微信openid - 使用phoneNumberApi.js中的函数
     */
    async getWechatOpenid() {
      try {
        // 尝试从缓存获取openid
        this.openid = await getStoredOpenid();
      } catch (error) {
        // 如果缓存中没有，则获取新的openid
        try {
          const code = await getWechatLoginCode();
          const { openid } = await getOpenidAndSessionKey(code);
          this.openid = openid;
        } catch (err) {
          console.error('获取openid失败:', err);
        }
      }
    },
    
    /**
     * 检查登录状态
     */
    checkLoginState() {
      uni.getStorage({
        key: 'loginstate',
        success: (res) => {
          this.loginstate = res.data;
        }, 
        fail: () => {
          console.log("未登录");
        }
      });
    },
    
    /**
     * 计算昵称文字宽度
     */
    calculateNicknameWidth() {
      const query = uni.createSelectorQuery().in(this);
      query.select('.nickname').boundingClientRect(data => {
        if (data) {
          this.nicknameWidth = data.width;
        }
      }).exec();
    },
    
    /**
     * 显示手机号授权弹窗 - 使用phoneNumberApi.js中的函数
     */
    async showPhoneAuthModal() {
      // 显示加载
      uni.showLoading({
        title: '获取手机号中...'
      });
      
      try {
        // 使用phoneNumberApi.js的getMaskedPhone函数
        const result = await getMaskedPhone();
        this.maskedPhoneNumber = result.maskedPhone || "199****7700";
        uni.hideLoading();
        this.showPhoneModal = true;
      } catch (error) {
        uni.hideLoading();
        console.error('获取手机号失败:', error);
        this.maskedPhoneNumber = "199****7700";
        this.showPhoneModal = true;
      }
    },
    
    /**
     * 隐藏手机号授权弹窗
     */
    hidePhoneModal() {
      this.showPhoneModal = false;
    },
    
    /**
     * 完成登录 - 点击phone-number-display区域触发
     */
    async completeLogin() {
      uni.showLoading({
        title: '登录中...'
      });
      
      try {
        // 发送用户信息到后端
        await postUserInfo({
          nickname: this.currentNickname,
          avatar: this.currentAvatar,
          openid: this.openid
        });
        
        // 设置登录状态
        this.loginstate = "1";
        uni.setStorage({
          key: "loginstate",
          data: "1"
        });
        
        uni.hideLoading();
        this.hidePhoneModal();
        
        // 登录成功提示
        uni.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        });
        
        // 延迟跳转到首页
        setTimeout(() => {
          this.toHome();
        }, 1500);

        Navigator.toLogin();
        
      } catch (error) {
        uni.hideLoading();
        console.error('登录失败:', error);
        uni.showToast({
          title: error.message || '登录失败',
          icon: 'none'
        });
      }
    },
    
    /**
     * 使用其它号码
     */
    useOtherPhone() {
      uni.showToast({
        title: '暂不支持其它号码',
        icon: 'none'
      });
    },
    
    /**
     * 更换头像
     */
    changeAvatar() {
      this.showAvatarModal = true;
    },
    
    /**
     * 隐藏头像选择弹窗
     */
    hideAvatarModal() {
      this.showAvatarModal = false;
    },
    
    /**
     * 选择头像
     * @param {string} avatar - 头像路径
     */
    selectAvatar(avatar) {
      this.currentAvatar = avatar;
      uni.setStorage({
        key: 'currentAvatar',
        data: avatar
      });
      this.hideAvatarModal();
      uni.showToast({
        title: '头像已更换',
        icon: 'success'
      });
    },
    
    /**
     * 编辑昵称
     */
    editNickname() {
      this.editingNickname = this.currentNickname;
      this.showNicknameModal = true;
    },
    
    /**
     * 隐藏昵称编辑弹窗
     */
    hideNicknameModal() {
      this.showNicknameModal = false;
      this.editingNickname = "";
    },
    
    /**
     * 确认昵称修改
     */
    confirmNickname() {
      if (!this.editingNickname.trim()) {
        uni.showToast({
          title: '昵称不能为空',
          icon: 'none'
        });
        return;
      }
      
      this.currentNickname = this.editingNickname.trim();
      uni.setStorage({
        key: 'currentNickname',
        data: this.currentNickname
      });
      
      this.hideNicknameModal();
      uni.showToast({
        title: '昵称已修改',
        icon: 'success'
      });
    },
    
    /**
     * 跳转到首页
     */
    toHome() {
      Navigator.toIndex();
    },
    
    /**
     * 返回上一页
     */
    goBack() {
      Navigator.toIndex();
    },
    
    /**
     * 显示用户协议弹窗
     */
    showAgreement() {
      this.showAgreementModal = true;
    },
    
    /**
     * 显示隐私政策弹窗
     */
    showPrivacy() {
      this.showPrivacyModal = true;
    },
    
    /**
     * 关闭弹窗
     * @param {string} type - 要关闭的弹窗类型（'agreement'或'privacy'）
     */
    closeModal(type) {
      if (type === 'agreement') {
        this.showAgreementModal = false;
      } else if (type === 'privacy') {
        this.showPrivacyModal = false;
      }
    },
    
    /**
     * 选择自定义头像
     */
    selectCustomAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          
          // 可以在这里添加图片上传到服务器的逻辑
          // 暂时直接使用本地临时路径
          this.currentAvatar = tempFilePath;
          uni.setStorage({
            key: 'currentAvatar',
            data: tempFilePath
          });
          
          this.hideAvatarModal();
          uni.showToast({
            title: '头像已更换',
            icon: 'success'
          });
        },
        fail: (err) => {
          console.error('选择图片失败:', err);
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          });
        }
      });
    }
  }
}
</script>

<style>
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
.background-image-img {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  display: block;
}
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: transparent;
}
.header-bg {
  width: 100%;
  height: 600rpx;
  position: absolute;
  top: 0;
  left: 0;
}
.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.content {
  position: relative;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  background-color: transparent;
}
.blur-bottom-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(100px);
  pointer-events: none;
}
/* 返回按钮样式 */
.nav-back {
  position: absolute;
  top: 134rpx;
  left: 40rpx;
  width: 72rpx;
  height: 62rpx;
  z-index: 100;
}
.welcome-text {
  display: flex;
  flex-direction: column;
  margin-left: 100rpx;
  margin-top: 270rpx;
  width: 100%;
}
.welcome-text .title {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 48rpx;
  line-height: 70rpx;
  letter-spacing: -1.1rpx;
  color: rgba(0, 0, 0, 1);

}
.welcome-text .subtitle {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 32rpx;
  line-height: 70rpx;
  letter-spacing: -1.1rpx;
  color: #666;
  text-align: left;
}
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
  margin-top: 220rpx;
}
.avatar-mask-outer {
  position: relative;
  width: 180rpx; /* 外层尺寸 */
  height: 180rpx;
  border-radius: 30rpx; /* 外层圆角 */
  background: rgba(95, 38, 247, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.avatar-mask-inner {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 168rpx; /* 内层尺寸 */
  height: 168rpx;
  border-radius: 24rpx; /* 内层圆角 */
  z-index: 2;
  /* 关键：内层透明，遮住外层 */
  background: rgba(255, 255, 255, 1);
  transform: translate(-50%, -50%);
}
.avatar-img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 168rpx; /* 头像尺寸略小于内层 */
  height: 168rpx;
  border-radius: 24rpx;
  transform: translate(-50%, -50%);
  z-index: 3;
}

/* 昵称容器样式 */
.nickname-container {
  position: relative;
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-direction: row;
}

.nickname {
  font-size: 36rpx;
  color: rgba(0, 0, 0, 1);
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 70rpx;
  letter-spacing: -1.1rpx;
}

.nickname-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4rpx;
  background-color: #1989fa;
  transition: width 0.3s ease;
}

.edit-icon {
  width: 50rpx;
  height: 50rpx;
  margin-left: 10rpx;
  margin-top: 20rpx;
}

.login-btn {
  width: 318rpx;
  height: 88rpx;
  line-height: 50rpx;
  border-radius: 20rpx;
  background: rgba(22, 217, 26, 1);
  color: #fff;
  font-size: 32rpx;
}

.login-btn .btn-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.login-btn .wechat-icon {
  width: 48rpx;
  height: 38rpx;
  margin-right: 40rpx;
}
.login-btn .login-text {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 36rpx;
  line-height: 100%;
  letter-spacing: -0.68px;
  text-align: center;
}
.agreement {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: rgba(0, 0, 0, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
}
.agreement .link-group {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 6rpx;
  margin-left: 8rpx;
}
.agreement .link {
  color: #1989fa;
}
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
}
.modal-footer .agree-btn {
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

/* 类似滴滴的手机号授权弹窗样式 */
.phone-auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.phone-modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.phone-modal-content {
  width: 100%;
  background-color: #fff;
  border-radius: 40rpx 40rpx 0 0;
  padding: 60rpx 40rpx 60rpx;
  position: relative;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  z-index: 1000;
}

.phone-modal-content.show {
  position: absolute;
  transform: translateY(0);
  bottom: 0;
}

.phone-modal-header {
  margin-bottom: 60rpx;
}

.phone-modal-top-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}

.phone-modal-logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  width: 100%;
  text-align: left;
}


.app-logo {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
}

.app-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.phone-modal-subtitle {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-top: 20rpx;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  width: 100%;
}

.phone-modal-description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  text-align: left;
}

.phone-number-display {
  background-color: #f8f9fa;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
  position: relative;
}

.phone-number-display:active {
  background-color: #e8f4fd;
  border-color: #1989fa;
  transform: scale(0.98);
}

.phone-number-text {
  font-size: 36rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 10rpx;
}

.phone-provider {
  font-size: 24rpx;
  color: #999;
}

.phone-modal-actions {
  background-color: #f8f9fa;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
  position: relative;
}

.phone-deny-btn {
  font-size: 36rpx;
  font-weight: 500;
  color: #333;
}

.phone-alternative {
  margin-bottom: 40rpx;
  padding: 20rpx;
  text-align: center;
}

.alternative-text {
  font-size: 28rpx;
  color: #1989fa;
}

/* 头像选择弹窗样式 */
.avatar-modal {
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

.avatar-modal-content {
  width: 80%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
}

.avatar-modal-title {
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
  color: #333;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30rpx;
  margin-bottom: 40rpx;
}

.avatar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20rpx;
  overflow: hidden;
  background-color: #f5f5f5;
  cursor: pointer;
  aspect-ratio: 1;
}

.avatar-option {
  width: 120rpx;
  height: 120rpx;
  border-radius: 20rpx;
}

/* 自定义头像选项样式 */
.custom-avatar-item {
  background-color: #fafafa;
  border: 2rpx dashed #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.custom-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.custom-avatar-icon {
  margin-bottom: 10rpx;
}

.custom-avatar-text {
  font-size: 24rpx;
  color: #999;
}

.avatar-close-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #f0f0f0;
  color: #666;
  font-size: 30rpx;
  border-radius: 40rpx;
  border: none;
}

/* 昵称编辑弹窗样式 */
.nickname-modal {
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

.nickname-modal-content {
  width: 80%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
}

.nickname-modal-title {
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
  color: #333;
}

.nickname-input-container {
  margin-bottom: 40rpx;
}

.nickname-input {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 32rpx;
  color: #333;
  text-align: center;
}

.nickname-modal-actions {
  display: flex;
  gap: 20rpx;
}

.nickname-cancel-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #f0f0f0;
  color: #666;
  font-size: 30rpx;
  border-radius: 40rpx;
  border: none;
}

.nickname-confirm-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: linear-gradient(to right, #1989fa, #3194fa);
  color: #fff;
  font-size: 30rpx;
  border-radius: 40rpx;
  border: none;
}
</style> 