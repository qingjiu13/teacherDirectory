<template>
  <view class="container">
    <view class="top-bg-wrapper">
      <image class="top-image" src="../static/mine/topImage.png" mode="widthFix"></image>
      <view class="overlay-content">
        <!-- 用户信息区 -->
        <view class="user-info">
          <image class="campus-ambassador" v-if="storeCampusAmbassador && storeRole === '老师'" src="../static/mine/CampusAmbassador.png" mode="widthFix"></image>
          <view class="avatar-wrapper">
            <view class="avatar-outer">
              <view class="avatar-inner">
                <image class="avatar" :src="userData.avatar || storeAvatar || '/pagesMine/static/defaultAvatar/teacher-man.png'" mode="aspectFill" @click="handleClick"></image>
              </view>
            </view>
          </view>
          <view class="nickname-row">
            <text class="login-text" @click="handleClick">{{ userData.name || storeName || '登录' }}</text>
            <image class="edit-profile-icon" src="../static/mine/edit.png" mode="widthFix" @click="navModify"></image>
          </view>
          <!-- 是否认证 -->
          <view class="certification-row">
            <image class="user-tag" src="../static/mine/teacher.png" v-if="storeRole === '老师'" mode="heightFix"></image>
            <image class="user-tag" src="../static/mine/student.png" v-if="storeRole === '学生'" mode="heightFix"></image>
            <image class="user-tag" src="/static/image/certify/certified.png" v-if="storeCertificate === 1 && storeRole === '老师'" mode="heightFix"></image>
            <image class="user-tag" src="/static/image/certify/uncertified.png" v-if="storeCertificate === 0 && storeRole === '老师'" mode="heightFix"></image>
          </view>
          <view class="middle-list">
            <view class="middle-item">
              <image class="middle-icon" src="../static/mine/order.png" mode="heightFix" @click="toOrderCommon"></image>
              <text class="middle-text">订单</text>
            </view>
            <view class="middle-item">
              <image class="middle-icon" src="../static/mine/course.png" mode="heightFix" @click="toCourse"></image>
              <text class="middle-text">课程</text>
            </view>
            <view class="middle-item">
              <image class="middle-icon" src="../static/mine/bill.png" mode="heightFix" @click="toBill"></image>
              <text class="middle-text">账单</text>
            </view>
            <view class="middle-item">
              <image class="middle-icon" src="../static/mine/customer.png" mode="heightFix" @click="handleContactUs"></image>
              <text class="middle-text">客服</text>
            </view>
          </view>
        </view>
        
        <!-- 菜单列表 -->
        <view class="menu-list">
          <!-- 老师特有功能菜单 -->
          <view v-if="storeRole === '老师'" class="menu-item" @click="toService">
            <view class="icon-circle-info">
              <image class="icon-image" src="../static/mine/service.png" mode="widthFix"></image>
            </view>
            <text class="menu-text">我的服务</text>
            <image class="arrow-image" src="/static/image/arrow/arrow_right.png" mode="heightFix"></image>
          </view>
          <!-- 老师特有菜单项：资质认证 -->
          <view v-if="storeRole === '老师' && storeCertificate === 0" class="menu-item" @click="toQualification">
            <view class="icon-circle-info">
              <image class="icon-image" src="../static/mine/qualification.png" mode="widthFix"></image>
            </view>
            <text class="menu-text">资质认证</text>
            <image class="arrow-image" src="/static/image/arrow/arrow_right.png" mode="heightFix"></image>
          </view>

          <!-- 共有菜单项：设置 -->
          <view class="menu-item" @click="toSettings">
            <view class="icon-circle-info">
              <image class="icon-image" src="../static/mine/settings.png" mode="widthFix"></image>
            </view>
            <text class="menu-text">设置</text>
            <image class="arrow-image" src="/static/image/arrow/arrow_right.png" mode="heightFix"></image>
          </view>
        </view>
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
import { Navigator} from '@/router/Router.js';
import TabBar from '@/components/tab-bar/tab-bar.vue';
import store from '@/store/index.js';
import { mapState } from 'vuex';

export default {
  components: {
    TabBar
  },
  data() {
    return {
      userData: {},
      isLoggedIn: store.getters['user/baseInfo/id'] !== '',
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
      storeRole: state => state.userInfo?.role || '学生',
      storeCertificate: state => state.userInfo?.certificate || 0,
      storeCampusAmbassador: state => state.campusAmbassador
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
        role: this.storeRole
      });
      
      // 如果store有数据，直接使用
      if (this.storeName) {
        this.userData = {
          id: this.storeId,
          avatar: this.storeAvatar,
          name: this.storeName,
          gender: this.storeGender
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
          console.log('角色更新成功, 新角色:', this.storeRole);
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
              gender: result.gender || ''
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
          const parsedData = JSON.parse(localUserData);
          this.userData = {
            id: parsedData.id || '',
            avatar: parsedData.avatar || '',
            name: parsedData.name || '',
            gender: parsedData.gender || ''
          };
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
            this.userData = { 
              id: parsedInfo.id || '',
              avatar: parsedInfo.avatar || '',
              name: parsedInfo.name || '',
              gender: parsedInfo.gender || ''
            };
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
    handleClick() {
      if (this.isLoggedIn) {
        Navigator.toModify();
      } else {
        // 未登录时导航到登录页
        Navigator.toWechatLogin();
      }
    },
    /**
     * @description 跳转到修改页面
     */
    navModify(){
      Navigator.toModify();
    },
    /**
     * @description 页面跳转方法
     * @param {string} url - 目标页面路径
     */
    navigateTo(url) {
      Navigator.navigateTo(url);
    },
    
    /**
     * @description 跳转到订单列表页面
     */
    toOrderCommon() {
      Navigator.toOrderCommon();
    },
    
    /**
     * @description 跳转到课程列表页面
     */
    toCourse() {
      Navigator.toCourse();
    },
    
    /**
     * @description 跳转到资质认证页面
     */
    toQualification() {
      Navigator.toQualification();
    },
    
    /**
     * @description 跳转到钱包页面
     */
    toBill() {
      Navigator.toBill();
    },
    
    /**
     * @description 跳转到设置页面
     */
    toSettings() {
      Navigator.toSettings();
    },
    
    toService() {
      Navigator.toService();
    },
    
    /**
     * @description 处理联系我们
     */
    handleContactUs() {
      Navigator.toChat(1);//客服id（暂待定）
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
.top-bg-wrapper {
  position: relative;
  height:100%;
  width: 100%;
}
.top-image {
  width: 100%;
  display: block;
  object-fit: cover;
  z-index: 0;
}
.overlay-content {
  position: absolute;
  top:450rpx;
  left: 0;
  width: 100%;
  z-index: 1;
  background-color:rgba(255, 255, 255, 1);
  border-radius:140rpx 140rpx 0 0;
  overflow: visible;
}
/* 用户信息区样式 */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  border-bottom: 1px solid #f0f0f0;
  min-height: 450rpx;
  position: relative;
  z-index: 2;
  overflow: visible;
}
.campus-ambassador{
  height: 190rpx;
  width: 46rpx;
  top:0;
  left:570rpx;
  position: absolute;
}
.avatar-wrapper {
  width: 180rpx;
  height: 180rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 3;
  margin-top: -90rpx;
}

/*
 * @description 头像外层正方形底板
 */
.avatar-outer {
  width: 180rpx;
  height: 180rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

/*
 * @description 头像内层正方形底板
 */
.avatar-inner {
  width: 168rpx; /* 200rpx - 6rpx*2 */
  height: 168rpx;
  border-radius: 30rpx;
  background: rgba(239, 240, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

/*
 * @description 头像图片本身
 */
.avatar {
  width: 180rpx;
  height: 180rpx;
  object-fit: cover;
  background-color: transparent;
  border: none;
}

.nickname-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 30rpx;
  overflow: visible;
}

.login-text {
  font-size: 38rpx;
  text-align: center;
  font-family: PingFang SC;
  font-weight: 550;
  line-height: 100%;
  letter-spacing: -1.26rpx;
}
.edit-profile-icon{
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  margin-left: 130rpx;
  margin-top: -8rpx;
}

.middle-list{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 40rpx;
}
.middle-item{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 40rpx;
  margin-right: 40rpx;
}
.middle-icon{
  height:85rpx;
}
.middle-text{
  height: 25rpx;
  width: 100%;
  font-size: 25rpx;
  color: rgba(0, 0, 0, 1);
  text-align: center;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: -1.1rpx;
  margin-top: 20rpx;
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

/*
 * @description 菜单项容器，设置为相对定位以便子元素绝对定位
 */
.menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative; /* 新增：为绝对定位子元素做准备 */
  min-height: 100rpx;
}
.icon-circle-info{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.icon-image{
  width: 60rpx;
  margin-left: 60rpx;
}
/**
 * @description 右侧箭头图标，绝对定位于父容器右侧
 */
.arrow-image{
  height: 28rpx;
  position: absolute; /* 新增：绝对定位 */
  right: 40rpx;        /* 新增：距离右侧30rpx，可根据需要调整 */
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
.certification-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 40rpx;
}
.user-tag{
  height: 50rpx;
  margin-left: 15rpx;
}
</style>