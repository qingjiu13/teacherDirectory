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
      <button class="login-btn" open-type="getPhoneNumber"  @getphonenumber="getPhoneNumber" v-if="!loginstate">
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
import { useGlobalStore } from '@/store/global.js';
import { apiRequest } from '@/store/user/JWT';
const getApiPrefix = () => {
  const globalStore = useGlobalStore()
  return globalStore.apiBaseUrl
}

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
      currentAvatar: '', // 当前头像，初始为空，从后端获取默认头像列表后设置
      nicknameWidth: 0, // 昵称文字宽度
      avatarList: [], // 从后端获取的默认头像列表
      maskedPhoneNumber: ""
    }
  },
  
  /**
   * 页面加载时初始化
   */
  onLoad() {
    this.initializeUserInfo();
    // this.getWechatOpenid();
    this.checkLoginState();
    this.loadDefaultAvatarList();
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
        },
        fail: () => {
          // 如果缓存中没有头像，则等待从后端获取默认头像列表后设置
        }
      });
    },
    
    /**
     * 加载默认头像列表
     */
     async loadDefaultAvatarList() {
        try {
          const response = await apiRequest(
            `${getApiPrefix()}/common/defaultAvatarList`,
            'GET',
            {},
            { requireAuth: false }
          );
          console.log('获取默认头像列表:', response);
          this.avatarList = response.data.data;

          // 如果当前没有设置头像，则使用第一个默认头像
          if (!this.currentAvatar && this.avatarList.length > 0) {
            this.currentAvatar = this.avatarList[0];
            uni.setStorage({
              key: 'currentAvatar',
              data: this.currentAvatar
            });
          }
        } catch (error) {
          console.error('获取默认头像列表失败:', error);

          // 即使失败，也保证 currentAvatar 有默认值
          if (!this.currentAvatar && this.avatarList?.length > 0) {
            this.currentAvatar = this.avatarList[0];
            uni.setStorage({
              key: 'currentAvatar',
              data: this.currentAvatar
            });
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
     * 隐藏手机号授权弹窗
     */
    hidePhoneModal() {
      this.showPhoneModal = false;
    },
    
    /**
     * 微信手机号授权回调 - 统一的登录入口
     * @param {Object} e - 微信授权回调事件对象
     * @param {Object} e.detail - 授权详情
     * @param {string} e.detail.code - 动态令牌（新版API）
     * @param {string} e.detail.errMsg - 错误信息
     */
    async getPhoneNumber(e) {
      console.log('微信手机号授权回调:', e);
      
      // 检查授权是否成功
      if (e.detail.errMsg !== 'getPhoneNumber:ok') {
        console.error('用户拒绝授权或授权失败:', e.detail.errMsg);
        this.handleAuthorizationFailed(e.detail.errMsg);
        return;
      }
      
      // 检查是否获取到code
      if (!e.detail.code) {
        console.error('未获取到授权code');
        uni.showToast({
          title: '获取授权信息失败',
          icon: 'none'
        });
        return;
      }
      
      // 执行登录流程
      await this.performLogin(e.detail.code);
    },

    /**
     * 处理授权失败的情况
     * @param {string} errMsg - 错误信息
     */
    handleAuthorizationFailed(errMsg) {
      // 根据不同的错误类型给出不同的提示
      let title = '授权失败';
      let content = '登录需要您的授权，请重新点击按钮进行授权。';
      
      if (errMsg.includes('deny') || errMsg.includes('cancel')) {
        title = '授权被取消';
        content = '您取消了手机号授权，无法完成登录。请重新点击按钮进行授权。';
      } else if (errMsg.includes('fail')) {
        title = '授权失败';
        content = '授权过程中出现问题，请检查网络连接后重试。';
      }
      
      uni.showModal({
        title: title,
        content: content,
        confirmText: '知道了',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            console.log('用户确认授权失败提示');
          }
        }
      });
    },

    /**
     * 执行登录流程
     * @param {string} phoneCode - 微信手机号授权code
     */
    async performLogin(phoneCode) {
      try {
        // 显示登录进度
        uni.showLoading({
          title: '登录中...',
          mask: true
        });
        
        // 1. 获取微信登录code
        const wechatCode = await this.getWechatLoginCode();
        console.log('获取到微信登录code:', wechatCode);
        
        // 2. 准备登录请求数据
        const loginData = {
          phoneCode: phoneCode,           // 手机号授权code
          wechatCode: wechatCode,         // 微信登录code
          avatar: this.currentAvatar,     // 用户选择的头像
          nickname: this.currentNickname  // 用户设置的昵称
        };
        
        console.log('发送登录请求数据:', loginData);
        
        // 3. 发送登录请求到后端
        const response = await this.sendLoginRequest(loginData);
        
        // 4. 处理登录结果
        await this.handleLoginResponse(response);
        
      } catch (error) {
        // 处理登录过程中的异常
        this.handleLoginError(error);
      }
    },

    /**
     * 发送登录请求到后端
     * @param {Object} loginData - 登录数据
     * @returns {Promise<Object>} 登录响应
     */
    async sendLoginRequest(loginData) {
      const response = await apiRequest(`${getApiPrefix()}/auth/wechat/phoneLogin`, 'POST', loginData, {
        requireAuth: false,  // 登录接口不需要认证
        showError: false,    // 手动处理错误
        timeout: 10000       // 10秒超时
      });
      
      console.log('登录响应:', response);
      return response;
    },

    /**
     * 处理登录响应
     * @param {Object} response - 后端响应
     */
    async handleLoginResponse(response) {
      if (response.success && response.data && response.data.token) {
        // 登录成功
        await this.handleLoginSuccess(response.data);
      } else {
        // 登录失败
        const errorMsg = response.message || response.msg || '登录失败，请重试';
        throw new Error(errorMsg);
      }
    },

    /**
     * 处理登录成功
     * @param {Object} loginData - 登录成功返回的数据
     */
    async handleLoginSuccess(loginData) {
      try {
        // 存储JWT token到store
        this.$store.commit('user/baseInfo/SET_JWT_TOKEN', loginData.token);
        
        // 如果后端返回了用户信息，也更新到store
        if (loginData.userInfo) {
          this.$store.commit('user/baseInfo/SET_USER_INFO', loginData.userInfo);
        }
        
        // 更新登录状态
        this.$store.commit('user/baseInfo/SET_LOGIN_STATUS', 1);
        this.loginstate = 1;
        
        // 存储登录状态到本地缓存
        await this.saveLoginStateToStorage();
        
        // 隐藏加载提示
        uni.hideLoading();
        
        // 显示成功提示
        uni.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        });
        
        console.log('登录成功，JWT token已存储:', loginData.token);
        
        // 延迟跳转到首页
        setTimeout(() => {
          this.toHome();
        }, 1500);
        
      } catch (error) {
        console.error('处理登录成功数据时出错:', error);
        throw new Error('登录成功但数据处理失败');
      }
    },

    /**
     * 保存登录状态到本地存储
     */
    async saveLoginStateToStorage() {
      return new Promise((resolve, reject) => {
        uni.setStorage({
          key: 'loginstate',
          data: 1,
          success: () => {
            console.log('登录状态已保存到本地存储');
            resolve();
          },
          fail: (error) => {
            console.error('保存登录状态失败:', error);
            reject(error);
          }
        });
      });
    },

    /**
     * 处理登录错误
     * @param {Error} error - 错误对象
     */
    handleLoginError(error) {
      uni.hideLoading();
      console.error('登录过程中发生错误:', error);
      
      let errorMsg = '登录失败，请重试';
      
      // 根据不同的错误类型给出不同的提示
      if (error.message) {
        if (error.message.includes('网络')) {
          errorMsg = '网络连接失败，请检查网络后重试';
        } else if (error.message.includes('超时')) {
          errorMsg = '登录超时，请重试';
        } else if (error.message.includes('服务器')) {
          errorMsg = '服务器繁忙，请稍后重试';
        } else {
          errorMsg = error.message;
        }
      }
      
      uni.showModal({
        title: '登录失败',
        content: errorMsg,
        confirmText: '重试',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            console.log('用户选择重试登录');
            // 可以在这里添加重试逻辑
          }
        }
      });
    },

    /**
     * 获取微信登录code
     * @returns {Promise<string>} 返回微信登录code
     */
    getWechatLoginCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: (res) => {
            if (res.code) {
              resolve(res.code);
            } else {
              reject(new Error('获取微信登录code失败'));
            }
          },
          fail: (err) => {
            console.error('uni.login失败:', err);
            reject(new Error('获取微信登录code失败'));
          }
        });
      });
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
     * 上传用户自定义头像文件
     * @param {string} filePath - 本地文件路径
     * @returns {Promise<Object>} 返回上传结果，包含头像URL和文件信息
     */
    uploadAvatarFile(filePath) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: `${getApiPrefix()}/common/uploadAvatarFile`,
          filePath: filePath,
          name: 'avatar',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            type: 'avatar',
            timestamp: Date.now()
          },
          success: (res) => {
            try {
              const data = JSON.parse(res.data);
              // 实际返回格式：{"msg":"操作成功","code":200,"data":{"fileName":"...","newFileName":"...","url":"...","originalFilename":"..."}}
              if (data.code === 200) {
                resolve({
                  url: data.data.url,
                  fileName: data.data.fileName,
                  newFileName: data.data.newFileName,
                  originalFilename: data.data.originalFilename,
                  message: data.msg || '上传成功'
                });
              } else {
                reject(new Error(data.msg || '上传头像失败'));
              }
            } catch (error) {
              reject(new Error('服务器响应格式错误'));
            }
          },
          fail: (error) => {
            reject(new Error('上传头像网络请求失败'));
          }
        });
      });
    },

    /**
     * 选择自定义头像
     */
    selectCustomAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          
          // 显示上传进度
          uni.showLoading({
            title: '上传头像中...'
          });
          
          try {
            // 上传头像到服务器
            const uploadResult = await this.uploadAvatarFile(tempFilePath);
            
            // 使用服务器返回的URL
            this.currentAvatar = uploadResult.url;
            uni.setStorage({
              key: 'currentAvatar',
              data: uploadResult.url
            });
            
            uni.hideLoading();
            this.hideAvatarModal();
            uni.showToast({
              title: '头像已更换',
              icon: 'success'
            });
          } catch (error) {
            uni.hideLoading();
            console.error('上传头像失败:', error);
            uni.showToast({
              title: error.message || '上传头像失败',
              icon: 'none'
            });
          }
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
  flex-direction: row;
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