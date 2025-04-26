<template>
  <view class="container">
    <!-- 用户信息区 -->
    <view class="user-info">
      <view class="user-info-row">
        <image class="avatar" :src="userData.avatar || storeAvatar || '/static/image/tab-bar/default_avatar.png'" mode="aspectFill" @click="handleAvatarClick"></image>
        <view class="user-info-content">
          <view class="nickname-row">
            <text class="login-text" @click="handleLoginClick">{{ userData.name || storeName || '登录' }}</text>
          </view>
          <!-- 修改个人信息链接 -->
          <text class="edit-profile-link" @click="handleEditProfile">修改个人信息</text>
        </view>
      </view>
    </view>
    
    <!-- 菜单列表 -->
    <view class="menu-list">
      <!-- 老师特有功能菜单 -->
      <view v-if="storeUserInfo.role === '老师'" class="menu-item" @click="navigateTo(MineRoutes.SERVICE)">
        <view class="icon-circle info">
          <text class="icon-text">⏱</text>
        </view>
        <text class="menu-text">我的服务</text>
      </view>
      
      <!-- 共有菜单项：我的订单 -->
      <view class="menu-item" @click="navigateTo(MineRoutes.ORDER)">
        <view class="icon-circle success">
          <text class="icon-text">✓</text>
        </view>
        <text class="menu-text">我的订单</text>
      </view>
      
      <!-- 共有菜单项：我的课程 -->
      <view class="menu-item" @click="navigateTo(MineRoutes.COURSE)">
        <view class="icon-circle info">
          <text class="icon-text">📚</text>
        </view>
        <text class="menu-text">我的课程</text>
      </view>
      
      <!-- 老师特有菜单项：资质认证 -->
      <view v-if="storeUserInfo.role === '老师'" class="menu-item" @click="navigateTo(MineRoutes.QUALIFICATION)">
        <view class="icon-circle info">
          <text class="icon-text">📃</text>
        </view>
        <text class="menu-text">资质认证</text>
      </view>
      
      <!-- 老师特有菜单项：我的钱包 -->
      <view v-if="storeUserInfo.role === '老师'" class="menu-item" @click="navigateTo(MineRoutes.WALLET)">
        <view class="icon-circle warning">
          <text class="icon-text">💰</text>
        </view>
        <text class="menu-text">我的钱包</text>
      </view>
      
      <!-- 共有菜单项：关注公众号 -->
      <view class="menu-item" @click="navigateTo('/pages/subscribe/subscribe')">
        <view class="icon-circle info">
          <text class="icon-text">📢</text>
        </view>
        <text class="menu-text">关注公众号</text>
      </view>
      
      <!-- 共有菜单项：设置 -->
      <view class="menu-item" @click="navigateTo(MineRoutes.SETTINGS)">
        <view class="icon-circle info">
          <text class="icon-text">⚙️</text>
        </view>
        <text class="menu-text">设置</text>
      </view>
    </view>
    
    <!-- 添加自定义底部导航栏 -->
    <TabBar pageName="mine" />
  </view>
</template>

<script>
/**
 * @description 我的页面（通用）
 */
import { Navigator, MineRoutes } from '@/router/Router.js';
import TabBar from '../../../components/tab-bar/tab-bar.vue';
import store from '@/store/index.js';
import { mapState } from 'vuex';

export default {
  components: {
    TabBar
  },
  data() {
    return {
      userData: {},
      isLoggedIn: false,
      MineRoutes,
      isLoading: false,
      isDebug: true  // 显示调试信息
    }
  },
  
  computed: {
    // 直接使用mapState获取state中的数据
    ...mapState('user/baseInfo', {
      storeId: state => state.id,
      storeAvatar: state => state.avatar,
      storeName: state => state.name,
      storeGender: state => state.gender,
      storeSelfIntroduction: state => state.selfIntroduction,
      storeWechatNumber: state => state.wechatNumber,
      storePhoneNumber: state => state.phoneNumber,
      storeUserInfo: state => state.userInfo
    })
  },
  
  async onLoad() {
    console.log('mine_common.vue onLoad开始执行');
    try {
      // 确保Vuex store已经初始化并注入到Vue实例中
      await this.$nextTick();
      
      // 直接从store获取数据
      this.initFromStore();
      
      // 加载数据
      await this.loadUserData();
      
      console.log('mine_common.vue onLoad执行完成，userData:', JSON.stringify(this.userData));
      console.log('store中的name值:', this.storeName);
    } catch (error) {
      console.error('onLoad错误:', error);
    }
  },
  
  async onShow() {
    console.log('mine_common.vue onShow开始执行');
    try {
      // 确保Vuex store已经初始化
      await this.$nextTick();
      
      // 检查store中是否有数据
      console.log('onShow检查store数据:', {
        storeName: this.storeName,
        storeAvatar: this.storeAvatar
      });
      
      // 从store初始化
      this.initFromStore();
      
      // 获取角色
      const storedUserRole = uni.getStorageSync('userRole');
      if (storedUserRole) {
        await this.updateUserRole(storedUserRole);
      }
      
      // 检查是否需要加载数据
      if (!this.userData.name && !this.storeName) {
        console.log('用户数据为空，尝试重新加载');
        await this.loadUserData();
      }
      
      console.log('mine_common.vue onShow执行完成，userData:', JSON.stringify(this.userData));
    } catch (error) {
      console.error('onShow错误:', error);
    }
  },
  
  methods: {
    /**
     * @description 从store初始化数据
     */
    initFromStore() {
      console.log('initFromStore - 从store直接获取数据');
      console.log('store中的数据:', {
        id: this.storeId,
        name: this.storeName,
        avatar: this.storeAvatar,
        role: this.storeUserInfo.role
      });
      
      // 如果store有数据，直接使用
      if (this.storeName) {
        this.userData = {
          id: this.storeId,
          avatar: this.storeAvatar,
          name: this.storeName,
          gender: this.storeGender,
          selfIntroduction: this.storeSelfIntroduction,
          wechatNumber: this.storeWechatNumber,
          phoneNumber: this.storePhoneNumber
        };
        this.isLoggedIn = true;
        console.log('从store初始化userData成功:', this.userData);
      } else {
        console.log('store中没有用户数据');
      }
    },
    
    /**
     * @description 更新用户角色
     * @param {string} role - 用户角色
     */
    async updateUserRole(role) {
      try {
        console.log('更新用户角色:', role);
        // 直接使用store.dispatch
        if (this.$store) {
          await this.$store.dispatch('user/baseInfo/updateRole', role);
          console.log('角色更新成功, 新角色:', this.storeUserInfo.role);
        } else {
          console.warn('$store不可用，直接使用本地存储');
          uni.setStorageSync('userRole', role);
        }
      } catch (error) {
        console.error('更新用户角色失败', error);
        // 本地存储作为备份
        uni.setStorageSync('userRole', role);
      }
    },
    
    /**
     * @description 加载用户数据
     */
    async loadUserData() {
      console.log('loadUserData 开始执行');
      this.isLoading = true;
      
      try {
        if (this.$store) {
          console.log('使用Vuex获取用户数据');
          // 直接使用store.dispatch
          const result = await this.$store.dispatch('user/baseInfo/getUserInfo');
          
          console.log('getUserInfo返回结果:', result);
          
          // 检查store中的数据是否更新
          console.log('store中的数据是否更新:', {
            storeName: this.storeName
          });
          
          // 无论API返回什么，都再次从store初始化
          this.initFromStore();
          
          // 如果store仍然没有数据，使用API返回的结果
          if (!this.userData.name && result) {
            console.log('使用API返回的结果更新userData');
            this.userData = {
              id: result.id || '',
              avatar: result.avatar || '',
              name: result.name || result.nickname || '',
              gender: result.gender || '',
              selfIntroduction: result.selfIntroduction || result.introduction || '',
              wechatNumber: result.wechatNumber || result.wechat || '',
              phoneNumber: result.phoneNumber || result.phone || ''
            };
            this.isLoggedIn = !!this.userData.name;
            
            // 备份到本地存储
            uni.setStorageSync('userData', JSON.stringify(this.userData));
            console.log('更新userData成功:', this.userData);
          } else if (!this.userData.name) {
            console.log('尝试从本地存储恢复数据');
            this.recoverFromLocalStorage();
          }
        } else {
          console.warn('$store不可用，从本地存储加载');
          this.recoverFromLocalStorage();
        }
      } catch (error) {
        console.error('加载用户数据失败', error);
        this.recoverFromLocalStorage();
      } finally {
        this.isLoading = false;
        console.log('loadUserData 执行完成, userData:', this.userData);
      }
    },
    
    /**
     * @description 从本地存储恢复数据
     */
    recoverFromLocalStorage() {
      console.log('从本地存储恢复数据');
      const localUserData = uni.getStorageSync('userData');
      if (localUserData) {
        try {
          this.userData = JSON.parse(localUserData);
          this.isLoggedIn = !!this.userData.name;
          console.log('从userData恢复成功:', this.userData);
        } catch (e) {
          console.error('解析本地用户数据失败', e);
        }
      }
      
      // 如果本地存储没有数据，尝试从userBaseInfo恢复
      if (!this.userData.name) {
        const baseInfo = uni.getStorageSync('userBaseInfo');
        if (baseInfo) {
          try {
            const parsedInfo = JSON.parse(baseInfo);
            this.userData = { ...parsedInfo };
            this.isLoggedIn = !!this.userData.name;
            console.log('从userBaseInfo恢复成功:', this.userData);
          } catch (e) {
            console.error('解析userBaseInfo失败', e);
          }
        } else {
          console.log('本地存储中没有用户数据');
        }
      }
    },
    
    /**
     * @description 处理头像点击
     */
    handleAvatarClick() {
      this.handleEditProfile();
    },
    
    /**
     * @description 处理登录文本点击
     */
    handleLoginClick() {
      if (this.isLoggedIn) {
        this.handleEditProfile();
      } else {
        // 未登录时导航到登录页
        Navigator.toLogin();
      }
    },
    
    /**
     * @description 跳转到修改个人信息页面
     */
    handleEditProfile() {
      Navigator.toModify();
    },
    
    /**
     * @description 页面跳转方法
     * @param {string} url - 目标页面路径
     */
    navigateTo(url) {
      Navigator.navigateTo(url);
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: 55px; /* 为自定义tabBar留出空间 */
  background-color: #ffffff;
}

/* 用户信息区样式 */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30rpx;
  border-bottom: 1px solid #f0f0f0;
}

.user-info-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.user-info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nickname-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10rpx;
}

.login-text {
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

/* 调试信息 */
.debug-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 10rpx;
  border: 1px dashed #ccc;
  padding: 5rpx;
  font-size: 24rpx;
}

.debug-text {
  color: #666;
  margin-bottom: 4rpx;
}

/* 修改个人信息链接样式 */
.edit-profile-link {
  font-size: 28rpx;
  color: #2196F3;
  text-decoration: underline;
  margin-bottom: 15rpx;
}

/* 菜单列表 */
.menu-list {
  width: 100%;
}

.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 30rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.icon-circle {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 30rpx;
  flex-shrink: 0;
}

.success {
  background-color: rgba(76, 175, 80, 0.1);
}

.warning {
  background-color: rgba(255, 82, 82, 0.1);
}

.info {
  background-color: rgba(33, 150, 243, 0.1);
}

.icon-text {
  font-size: 30rpx;
  font-weight: bold;
}

.success .icon-text {
  color: #4CAF50;
}

.warning .icon-text {
  color: #FF5252;
}

.info .icon-text {
  color: #2196F3;
}

.menu-text {
  font-size: 30rpx;
  color: #333;
  text-align: left;
}
</style>