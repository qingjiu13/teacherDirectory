<template>
    <view class="background-image">
      <!--
        @file ./images/background1.png
        @description 登录页背景图1，分包页面通过相对路径./images/background1.png按需加载
      -->
      <image
        src="/static/image/bgPicture/background1.png"
        mode="aspectFill" alt="背景图"
      />
    </view>
    <view class="background-image">
      <!--
        @file ./images/background.png
        @description 登录页背景图2，分包页面通过相对路径./images/background.png按需加载
      -->
      <image
        src="/static/image/bgPicture/background.png"
        mode="aspectFill" alt="背景图"
      />
    </view>
  <view class="container">

    <!-- 返回按钮 -->
    <!--
      @file ./images/navBack.png
      @description 返回按钮图标，分包页面通过相对路径./images/navBack.png按需加载
    -->
    <image
      class="nav-back"
      src="/static/image/navBack.png"
      mode="aspectFit"
      @click="goBack"
    />
    <text class="title">您的身份是：</text>

    <!-- 同学卡片上方的图片 -->
    <!--
      @file ./images/student.png
      @description 同学身份图片，分包页面通过相对路径./images/student.png按需加载
    -->
    <image
      class="student-image"
      src="../static/login/student.png"
      mode="aspectFit"
    />
    <view class="card student-card" @click="selectIdentity('student')">
      <view class="card-outer student-card-outer">
        <view class="card-outer-gradient student-card-outer-gradient">
          <view class="card-inner student-card-inner">
            <view class="card-content">
              <text class="card-text">同学</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 老师卡片上方的图片 -->
    <!--
      @file ./images/teacher.png
      @description 老师身份图片，分包页面通过相对路径./images/teacher.png按需加载
    -->
    <image
      class="teacher-image"
      src="../static/login/teacher.png"
      mode="aspectFit"
    />
    <view class="card teacher-card" @click="selectIdentity('teacher')">
      <view class="card-outer teacher-card-outer">
        <view class="card-outer-gradient teacher-card-outer-gradient">
          <view class="card-inner teacher-card-inner">
            <view class="card-content">
              <text class="card-text">老师</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { Navigator } from '@/router/Router';
import store from '@/store' 

export default {
  methods: {
    /**
     * 选择用户身份并更新到Vuex中
     * @param {string} identity - 用户身份类型 ('student'或'teacher')
     */
    selectIdentity(identity) {
      console.log("选中的身份是:", identity);
      
      try {
        // 直接使用导入的store实例调用mutation
        // 传递英文的角色代码，让mutation内部处理角色名称转换
        store.commit('user/baseInfo/updateRole', identity);
        
        // 导航到下一页
        Navigator.toLoginDetail();
      } catch (error) {
        console.error('选择身份时出错:', error);
        uni.showToast({
          title: '系统错误，请重试',
          icon: 'none'
        });
      }
    },
    /**
     * 返回到微信登录页面
     * @returns {void}
     */
    goBack() {
      Navigator.toWechatLogin();
    }
  }
}
</script>

<style scoped>
.container {
  position: relative;
  padding: 40rpx;
  min-height: 100vh;
  height: 100vh;
  background: transparent;
  z-index: 1;
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

.title {
  position: absolute;
  width: 284rpx;
  top: 248rpx;
  left: 106rpx;
  font-family: PingFang SC;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  z-index: 50;
}

.card {
  position: absolute;
  width: 648rpx;
  height: 200rpx;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  z-index: 10;
}

/* 外层：模拟边框 */
.card-outer {
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  padding: 2rpx; /* 边框宽度 */
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: transparent;
}

.card-outer-gradient {
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  padding: 2rpx;
  box-sizing: border-box;
  background: transparent;
}

/* 学生卡片外层渐变 */
.student-card-outer-gradient {
  background: linear-gradient(180deg, rgba(228, 241, 255, 1) 0%, rgba(34, 136, 249, 1) 100%);
}

/* 老师卡片外层渐变 */
.teacher-card-outer-gradient {
  background: linear-gradient(180deg, rgba(233, 234, 255, 1) 0%, rgba(95, 38, 247, 1) 100%);
}

.card-content {
  position: absolute;
  top: 110rpx;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.card-text {
  font-family: PingFang SC, sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 35px;
  letter-spacing: 2px;
  color: #2F2F2F;
  text-align: center;
  width: 100%;
}

/**
 * "我是同学~"按钮样式
 */
.student-card {
  position: absolute;
  width: 648rpx;
  height: 200rpx;
  left: 50%;
  top: 560rpx;
  transform: translateX(-50%);
  background: transparent;
}

/**
 * "我是老师~"按钮样式
 */
.teacher-card {
  position: absolute;
  width: 648rpx;
  height: 200rpx;
  left: 50%;
  top: 1090rpx;
  transform: translateX(-50%);
  background: transparent;
}

/* 内层：内容区 */
.card-inner {
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: stretch;
  position: relative;
}

/* 学生卡内容渐变遮罩 */
.student-card-inner::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(194, 221, 250, 0.2) 11.54%, rgba(34, 136, 249, 0.2) 111.54%);
  z-index: 1;
}

/* 老师卡内容渐变遮罩 */
.teacher-card-inner::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(224, 212, 255, 0.2) 11.54%, rgba(95, 38, 247, 0.2) 111.54%);
  z-index: 1;
}

/**
 * 同学图片，距离同学按钮上方40rpx
 */
.student-image {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 972rpx;
  height: 300rpx;
  z-index: 20;
  pointer-events: none;
  top: 370rpx; /* 684rpx - 150rpx - 40rpx */
}

/**
 * 老师图片，距离老师按钮上方40rpx
 */
.teacher-image {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 972rpx;
  height: 375rpx;
  z-index: 20;
  pointer-events: none;
  top: 800rpx; /* 1020rpx - 220rpx */
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}

.background-image image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
