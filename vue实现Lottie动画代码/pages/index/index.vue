<template>
  <view class="page-container">
    <view class="header">
      <view class="main-title">研师录</view>
      <view class="sub-title">一站式对接目标院校专业学长学姐</view>
    </view>

    <view class="button-area">
      <view class="match-button" @click="navigateToMatch">
        <view class="button-text">精准匹配</view>
      </view>
    </view>


    <!-- <AICartoon /> -->
    <TabBar pageName="index" />
  </view>
</template>

<script>
// import AICartoon from '@/components/AI-cartoon/AI-cartoon.vue'
import TabBar from '@/components/tab-bar/tab-bar.vue'
import { Navigator } from '@/router/Router.js'


export default {
  components: {
    // AICartoon,
    TabBar
  },
  methods:{
	  navigateToMatch() {
	      Navigator.toMatch()
	  }
  }

}

</script>


<style >
.page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 120rpx;
  background-color: #f8f8f8;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80rpx;
  width: 100%;
}

.main-title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.sub-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
  text-align: center;
}

.button-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;
}

.match-button {
  width: 480rpx;
  height: 80rpx;
  background-color: #ffffff;
  color: #333;
  border: 1px solid #dddddd;
  border-radius: 40rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.button-text {
  color: #333;
  font-weight: 500;
}

</style>