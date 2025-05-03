<template>
  <view class="page-container">
    <view class="header">
      <view class="main-title">一站式对接</view>
      <view class="sub-title">目标院校专业学长学姐</view>
    </view>
		<c-lottie class="match-animation"
			ref="cLottieRef"
			:src="src"
			width="600rpx"
      :autoPlay="false"
			height="600rpx"
			:loop="true"
		></c-lottie>
    <view class="button-area">
      <button class="match-button" @click.stop="matchAnimation">精准匹配</button>
    </view>

    <!-- <AICartoon /> -->
    <TabBar pageName="index" />
  </view>
</template>

<script setup>
// import AICartoon from '@/components/AI-cartoon/AI-cartoon.vue'
import TabBar from '@/components/tab-bar/tab-bar.vue'
import { Navigator } from '@/router/Router.js'
import { ref } from "vue";
const cLottieRef = ref()
/**
 * 组件属性
 * @type {Object}
 */
const props = defineProps({
  src: {
    type: String,
    default: 'https://lottie.host/aa045d36-86ee-46d3-9705-1eeb65b38465/V6aAFX4Fmk.json'
  }
})


const matchAnimation = () => {
  cLottieRef.value.call('play')
  setTimeout(() => {
    cLottieRef.value.call('stop')
    navigateToMatch()
  }, 1000)
}
/**
 * 导航到匹配页面
 */
const navigateToMatch = () => {
  Navigator.toMatch()
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
  margin-left: 200rpx;
  margin-top: 80rpx;
  width: 100%;
}

.main-title {
  font-size: 48rpx;
  font-weight: 550;
  margin-bottom: 20rpx;
  color: #333;
}

.sub-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
  font-weight: 450;
  text-align: left;
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
  padding: 0;
  font-weight: 500;
  line-height: 80rpx;
}

.match-animation {
  position: relative;
  margin-top: 50rpx;
  top: 0;
  left: 0;
}

</style>