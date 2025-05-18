<template>
  <Header :title="'导师详情'" @back="handleBack" class="header-container"/>
  <view class="container">
    <!-- 主要内容区域（可滚动） -->
    <scroll-view class="content-area" scroll-y="true">
      
      <!-- 加载状态指示器 -->
      <view class="loading-container" v-if="isLoading">
        <loading-animation
          src="https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json"
          width="150rpx" 
          height="150rpx"
          :showText="true"
          text="加载中..."
        ></loading-animation>
      </view>
      
      <!-- 老师信息区域 -->
      <view v-if="!isLoading">
        <!-- 头像独立于容器 -->
        <image class="teacher-avatar" :src="teacherData.avatar || '/static/image/defaultAvatar/teacher-man.png'" mode="aspectFill"></image>
        
        <!-- 老师个人信息卡片 -->
        <view class="teacher-profile">
          <!-- 昵称部分 -->
          <view class="name-row">
            <view class="teacher-info">
              <text class="teacher-name">{{teacherData.name}}</text>
            </view>
          </view>
          
          <!-- 学校专业信息 -->
          <view class="education-info">
            {{teacherData.school}} | {{teacherData.major}}
          </view>
          
          <!-- 个人简介 -->
          <view class="profile-intro">
            <text class="intro-title">个人简介：</text>
            <text class="intro-text">{{teacherData.selfIntroduction || '这位老师很懒，还没有填写个人简介。'}}</text>
          </view>
        </view>
        
        <!-- 服务部分（独立容器） -->
        <view class="services-section">
          <!-- 标签页导航 -->
          <view class="tab-navigation">
            <view 
              class="tab-item" 
              :class="{ active: activeTab === 'services' }" 
              @click="switchTab('services')"
            >
              服务
            </view>
          </view>
          
          <!-- 服务列表内容 -->
          <view class="services-container" v-if="activeTab === 'services'">
            <block v-if="teacherData.service && teacherData.service.length > 0">
              <view class="service-card" v-for="(service, index) in teacherData.service" :key="index" @click="goToServiceDetail(service.id)">
                <view class="service-card-header">
                  <view class="service-image-container">
                    <image class="service-image" :src="service.image || '/static/image/services/default_service.png'" mode="aspectFill"/>
                  </view>
                  <view class="service-title-price">
                    <text class="service-title">{{service.name}}</text>
                    <text class="service-price">¥{{service.price}}</text>
                  </view>
                </view>
                <view class="service-description-container">
                  <text class="service-description">{{service.description}}</text>
                </view>
              </view>
              <view class="consult-button-container">
                <view class="consult-button" @click="startConsultation">立即咨询</view>
              </view>
            </block>
            <view class="empty-tip" v-else>
              该老师暂未开通服务
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 在页面底部添加服务详情浮窗 -->
    <view class="service-detail-popup" v-if="showServiceDetail">
      <view class="popup-mask" @click="closeServiceDetail"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">服务详情</text>
          <text class="popup-close" @click="closeServiceDetail">×</text>
        </view>
        
        <scroll-view scroll-y class="popup-body">
          <!-- 服务基本信息 -->
          <view class="service-info">
            <image class="service-image" :src="currentService.image" mode="aspectFill"></image>
            <view class="service-name">{{currentService.name}}</view>
            <view class="service-price">{{currentService.price}}</view>
          </view>
          
          <!-- 服务类型信息 -->
          <view class="service-type-info">
            <view class="info-title">服务类型</view>
            <view class="info-content">
              <view class="info-item">
                <text class="item-label">类型：</text>
                <text class="item-value">{{currentService.type.typename}}</text>
              </view>
              
              <!-- 根据服务类型显示不同的信息 -->
              <block v-if="currentService.type.typename === '一对一课程' || currentService.type.typename === '一对多课程'">
                <view class="info-item">
                  <text class="item-label">课程节数：</text>
                  <text class="item-value">{{currentService.type.coursenum}}节</text>
                </view>
                <view class="info-item">
                  <text class="item-label">总时长：</text>
                  <text class="item-value">{{currentService.type.fulllength.hours}}{{currentService.type.fulllength.minutes}}</text>
                </view>
              </block>
              
              <!-- 仅对一对多课程显示学生人数 -->
              <view class="info-item" v-if="currentService.type.typename === '一对多课程'">
                <text class="item-label">学生人数：</text>
                <text class="item-value">{{currentService.type.studentnum}}人</text>
              </view>
            </view>
          </view>
          
          <!-- 服务描述 -->
          <view class="service-description">
            <view class="info-title">服务描述</view>
            <view class="description-content">{{currentService.description}}</view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import { Navigator, MatchRoutes } from '@/router/Router.js'
import { mapGetters, mapState } from 'vuex'
import Header from '@/components/navigationTitleBar/header';
import LoadingAnimation from '@/components/loading/LoadingAnimation.vue';

/**
* @file 老师详情页
* @description 展示老师个人信息和服务
*/
export default {
    components: {
      Header,
      LoadingAnimation
    },
    data() {
      return {
          teacherId: null,
          activeTab: 'services', // 当前选中的标签页
          isLoading: false, // 是否正在加载
          showServiceDetail: false,
          currentService: null
      }
    },
    
    computed: {
      /**
       * @description 从Vuex获取匹配列表和教师详情
       * @returns {Array} 匹配的老师列表和教师详细信息
       */
      ...mapState('user/match', ['matchList']),
      
      /**
       * @description 根据ID获取当前教师数据
       * @returns {Object} 教师详细信息
       */
      teacherData() {   
        // 从matchList中过滤出当前教师
        const teacher = this.matchList.find(t => t.id === this.teacherId);
        return teacher || {
          id: null,
          name: '',
          avatar: '/static/image/defaultAvatar/teacher-man.png',
          school: '',
          major: '',
          certificate: 0,
          selfIntroduction: '暂无数据',
          service: []
        };
      },
      
      /**
       * @description 获取老师的服务列表
       * @returns {Array} 服务列表
       */
      services() {
        // 保证始终返回数组，防止undefined
        return (this.teacherData && Array.isArray(this.teacherData.service)) ? this.teacherData.service : [];
      }
    },
    onLoad(options) {
      // 获取老师ID
      this.teacherId = options.id || '';
      
      if (!this.teacherId) {
        uni.showToast({
          title: '未获取到教师ID',
          icon: 'none'
        });
        return;
      }
      
      // 显示加载状态
      this.isLoading = true;
      
      // 模拟获取教师详情
      setTimeout(() => {
        // 在实际应用中，这里应该调用API获取教师详情，然后通过commit修改状态
        // 例如：const teacherDetail = await getTeacherDetail({teacherId: this.teacherId});
        // this.$store.commit('user/match/SET_TEACHER_DETAIL', {teacherId: this.teacherId, detail: teacherDetail});
        
        // 这里我们假设使用现有的教师数据
        const teacherIndex = this.matchList.findIndex(t => t.id === this.teacherId);
        if (teacherIndex === -1) {
          uni.showToast({
            title: '未找到该教师信息',
            icon: 'none'
          });
        }
        
        // 加载结束
        this.isLoading = false;
      }, 1000);
    },
    
    methods: {
      /**
       * @description 返回上一页
       */
      handleBack() {
        Navigator.redirectTo(MatchRoutes.MATCH);
      },
      /**
       * @description 切换标签页
       * @param {String} tab - 标签名称
       */
      switchTab(tab) {
        if (this.activeTab !== tab) {
          this.activeTab = tab;
        }
      },
      
      /**
       * @description 发起咨询
       */
      startConsultation() {
        this.isLoading = true;
        
        // 简单延迟模拟处理过程
        setTimeout(() => {
          this.isLoading = false;
          // 使用router.js中的方法跳转到聊天页面
          Navigator.toChat(this.teacherId);
        }, 500);
      },
      
      /**
       * @description 跳转到服务详情页
       * @param {String} serviceId - 服务ID
       */
      goToServiceDetail(serviceId) {
        // 防御性判断，确保 services 一定是数组
        const services = Array.isArray(this.services) ? this.services : [];
        const service = services.find(s => s.id === serviceId);
        if (service) {
          this.currentService = service;
          this.showServiceDetail = true;
        } else {
          uni.showToast({
            title: '未找到服务信息',
            icon: 'none'
          });
        }
      },
      
      /**
       * @description 关闭服务详情浮窗
       */
      closeServiceDetail() {
        this.showServiceDetail = false;
        this.currentService = null;
      }
    }
}
</script>

<style>
  /* 全局样式变量 */
  page {
    --primary-color: #1E90FF;
    --primary-light: #87CEEB;
    --primary-dark: #0073CF;
    --gradient-blue: linear-gradient(135deg, #1E90FF, #00BFFF);
    --gradient-blue-light: linear-gradient(135deg, #87CEEB, #48D1CC);
    --text-primary: #333333;
    --text-secondary: #666666;
    --text-light: #999999;
    --bg-color: #F5F9FC;
    --card-shadow: 0 4px 12px rgba(30, 144, 255, 0.1);
    font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  }
  
  /* 加载动画容器 */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
    height: 60vh;
  }
  
  .header-container {
	/**
	 * @description 固定顶部导航栏，背景不透明，确保在最上层
	 */
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
	z-index: 100;
}
  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--bg-color);
    position: relative;
    overflow: hidden;
  }
  
  /* 内容区域 */
  .content-area {
    flex: 1;
  }
  
  /* 老师个人信息区域 */
  .teacher-profile {
    background-color: #ffffff;
    padding: 20px;
    margin: 35px 15px 0 15px;
    border-radius: 16px 16px 0 0;
    box-shadow: var(--card-shadow);
    position: relative;
    z-index: 1;
  }
  
  /* 头像样式 - 独立于容器 */
  .teacher-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    border: 4px solid #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    position: absolute;
    left: 8px;
    top: 8px;
    z-index: 10;
    background-color: #ffffff;
  }
  
  /* 昵称部分 */
  .name-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    margin-top: 25px;
    margin-left: -100px; 
  }
  
  .teacher-info {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  .teacher-name {
    font-size: 18px;
    font-weight: bold;
    color: var(--text-primary);
    margin-right: 10px;
  }
  
  .education-info {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 5px;
    margin-bottom: 15px;
    margin-left: 50px;
  }
  
  .profile-intro {
    padding: 12px;
    background-color: rgba(30, 144, 255, 0.05);
    border-radius: 12px;
    border-left: 3px solid var(--primary-color);
  }
  
  .intro-title {
    font-size: 14px;
    font-weight: bold;
    color: var(--text-primary);
    margin-bottom: 5px;
    display: block;
  }
  
  .intro-text {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  /* 标签页导航 */
  .tab-navigation {
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: #ffffff;
    padding: 12px 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin: 0 15px;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
  }
  
  .tab-item {
    padding: 10px 10px;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-secondary);
    position: relative;
    transition: all 0.3s ease;
    min-width: 80px;
    text-align: center;
    margin-left: -280px;
    margin-top: -10px;
  }
  
  .tab-item.active {
    color: #2196F3;
  }
  
  .tab-item.active:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 3px;
    background-image: linear-gradient(45deg, #007AFF, #00C6FF);
    border-radius: 3px;
  }
  
  /* 动态和服务容器 */
  .posts-container,
  .services-container {
    padding: 0 15px 30px 15px;
    background-color: #ffffff;
    margin: 0 15px;
    border-radius: 0 0 16px 16px;
    box-shadow: var(--card-shadow);
  }
  
  /* 服务部分样式 */
  .service-card {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 16px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .service-card-header {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }
  
  .service-image-container {
    width: 70px;
    height: 70px;
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .service-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
  
  .service-title-price {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .service-title {
    font-size: 16px;
    font-weight: bold;
    color: var(--text-primary);
    margin-bottom: 8px;
  }
  
  .service-price {
    font-size: 16px;
    color: #FF6347;
    font-weight: 500;
  }
  
  .service-description-container {
    width: 100%;
  }
  
  .service-description {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
  }
  
  .consult-button-container {
    margin-top: 20px;
    padding: 0 15px;
  }
  
  .consult-button {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-image: var(--gradient-blue);
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    border-radius: 25px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(30, 144, 255, 0.3);
    transition: all 0.3s ease;
  }
  
  .consult-button:active {
    transform: translateY(2px);
    box-shadow: 0 2px 8px rgba(30, 144, 255, 0.3);
  }
  
  /* 空状态提示 */
  .empty-tip {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: var(--text-light);
    font-size: 16px;
  }
  
  .empty-tip::before {
    content: '';
    width: 60px;
    height: 60px;
    margin-bottom: 15px;
    background-color: rgba(30, 144, 255, 0.1);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .services-section {
    margin-top: 15px;
    position: relative;
    z-index: 1;
  }
  
  /* 服务详情浮窗样式 */
  .service-detail-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .popup-content {
    position: relative;
    width: 80%;
    height: 80%;
    background-color: #fff;
    border-radius: 12rpx;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .popup-header {
    padding: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #eee;
  }
  
  .popup-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .popup-close {
    font-size: 40rpx;
    color: #999;
    padding: 0 10rpx;
  }
  
  .popup-body {
    flex: 1;
    padding: 20rpx;
  }
  
  .service-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30rpx;
  }
  
  .service-image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 8rpx;
    margin-bottom: 20rpx;
  }
  
  .service-name {
    font-size: 34rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
  
  .service-price {
    font-size: 32rpx;
    color: #f56c6c;
    font-weight: bold;
  }
  
  .service-type-info,
  .service-description {
    margin-bottom: 30rpx;
  }
  
  .info-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 15rpx;
    color: #333;
  }
  
  .info-content {
    background-color: #f8f8f8;
    border-radius: 8rpx;
    padding: 15rpx;
  }
  
  .info-item {
    display: flex;
    margin-bottom: 10rpx;
  }
  
  .item-label {
    color: #666;
    width: 150rpx;
  }
  
  .item-value {
    color: #333;
    flex: 1;
  }
  
  .description-content {
    background-color: #f8f8f8;
    border-radius: 8rpx;
    padding: 15rpx;
    line-height: 1.5;
    color: #333;
  }

</style>