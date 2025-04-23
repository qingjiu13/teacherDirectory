<template>
  <view class="container">
    <view class="settings-list">
      <!-- 切换身份 -->
      <view class="settings-item" @click="handleSwitchRole">
        <view class="icon-circle info">
          <text class="icon-text">🔄</text>
        </view>
        <text class="settings-text">切换身份（当前：{{isTeacher ? '老师' : '学生'}}）</text>
        <view class="role-badge" v-if="useMockData">
          <text class="badge-text">模拟</text>
        </view>
      </view>
      
      <!-- 联系我们 -->
      <view class="settings-item" @click="handleContactUs">
        <view class="icon-circle info">
          <text class="icon-text">📞</text>
        </view>
        <text class="settings-text">联系我们</text>
      </view>
      
      <!-- 退出登录 -->
      <view class="settings-item" @click="handleLogout" v-if="isLoggedIn">
        <view class="icon-circle warning">
          <text class="icon-text">⚠</text>
        </view>
        <text class="settings-text">退出登录</text>
      </view>
      
      <!-- 模拟数据开关 -->
      <view class="settings-item" @click="toggleMockData">
        <view class="icon-circle" :class="{'success': useMockData, 'info': !useMockData}">
          <text class="icon-text">{{useMockData ? '✓' : '🔄'}}</text>
        </view>
        <text class="settings-text">{{useMockData ? '关闭' : '开启'}}模拟数据</text>
      </view>
      
      <!-- 当前使用的模拟数据状态 -->
      <view class="mock-info" v-if="useMockData">
        <view class="mock-info-header">
          <text class="mock-info-title">模拟数据信息</text>
        </view>
        <view class="mock-info-content">
          <view class="mock-info-item">
            <text class="mock-label">模拟用户：</text>
            <text class="mock-value">{{mockUserInfo}}</text>
          </view>
          <view class="mock-info-item">
            <text class="mock-label">测试账号：</text>
            <text class="mock-value">学生：zhangsan/123456；老师：lisi/654321</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @description 设置页面
 */
import { Navigator } from '@/router/Router.js';
import store from '@/store';
import { USE_MOCK_DATA, getApiImplementation } from '@/store/user/baseInfo/config.js';

export default {
  data() {
    return {
      isLoggedIn: true, // 默认设为true方便调试
      switching: false,  // 角色切换中状态
      useMockData: false,  // 模拟数据开关
      mockUserInfo: '' // 当前模拟用户信息
    }
  },
  computed: {
    // 直接从store获取数据，替代mapGetters
    isTeacher() {
      return store.getters['user/baseInfo/isTeacher'];
    },
    userRole() {
      return store.getters['user/baseInfo/userRole'];
    },
    profile() {
      return store.getters['user/baseInfo/profile'];
    },
    isStudent() {
      return !this.isTeacher;
    }
  },
  onLoad() {
    // 检查登录状态
    const token = uni.getStorageSync('token');
    this.isLoggedIn = !!token;
    
    // 检查模拟数据设置
    this.checkMockDataStatus();
    
    // 获取模拟用户信息
    this.getMockUserInfo();
  },
  methods: {
    // 直接调用store的dispatch方法，替代mapActions
    
    /**
     * @description 检查模拟数据状态
     */
    checkMockDataStatus() {
      // 首先检查全局配置
      this.useMockData = USE_MOCK_DATA;
      
      // 然后检查本地存储设置，优先使用本地存储的设置
      const localMockSetting = uni.getStorageSync('use_mock_api');
      if (localMockSetting !== '') {
        this.useMockData = localMockSetting === 'true';
      }
      
      console.log('当前模拟数据状态:', this.useMockData ? '使用模拟数据' : '使用真实API');
    },
    
    /**
     * @description 获取模拟用户信息
     */
    async getMockUserInfo() {
      if (this.useMockData) {
        try {
          await store.dispatch('user/baseInfo/getUserInfo');
          this.mockUserInfo = `${this.profile.nickname || '未登录'} (${this.isTeacher ? '老师' : '学生'})`;
        } catch (error) {
          console.error('获取模拟用户信息失败:', error);
          this.mockUserInfo = '未知用户';
        }
      } else {
        this.mockUserInfo = '';
      }
    },
    
    /**
     * @description 处理切换身份
     */
    handleSwitchRole() {
      if (this.switching) return;
      
      // 确定切换的目标角色
      const newRole = this.isTeacher ? 'student' : 'teacher';
      
      uni.showModal({
        title: '切换身份',
        content: `确定要切换到${newRole === 'teacher' ? '老师' : '学生'}模式吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              this.switching = true;
              
              // 使用store.dispatch调用action
              await store.dispatch('user/baseInfo/updateRole', newRole);
              
              uni.showToast({
                title: newRole === 'teacher' ? '已切换为老师模式' : '已切换为学生模式',
                icon: 'none'
              });
              
              // 返回到"我的"页面并刷新
              setTimeout(() => {
                Navigator.reLaunch('/pages/mine/mine/mine_common');
              }, 1500);
            } catch (error) {
              console.error('切换角色失败:', error);
              uni.showToast({
                title: '切换角色失败',
                icon: 'none'
              });
            } finally {
              this.switching = false;
            }
          }
        }
      });
    },
    
    /**
     * @description 处理联系我们
     */
    handleContactUs() {
      uni.showModal({
        title: '联系我们',
        content: '客服电话：400-123-4567\n客服邮箱：support@example.com\n工作时间：周一至周五 9:00-18:00',
        showCancel: false
      });
    },
    
    /**
     * @description 处理退出登录
     */
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              // 使用store.dispatch调用登出action
              await store.dispatch('user/baseInfo/logout');
              
              uni.showToast({
                title: '已退出登录',
                icon: 'success'
              });
              
              // 增加延迟确保数据清除
              setTimeout(() => {
                // 返回到"我的"页面
                Navigator.reLaunch('/pages/mine/mine/mine_common');
              }, 1500);
            } catch (error) {
              console.error('退出登录时出错:', error);
              uni.showToast({
                title: '退出登录时出错',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    /**
     * @description 切换模拟数据开关
     */
    toggleMockData() {
      // 切换设置
      this.useMockData = !this.useMockData;
      // 保存设置
      uni.setStorageSync('use_mock_api', this.useMockData ? 'true' : 'false');
      
      // 更新模拟用户信息
      this.getMockUserInfo();
      
      uni.showToast({
        title: this.useMockData ? '已开启模拟数据' : '已关闭模拟数据',
        icon: 'none'
      });
      
      // 提示需要重启应用
      setTimeout(() => {
        uni.showModal({
          title: '提示',
          content: '设置已更改，推荐刷新或重启应用以使更改完全生效',
          showCancel: true,
          confirmText: '刷新',
          success: (res) => {
            if (res.confirm) {
              // 刷新当前页面
              Navigator.reLaunch('/pages/mine/settings');
            }
          }
        });
      }, 1000);
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: #ffffff;
  padding: 20rpx 0;
}

.settings-list {
  width: 100%;
}

.settings-item {
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

.settings-text {
  font-size: 30rpx;
  color: #333;
  text-align: left;
  flex: 1;
}

.role-badge {
  background-color: #FF9800;
  border-radius: 20rpx;
  padding: 4rpx 16rpx;
  margin-right: 30rpx;
}

.badge-text {
  color: #FFFFFF;
  font-size: 20rpx;
}

/* 模拟数据信息样式 */
.mock-info {
  margin: 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.mock-info-header {
  background-color: #FFB300;
  padding: 20rpx;
}

.mock-info-title {
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: bold;
}

.mock-info-content {
  background-color: #FFF9C4;
  padding: 20rpx;
}

.mock-info-item {
  margin-bottom: 10rpx;
}

.mock-label {
  font-size: 26rpx;
  color: #FF6F00;
  font-weight: bold;
}

.mock-value {
  font-size: 26rpx;
  color: #333333;
}
</style>