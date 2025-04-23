<template>
  <view class="container">
    <!-- 用户信息区 -->
    <view class="user-info">
      <view class="user-info-row">
        <image class="avatar" :src="userData.avatar || profile.avatar || '/static/image/tab-bar/default_avatar.png'" mode="aspectFill" @click="handleAvatarClick"></image>
        <view class="user-info-content">
          <view class="nickname-row">
            <text class="login-text" @click="handleLoginClick">{{ userData.nickname || profile.nickname || '登录' }}</text>
          </view>
          
          <!-- 修改个人信息链接 -->
          <text class="edit-profile-link" @click="handleEditProfile">修改个人信息</text>
        </view>
      </view>
    </view>
    
    <!-- 菜单列表 -->
    <view class="menu-list">
      <!-- 老师特有功能菜单 -->
      <view v-if="isTeacher" class="menu-item" @click="navigateTo(MineRoutes.SERVICE)">
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
      <view v-if="isTeacher" class="menu-item" @click="navigateTo(MineRoutes.QUALIFICATION)">
        <view class="icon-circle info">
          <text class="icon-text">📃</text>
        </view>
        <text class="menu-text">资质认证</text>
      </view>
      
      <!-- 老师特有菜单项：我的钱包 -->
      <view v-if="isTeacher" class="menu-item" @click="navigateTo(MineRoutes.WALLET)">
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
import { USE_MOCK_DATA } from '../../../store/user/baseInfo/config.js';

export default {
  components: {
    TabBar
  },
  data() {
    return {
      userName: '',
      userData: {},
      isLoggedIn: false,
      MineRoutes,
      isLoading: false,
      useMockData: USE_MOCK_DATA
    }
  },
  
  computed: {
    // 直接从store获取状态
    profile() {
      try {
        return store?.getters?.['user/baseInfo/profile'] || {};
      } catch (e) {
        console.error('获取profile失败', e);
        return {};
      }
    },
    userRole() {
      try {
        return store?.getters?.['user/baseInfo/userRole'] || 'student';
      } catch (e) {
        console.error('获取userRole失败', e);
        return 'student';
      }
    },
    isTeacher() {
      try {
        return store?.getters?.['user/baseInfo/isTeacher'] || false;
      } catch (e) {
        console.error('获取isTeacher失败', e);
        return false;
      }
    }
  },
  
  async onLoad() {
    try {
      // 优先从本地存储恢复用户令牌
      this.ensureUserLogin();
      await this.loadUserData();
    } catch (error) {
      console.error('onLoad错误:', error);
    }
  },
  
  async onShow() {
    try {
      const storedUserRole = uni.getStorageSync('userRole');
      if (storedUserRole) {
        await this.updateUserRole(storedUserRole);
        await this.loadUserData();
      } else {
        if (!this.profile || !this.profile.nickname) {
          await this.loadUserData();
        } else {
          this.userData = { ...this.profile };
          this.userName = this.profile.nickname || '用户';
        }
      }
    } catch (error) {
      console.error('onShow错误:', error);
    }
  },
  
  methods: {
    /**
     * @description 确保用户已登录
     */
    ensureUserLogin() {
      if (this.useMockData && !uni.getStorageSync('userId')) {
        // 在模拟模式下，自动设置模拟用户ID和令牌
        uni.setStorageSync('userId', '123456');
        uni.setStorageSync('user-token', 'mock_token_for_testing');
      }
    },
    
    /**
     * @description 更新用户角色
     * @param {string} role - 用户角色
     */
    async updateUserRole(role) {
      try {
        if (store && typeof store.dispatch === 'function') {
          await store.dispatch('user/baseInfo/updateRole', role);
        } else {
          console.warn('store.dispatch不可用，使用本地存储');
          uni.setStorageSync('userRole', role);
        }
      } catch (error) {
        console.error('更新用户角色失败', error);
        try {
          if (store && typeof store.commit === 'function') {
            store.commit('user/baseInfo/updateRole', role);
          }
          uni.setStorageSync('userRole', role);
        } catch (e) {
          console.error('更新用户角色本地存储失败', e);
        }
      }
    },
    
    /**
     * @description 加载用户数据
     */
    async loadUserData() {
      this.isLoading = true;
      
      try {
        // 确保用户已登录（模拟模式下）
        this.ensureUserLogin();
        
        await this.syncUserDataFromVuex();
      } catch (error) {
        console.error('加载用户数据失败', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * @description 从Vuex同步用户数据
     */
    async syncUserDataFromVuex() {
      try {
        if (store && typeof store.dispatch === 'function') {
          const result = await store.dispatch('user/baseInfo/getUserInfo');
          
          if (result && result.nickname) {
            this.userData = { ...result };
            this.userName = result.nickname || '用户';
            this.isLoggedIn = true;
          } else if (this.profile && this.profile.nickname) {
            this.userData = { ...this.profile };
            this.userName = this.profile.nickname || '用户';
            this.isLoggedIn = true;
          }
        } else {
          // 如果store不可用，加载模拟数据
          this.loadMockDataFallback();
        }
      } catch (error) {
        console.error('同步用户数据失败', error);
        // 加载模拟数据作为回退方案
        this.loadMockDataFallback();
      }
    },
    
    /**
     * @description 加载模拟数据作为回退
     */
    loadMockDataFallback() {
      if (this.useMockData) {
        this.userData = {
          avatar: '/static/image/tab-bar/default_avatar.png',
          nickname: '模拟用户',
          role: 'teacher'
        };
        this.userName = '模拟用户';
        this.isLoggedIn = true;
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