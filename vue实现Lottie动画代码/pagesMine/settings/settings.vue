<template>
  <view class="container">
    <view class="settings-list">
      <!-- 切换身份 -->
      <view class="settings-item" @click="handleSwitchRole">
        <view class="icon-circle info">
          <text class="icon-text">🔄</text>
        </view>
        <text class="settings-text">切换身份（当前：{{isTeacher ? '老师' : '学生'}}）</text>
      </view>
      <!--修改个人信息-->
      <view class="settings-item" @click="handleModifyInfo">
        <view class="icon-circle info">
          <text class="icon-text">🔄</text>
        </view>
        <text class="settings-text">修改个人信息</text>
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
    </view>
  </view>
</template>

<script>
/**
 * @description 设置页面
 */
import { Navigator } from '@/router/Router.js';
import store from '@/store';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isLoggedIn: false, 
      switching: false,  // 角色切换中状态
    }
  },
  computed: {
    ...mapGetters({
      isTeacher: 'user/baseInfo/isTeacher',
      userRole: 'user/baseInfo/userRole',
      profile: 'user/baseInfo/profile'
    }),
    isStudent() {
      return !this.isTeacher;
    }
  },
  onLoad() {
    // 检查登录状态
    this.isLoggedIn = store.getters['user/baseInfo/id'] !== '';
  },
  methods: {
    // 直接调用store的dispatch方法，替代mapActions
    /**
     * @description 处理修改个人信息
     */
    handleModifyInfo() {
      Navigator.toModify();
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
                Navigator.reLaunch('/pages/mine/mine_common');
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
                Navigator.reLaunch('/pages/mine/mine_common');
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
</style>