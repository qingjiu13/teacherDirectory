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
  <view class="container">
    <Header :title="'导师详情'" @back="handleBack"/>
    <!-- 主要内容区域（可滚动） -->
    <view class="content-area" scroll-y="false">
      
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
        <view class="teacher-profile-container">
          <view class="teacher-profile-outer">
            <view class="teacher-profile-outer-gradient">
              <view class="teacher-profile-inner">
                <!-- 老师个人信息卡片 -->
                <view class="teacher-profile">
                  <view class="avatar-wrapper">
                    <view class="avatar-outer">
                      <view class="avatar-inner">
                        <image class="avatar" :src="teacherData.avatar || '/static/image/defaultAvatar/teacher-man.png'" mode="aspectFill"></image>
                      </view>
                    </view>
                  </view>
                  <view class="teacher-container">
                    <view class="teacher-name-container">
                      <!-- 昵称部分 -->
                      <view class="name-row">
                        <view class="teacher-info">
                          <text class="teacher-name">{{teacherData.name}}</text>
                        </view>
                      </view>
                      <!--是否认证-->
                      <image class="certification-image" src="/static/image/certify/certified.png" mode="heightFix" v-if="teacherData.certificate" alt="已认证图标"></image>
                      <image class="certification-image" src="/static/image/certify/uncertified.png" mode="heightFix" v-else alt="未认证图标"></image>
                      <!--是否校园大使-->
                      <image class="campus-ambassador-image" src="../static/teacher/campusAmbassador.png" mode="heightFix" v-if="teacherData.campusAmbassador" alt="校园大使图标"></image>
                    </view>
                    <view class="education-info-container">
                      <!-- 学校专业信息 -->
                      <view class="education-info-school">{{teacherData.school}}</view>
                      <view class="education-info-major">{{teacherData.major}}</view>
                    </view>
                  </view>
                </view>
                <!-- 个人简介 -->
                <view class="profile-intro">
                  <text class="intro-text">{{displayIntroduction}}</text>
                  <text class="toggle-intro-btn" v-if="shouldShowToggleBtn" @click="toggleIntroduction">
                    {{isIntroExpanded ? '收起' : '展开'}}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 服务部分（独立容器） -->
        <view class="services-section">
          <view class="services-section-outer">
            <view class="services-section-outer-gradient">
              <view class="services-section-inner">
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
                      <view class="service-card-outer">
                      <image class="service-image" :src="service.image || '../static/teacher/test.png'" mode="aspectFill"/>
                      <view class="service-card-header">
                          <view class="service-title-price">
                            <text class="service-title">{{service.name}}</text>
                            <view class="service-price">
                              <text class="service-price-header">¥</text>
                              <text class="service-price-text">{{service.price}}</text>
                            </view>
                          </view>
                          <text class="service-description">
                            {{ service.description.length >= 40 ? service.description.slice(0, 40) + '...' : service.description }}
                          </text>
                        </view>
                      </view>
                    </view>
                  </block>
                  <view class="empty-tip" v-else>
                    该老师暂未开通服务
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="consult-button-container">
            <button class="consult-button" @click="startConsultation">
                  <image class="consult-button-image" src="../static/teacher/communicate.png" mode="aspectFill" alt="确定图标"></image>
                  <text class="consult-button-text">立即咨询</text>
                </button>
          </view>
      </view>
    </view>
    
    <!-- 在页面底部添加服务详情浮窗 -->
    <view class="service-detail-popup" v-if="showServiceDetail">
      <view class="popup-mask" @click="closeServiceDetail"></view>
      <view class="popup-content">
        <view class="popup-body">
          <view class="image-container">
              <image class="service-image-popup" :src="currentService.image||'../static/teacher/test.png'" mode="widthFix"></image>
              <view class="image-gradient-overlay"></view>
            </view>
          <!-- 服务基本信息 -->
          <view class="service-info">
            <view class="service-name">{{currentService.name}}</view>
            <view class="service-price-popup">
              <text class="service-price-header">¥</text>
              <text class="service-price-text">{{currentService.price}}</text>
            </view>
            <view class="service-type">
              <text class="service-text-popup">{{ currentService.type.typename }}</text>
              <text class="service-horizontal-line" v-if="currentService.type.typename === '一对一课程'||currentService.type.typename === '一对多课程'">|</text>
              <text class="service-text-popup" v-if="currentService.type.typename === '一对一课程'||currentService.type.typename === '一对多课程'">{{ currentService.type.coursenum }}节</text>
              <text class="service-horizontal-line" v-if="currentService.type.typename === '一对一课程'||currentService.type.typename === '一对多课程'">|</text>
              <text class="service-text-popup" v-if="currentService.type.typename === '一对一课程'||currentService.type.typename === '一对多课程'">{{ currentService.type.fulllength.hours }}{{ currentService.type.fulllength.minutes }}</text>
              <text class="service-horizontal-line" v-if="currentService.type.typename === '一对多课程'">|</text>
              <text class="service-text-popup" v-if="currentService.type.typename === '一对多课程'">{{ currentService.type.studentnum }}人</text>
            </view>
            <view class="service-description-popup">
              <view class="description-content">{{currentService.description}}</view>
            </view>
          </view>
        </view>
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
          currentService: null,
          isIntroExpanded: false, // 是否展开个人简介
          introMaxLength: 100 // 简介最大显示字数
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
          campusAmbassador:0,
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
      },
      
      /**
       * @description 获取显示的简介内容
       * @returns {String} 显示的简介内容
       */
      displayIntroduction() {
        const intro = this.teacherData.selfIntroduction || '这位老师很懒，还没有填写个人简介。';
        
        if (!this.isIntroExpanded && intro.length > this.introMaxLength) {
          return intro.substring(0, this.introMaxLength) + '...';
        }
        
        return intro;
      },
      
      /**
       * @description 是否应该显示展开/收起按钮
       * @returns {Boolean} 是否显示按钮
       */
      shouldShowToggleBtn() {
        const intro = this.teacherData.selfIntroduction || '';
        return intro.length > this.introMaxLength;
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
       * @description 切换个人简介的展开/收起状态
       */
      toggleIntroduction() {
        this.isIntroExpanded = !this.isIntroExpanded;
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

/* 全局样式变量 */
  page {
    --gradient-blue: linear-gradient(135deg, #1E90FF, #00BFFF);
    --gradient-blue-light: linear-gradient(135deg, #87CEEB, #48D1CC);
    --text-secondary: #666666;
    --text-light: #999999;
    --bg-color: #F5F9FC;
    font-family: "PingFang SC";
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
  

  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--bg-color);
    position: relative;
    overflow: hidden;
    background-color:transparent;
  }
  
  /* 内容区域 */
  .content-area {
    flex: 1;
  }
  .teacher-profile-container{
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 70rpx 30rpx 0 30rpx;
    position: relative;
    z-index: 1;
    background-color: transparent;
    overflow: visible;
    margin-bottom: 20rpx;
  }
  
  /* 模仿match页面的三层嵌套结构 */
  .teacher-profile-outer {
    width: 100%;
    height: 100%;
    border-radius: 40rpx;
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    background: transparent;
    overflow: visible;
  }
  
  .teacher-profile-outer-gradient {
    width: 100%;
    height: 100%;
    border-radius: 40rpx;
    padding: 2rpx;
    box-sizing: border-box;
    background: linear-gradient(180deg, rgba(228, 241, 255, 1) 0%, rgba(34, 136, 249, 1) 100%);
    overflow: visible;
  }
  
  .teacher-profile-inner {
    width: 100%;
    height: 100%;
    border-radius: 38rpx;
    background: #fff;
    overflow: visible;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 40rpx;
    padding-top: 20rpx;
    overflow: visible;
  }
  
  /**
   * 渐变遮罩效果
   */
  .teacher-profile-inner::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 38rpx;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(194, 221, 250, 0.2) 11.54%, rgba(34, 136, 249, 0.2) 111.54%);
    z-index: 1;
    overflow: visible;
  }
  
  /* 老师个人信息区域 */
  .teacher-profile {
    display: flex;
    flex-direction: row;
    background-color: transparent;
    position: relative;
    z-index: 2;
    overflow: visible;
  }
  .avatar-wrapper {
    width: 180rpx;
    height: 180rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
    margin-top: -80rpx;
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
    position: relative;
    z-index: 10;
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
    position: relative;
    z-index: 10;
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
    border-radius: 30rpx;
  }
  .teacher-container {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .teacher-name-container{
    display: flex;
    flex-direction: row;
    margin-top: 10rpx;
  }
    /* 昵称部分 */
    .name-row {
      display: flex;
      margin-left: 20rpx;
      margin-top: 5rpx;
    }
    
    .teacher-info {
      flex: 1;
      display: flex;
      align-items: center;
    }
    
    .teacher-name {
      font-family: PingFang SC;
    font-weight: 400;
    font-size: 32rpx;
    line-height: 100%;
    letter-spacing: -0.55px;
    color: rgba(0, 0, 0, 1);
    }
    .certification-image{
      height:40rpx;
      margin-left: 10rpx;
    }
    .campus-ambassador-image{
      height:40rpx;
      margin-left: 10rpx;
    }
    .education-info-container{
      display: flex;
      flex-direction: row;
      margin-top: 20rpx;
    }
    .education-info-school {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 22rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
      color: rgba(70, 78, 248, 1);
      margin-left: 20rpx;
    }
    .education-info-major {
     font-family: PingFang SC;
      font-weight: 400;
      font-size: 22rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
      color: rgba(0, 0, 0, 0.5);
      margin-left: 20rpx;
    }
    
    .profile-intro {
      padding: 24rpx;
      margin-top: 20rpx;
      position: relative;
    }
    
    .intro-text {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 22rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
      color: rgba(0, 0, 0, 1);
    }
    
    .toggle-intro-btn {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 22rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
      color: rgba(70, 78, 248, 1);
      position: absolute;
      right: 24rpx;
      bottom: 10rpx;
      padding: 8rpx;
      cursor: pointer;
    }
    
    /* 标签页导航 */
    .tab-navigation {
      display: flex;
      flex-direction: row;
      justify-content: center;
      background-color: transparent;
      padding: 20rpx 30rpx 0;
      border-radius: 0;
      position: relative;
      z-index: 2;

    }
    
    .tab-item {
      padding: 20rpx;
      color: var(--text-secondary);
      position: relative;
      transition: all 0.3s ease;
      min-width: 80px;
      text-align: center;
      margin-left: -280px;
      margin-top: -10px;
      z-index: 2;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 30rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
    }
    
    .tab-item.active {
      color: rgba(95, 38, 247, 1);
    }
    

    
    /* 动态和服务容器 */
    .services-container {
      background-color: transparent;
      border-radius: 0 0 38rpx 38rpx;
      padding:0 40rpx 0 40rpx;
      position: relative;
      z-index: 2;
    }
    
    /* 服务部分样式 */
    .service-card {
      display: flex;
      flex-direction: column;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 20rpx;
      padding: 30rpx 15rpx 30rpx 15rpx;
      margin-bottom: 30rpx;
      position: relative;
      z-index: 2;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
      

    }
    .service-card-header {
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 2;
      width: 100%;
      margin-left:30rpx;
    }
    
    .service-image-container {
      width: 70px;
      height: 70px;
      margin-right: 15px;
      flex-shrink: 0;
    }
    .service-card-outer{
      display: flex;
      flex-direction: row;
      position: relative;
      z-index: 2;
    }
    .service-image {
      width: 150rpx;
      height: 150rpx;
      border-radius: 20rpx;
      border:6rpx solid rgba(255, 255, 255, 1);
    }
    .service-image-popup{
      width: 100%;
      margin-top: -324rpx;
    }
    .image-gradient-overlay{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height:50%; /* 下五分之一 */
      pointer-events: none;
      /* 渐变从透明到白色，从上到下 */
      background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%);
      /* 兼容部分小程序可能需要z-index */
      z-index: 2;
    }
    .service-title-price {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .service-title {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
      color: rgba(0, 0, 0, 1);
      margin-top: 10rpx;

    }
    
    .service-price {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 10rpx;
    }
    .service-price-popup{
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 10rpx;
      margin-left: 40rpx;
    }
    .service-price-header{
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 20rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
      color: rgba(70, 78, 248, 1);
      margin-top:12rpx;
    }
    .service-price-text{
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
      color: rgba(70, 78, 248, 1);
      margin-top:10rpx;
    }
    .service-type{
      display: flex;
      flex-direction: row;
      margin-top:10rpx;
      margin-left: 40rpx;
    }
    .service-text-popup{
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      line-height: 100%;
      letter-spacing: -0.68px;
      color: rgba(0, 0, 0, 1);
      margin-right: 10rpx;
    }
    .service-horizontal-line{
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 24rpx;
      line-height: 100%;
      letter-spacing: -0.68px;
      color: rgba(34, 136, 249, 0.6);
      margin-right: 10rpx;
    }
    .service-description {
      line-height: 1.5;
      margin-top:15rpx;
      margin-right: 10rpx;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 22rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
      color: rgba(0, 0, 0, 1);
      width: 400rpx;

    }
    .service-description-popup{
      width: 100%;
    }
    
    .consult-button-container {
      margin-top: 20px;
      background-color: transparent;
      margin-bottom: 15rpx;
      margin-left: 30rpx;
      margin-right: 30rpx;
    }
    
    .consult-button {
    width: 100%;
    height: 76rpx;
    background: linear-gradient(180deg, #A5A9F7 0%, rgba(70, 78, 248, 0.9) 100%);
    border-radius: 45rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    border-radius: 20rpx;
    flex-direction: row;
    margin-top: 10rpx;
    }
    .consult-button-image {
      width: 36rpx;
      height: 36rpx;
      margin-right: 30rpx;
    }
    .consult-button-text {
      font-size: 32rpx;
    color: rgba(255, 255, 255, 1);
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 100%;
    letter-spacing: -0.68px;
    text-align: center;
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
      margin: 0 30rpx;
      position: relative;
      z-index: 1;
      background-color: transparent;
      overflow: visible;
      margin-top: -2rpx;
    }
    
    /* 模仿match页面的三层嵌套结构 */
    .services-section-outer {
      width: 100%;
      height: 100%;
      border-radius: 40rpx;
      box-sizing: border-box;
      display: flex;
      align-items: stretch;
      justify-content: stretch;
      background: transparent;
      overflow: visible;
    }
    
    .services-section-outer-gradient {
      width: 100%;
      height: 100%;
      border-radius: 40rpx;
      padding: 2rpx;
      box-sizing: border-box;
      background: linear-gradient(180deg, rgba(228, 241, 255, 1) 0%, rgba(34, 136, 249, 1) 100%);
      overflow: visible;
    }
    
    .services-section-inner {
      width: 100%;
      height: 100%;
      border-radius: 38rpx;
      background: #fff;
      overflow: visible;
      display: flex;
      flex-direction: column;
      position: relative;
      padding: 0;
    }
    
    /**
     * 渐变遮罩效果
     */
    .services-section-inner::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 38rpx;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(194, 221, 250, 0.2) 11.54%, rgba(34, 136, 249, 0.2) 111.54%);
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
      background-color: #fff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      width: 648rpx;
      border-radius: 40rpx;
    }

  
    .popup-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: invisible;
      border-radius: 40rpx;
    }
    
    .service-info {
      display: flex;
      flex-direction: column;
      margin-bottom: 30rpx;
      overflow: visible;
    }
    
    
    .service-name {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 32rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
      color: rgba(0, 0, 0, 1);
      margin-left: 40rpx;
      margin-top: -50rpx;
      z-index: 1000;
    }
    
    
    .service-type-info{
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
      padding: 20rpx 40rpx 20rpx 40rpx;
      line-height: 1.5;
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 22rpx;
      line-height: 100%;
      letter-spacing: -0.55px;
      color: rgba(0, 0, 0, 1);


    }

</style>