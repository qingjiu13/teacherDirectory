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
        <view class="avatar-mask-outer">
          <view class="avatar-mask-inner"></view>
          <image class="avatar-img" :src="userInfo && userInfo.avatarUrl ? userInfo.avatarUrl : '/static/image/defaultAvatar/teacher-man.png'" mode="aspectFill"></image>
        </view>
        <text class="nickname" v-if="userInfo && userInfo.nickName">{{userInfo.nickName}}</text>
        <text class="nickname" v-else>未登录</text>
      </view>
      
      <!-- 微信登录按钮 -->
      <button class="login-btn" @click="onGotUserInfo" v-if="!loginstate">
        <view class="btn-content">
          <image class="wechat-icon" src="../static/login/wechat.png"></image>
          <text class="login-text">微信登录</text>
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
    
    <!-- 微信授权手机号弹窗 -->
    <view class="modal-overlay" v-if="showModal">
      <view class="modal-content">
        <view class="modal-title">授权获取手机号</view>
        <view class="modal-body">
          <view class="agreement-text">
            <view class="agreement-item">应用将获取您微信绑定的手机号用于账号登录</view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="phone-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">一键授权手机号</button>
          <button class="cancel-btn" @click="hideModal">取消</button>
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
      openid: "",
      userEntity: null,
      terminal: "",
      osVersion: "",
      phoneNumber: "",
      userInfo: null,
      loginstate: "",
      showModal: false, // 定义登录弹窗
      showAgreementModal: false,
      showPrivacyModal: false,
    }
  },
  
  // 在页面加载的时候，判断缓存中是否有内容，如果有，存入到对应的字段里
  onLoad() {
    // 获取openid
    uni.getStorage({
      key: 'openid',
      success: (res) => {
        this.openid = res.data;
      },
      fail: () => {
        this.getcode();
      }
    });
    
    // 获取用户信息
    uni.getStorage({
      key: 'userEntity',
      success: (res) => {
        this.userEntity = res.data;
      },
      fail: () => {
        console.log("fail1");
      }
    });
    
    // 获取登录状态
    uni.getStorage({
      key: 'loginstate',
      success: (res) => {
        this.loginstate = res.data;
      }, 
      fail: () => {
        console.log("fail2");
      }
    });
    
    // 获取用户信息
    uni.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.userInfo = res.data;
      }
    });
  },
  
  methods: {
    /**
     * 用户点击登录按钮，获取用户信息授权
     * @param {Object} e - 事件对象
     */
    onGotUserInfo(e) {
      // 显示提示，说明需要获取的信息
      uni.showModal({
        title: '授权提示',
        content: '应用需要获取您的昵称、头像、地区及性别等信息',
        success: (res) => {
          if (res.confirm) {
            // 用户点击确定，开始授权流程
            this.getUserProfileInfo();
          } else if (res.cancel) {
            // 用户点击取消
            uni.showToast({
              title: '您取消了授权',
              icon: 'none'
            });
          }
        }
      });
    },
    
    /**
     * 获取用户信息
     */
    getUserProfileInfo() {
      uni.showLoading({
        title: '加载中...'
      });
      
      // 调用uni-app的getUserProfile接口
      uni.getUserProfile({
        desc: '用于完善会员资料',
        lang: 'zh_CN',
        success: (res) => {
          uni.hideLoading();
          if (res.userInfo) {
            // 获取到用户信息
            const userInfo = res.userInfo;
            
            // 存储用户信息到本地
            uni.setStorage({
              key: "userinfo",
              data: userInfo
            });
            
            // 更新当前页面的用户信息
            this.userInfo = userInfo;
            
            console.log('获取用户信息成功', userInfo);
            
            // 提示用户授权成功
            uni.showToast({
              title: '授权成功',
              icon: 'success',
              duration: 1500
            });
            
            // 获取用户信息成功后，请求手机号
            setTimeout(() => {
              this.showDialogBtn();
            }, 1500);
          }
        },
        fail: (err) => {
          uni.hideLoading();
          console.error('获取用户信息失败', err);
          uni.showToast({
            title: '获取信息失败',
            icon: 'none'
          });
        }
      });
    },
    
    /**
     * 获取微信code码
     */
    getcode() {
      uni.login({
        provider: 'weixin',
        success: (res) => {
          if (res.code) {
            uni.request({
              url: '登录接口', // 需替换为实际接口
              method: 'POST',
              data: {
                account: '1514382701',
                jscode: res.code
              },
              header: {
                'content-type': 'application/json'
              },
              success: (res) => {
                if (res.data.r == "T") {
                  uni.setStorage({
                    key: "openid",
                    data: res.data.openid
                  });
                  uni.setStorage({
                    key: "sessionkey",
                    data: res.data.sessionkey
                  });
                  this.openid = res.data.openid;
                }
              }
            });
          }
        }
      });
    },
    
    /**
     * 显示一键获取手机号弹窗
     */
    showDialogBtn() {
      this.showModal = true; // 修改弹窗状态为true，即显示
    },
    
    /**
     * 隐藏一键获取手机号弹窗
     */
    hideModal() {
      this.showModal = false; // 修改弹窗状态为false，即隐藏
    },
    
    /**
     * 处理登录信息并提交到服务器
     * @param {String} openid - 用户openid
     * @param {Object} userInfo - 用户信息
     * @param {String} phoneNumber - 用户手机号
     */
    onshow(openid, userInfo, phoneNumber) {
      // 获取系统信息
      uni.getSystemInfo({
        success: (res) => {
          this.terminal = res.model;
          this.osVersion = res.system;
        }
      });
      
      // 发送登录请求
      uni.request({
        url: '登录接口', // 需替换为实际接口
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          username: phoneNumber,
          parentuser: 'xudeihai',
          wximg: userInfo.avatarUrl,
          nickname: userInfo.nickName,
          identity: "",
          terminal: this.terminal,
          osVersion: this.osVersion,
          logintype: "10", // 微信登录
          openid: this.openid,
        },
        success: (res) => {
          if (res.data.r == "T") {
            this.userEntity = res.data.d;
            uni.setStorage({
              key: "userEntity",
              data: res.data.d
            });
            this.loginstate = "1";
            uni.setStorage({
              key: "loginstate",
              data: "1"
            });
            uni.setStorage({
              key: 'userinfo',
              data: userInfo // 保存完整的用户信息对象
            });
            
            // 登录成功，跳转到首页
            uni.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1500
            });
            
            // 延迟跳转
            setTimeout(() => {
              this.toHome();
            }, 1500);
          }
        },
        fail(res) {
          console.log(res);
          uni.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      });
    },
    
    /**
     * 获取手机号
     * @param {Object} e - 事件对象，包含加密数据
     */
    getPhoneNumber(e) {
      this.hideModal();
      
      if (e.detail.errMsg !== 'getPhoneNumber:ok') {
        uni.showToast({
          title: '未授权手机号',
          icon: 'none'
        });
        return;
      }
      
      // 显示加载中
      uni.showLoading({
        title: '处理中...'
      });
      
      // 检查会话是否有效
      uni.checkSession({
        success: () => {
          this.requestPhoneNumber(e);
        },
        fail: () => {
          // 会话失效，重新登录
          uni.login({
            provider: 'weixin',
            success: (res) => {
              uni.request({
                url: '自己的登录接口', // 需替换为实际接口
                data: {
                  account: '1514382701',
                  jscode: res.code
                },
                method: "POST",
                header: {
                  'content-type': 'application/json'
                },
                success: (res) => {
                  if (res.data.r == "T") {
                    uni.setStorage({
                      key: "openid",
                      data: res.data.openid
                    });
                    uni.setStorage({
                      key: "sessionkey",
                      data: res.data.sessionkey
                    });
                    this.decryptPhoneNumber(e, res.data.sessionkey);
                  } else {
                    uni.hideLoading();
                    uni.showToast({
                      title: '登录失败',
                      icon: 'none'
                    });
                  }
                },
                fail: () => {
                  uni.hideLoading();
                  uni.showToast({
                    title: '网络请求失败',
                    icon: 'none'
                  });
                }
              });
            },
            fail: () => {
              uni.hideLoading();
              uni.showToast({
                title: '登录失败',
                icon: 'none'
              });
            }
          });
        }
      });
    },
    
    /**
     * 请求手机号（会话有效时）
     * @param {Object} e - 事件对象
     */
    requestPhoneNumber(e) {
      uni.login({
        provider: 'weixin',
        success: (res) => {
          uni.request({
            url: '自己的登录接口', // 需替换为实际接口
            data: {
              account: '1514382701',
              jscode: res.code
            },
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            success: (res) => {
              if (res.data.r == "T") {
                uni.setStorage({
                  key: "openid",
                  data: res.data.openid
                });
                uni.setStorage({
                  key: "sessionkey",
                  data: res.data.sessionkey
                });
                
                // 获取本地存储的sessionkey
                uni.setStorageSync("sessionkey", res.data.sessionkey);
                this.decryptPhoneNumber(e, uni.getStorageSync("sessionkey"));
              } else {
                uni.hideLoading();
                uni.showToast({
                  title: '登录失败',
                  icon: 'none'
                });
              }
            },
            fail: () => {
              uni.hideLoading();
              uni.showToast({
                title: '网络请求失败',
                icon: 'none'
              });
            }
          });
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      });
    },
    
    /**
     * 解密手机号
     * @param {Object} e - 事件对象
     * @param {String} sessionkey - 会话密钥
     */
    decryptPhoneNumber(e, sessionkey) {
      uni.request({
        url: '自己的解密接口', // 需替换为实际接口
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          code: sessionkey
        },
        method: "post",
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          uni.hideLoading();
          if (res.data.r == "T") {
            this.onshow(this.openid, this.userInfo, res.data.d.phoneNumber);
            console.log("登录成功");
            console.log(res.data.d.phoneNumber); // 成功后打印微信手机号
          } else {
            console.log(res);
            uni.showToast({
              title: '获取手机号失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
        }
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
.avatar-container .nickname {
  margin-top: 20rpx;
  font-size: 36rpx;
  color: rgba(0, 0, 0, 1);
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 70rpx;
  letter-spacing: -1.1rpx;

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
/* 一键获取手机号弹窗 */
.phone-btn {
  width: 80%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: #07C160;
  color: #fff;
  font-size: 30rpx;
  border-radius: 40rpx;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin-bottom: 20rpx;
}
.cancel-btn {
  width: 80%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: #f0f0f0;
  color: #333;
  font-size: 30rpx;
  border-radius: 40rpx;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.auth-popup {
  display: none;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  transform: translateY(100%);
  transition: all 0.3s ease;
}
.auth-popup.auth-popup-show {
  display: block;
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
}
.auth-popup-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-bottom: 30rpx;
  border-bottom: 1px solid #f0f0f0;
}
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
.auth-step {
  padding: 40rpx 0;
}
.auth-step .auth-desc {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
}
.auth-step .avatar-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 45rpx;
  background-color: #07C160;
  color: #fff;
  font-size: 32rpx;
  margin-bottom: 30rpx;
}
.auth-step .auth-next-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 45rpx;
  background-color: #1989fa;
  color: #fff;
  font-size: 32rpx;
}
.auth-step .auth-next-btn[disabled] {
  background-color: #cccccc;
  color: #ffffff;
  opacity: 0.6;
}
.auth-step .nickname-input-wrap {
  margin-bottom: 40rpx;
}
.auth-step .nickname-input-wrap .input-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}
.auth-step .nickname-input-wrap .nickname-input {
  width: 100%;
  height: 90rpx;
  border: 1px solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}
.auth-step .phone-auth-desc {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
}
.auth-step .phone-auth-desc .phone-icon {
  font-size: 60rpx;
  margin-bottom: 20rpx;
}
.auth-step .phone-auth-desc .phone-text {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.auth-step .phone-auth-desc .phone-tip {
  font-size: 24rpx;
  color: #999;
}
.auth-step .phone-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 45rpx;
  background-color: #07C160;
  color: #fff;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}
.auth-step .phone-skip {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  padding: 20rpx;
}
</style> 