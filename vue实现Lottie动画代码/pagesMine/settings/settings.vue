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
  <Header :title="'设置'" @back="handleBack"/>
  <view class="container">
    <view class="settings-list">
      <!-- 切换身份 -->
      <view class="settings-item" @click="handleSwitchRole">
        <view class="icon-circle-info">
          <image src="/pagesMine/static/settings/exchange.png" class="icon" mode="widthFix" />
        </view>
        <text class="settings-text">切换身份（当前：{{isTeacher ? '老师' : '学生'}}）</text>
      </view>
      <!--修改个人信息-->
      <view class="settings-item" @click="handleModifyInfo">
        <view class="icon-circle-info">
          <image src="/pagesMine/static/settings/exchange.png" class="icon" mode="widthFix" />
        </view>
        <text class="settings-text">修改个人信息</text>
      </view>
      <!-- 退出登录 -->
      <view class="settings-item" @click="handleLogout" v-if="isLoggedIn">
        <view class="icon-circle-info">
          <image src="/pagesMine/static/settings/logout.png" class="icon" mode="widthFix" />
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
import Header from '@/components/navigationTitleBar/header';

export default {
  components: {
    Header
  },
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
    handleBack() {
      Navigator.toMine();
    },
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
                Navigator.reLaunch('/pagesMine/mine/mine_common');
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
                Navigator.reLaunch('/pagesMine/mine/mine_common');
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
  background-color: transparent;
  padding-top: 20rpx;
}
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
.settings-list {
  width: 100%;
}

.settings-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 20rpx 0;
  border-bottom: 2rpx solid rgba(217, 217, 217, 1);
  min-height: 100rpx;
}

.icon-circle-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}


.icon {
  width: 60rpx;
  margin-left: 60rpx;
}



.settings-text {
  height: 25rpx;
  width: 100%;
  font-size: 25rpx;
  color: rgba(0, 0, 0, 1);
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -1.1rpx;
  margin-left: 30rpx;
}
</style>