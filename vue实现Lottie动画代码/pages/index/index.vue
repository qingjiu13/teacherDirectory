<template>
  <view class="page-container">
    <view class="header">
      <view class="main-title">研师录</view>
      <view class="sub-title">一站式对接目标院校专业学长学姐</view>
    </view>

    <canvas
      canvas-id="lottie-canvas"
      id="lottie-canvas"
      type="2d"
      style="width: 300px; height: 300px;"
    ></canvas>

    <view class="button-area">
      <view class="match-button" @click="navigateToMatch">
        <view class="button-text">精准匹配</view>
      </view>
    </view>

    <AICartoon />
    <TabBar pageName="index" />
  </view>
</template>

<script>
import AICartoon from '@/components/AI-cartoon/AI-cartoon.vue'
import TabBar from '@/components/tab-bar/tab-bar.vue'
import store from '@/store/index.js'
import { Navigator } from '@/router/Router.js'

export default {
  components: {
    AICartoon,
    TabBar
  },
  data() {
    return {
      animation: null
    }
  },
  mounted() {
    this.initLottie()
  },
  methods: {
    async initLottie() {
      const query = uni.createSelectorQuery().in(this)
      query.select('#lottie-canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = uni.getSystemInfoSync().pixelRatio
          canvas.width = 300 * dpr
          canvas.height = 300 * dpr
          ctx.scale(dpr, dpr)
		  const lottie = require('../../components/lottie/miniprogram_dist/index.js');
          this.animation = lottie.loadAnimation({
			loop: true,
            autoplay: true,
            animationData: null,
            path: 'https://lottie.host/5082ce37-c10e-4773-984c-ea2558105fd8/KhTUklUfWb.json',
            rendererSettings: {
              context: ctx,
              clearCanvas: true
            }
          })
        })
    },

    async navigateToMatch() {
      try {
        uni.showLoading({ title: '加载中...' })
        await store.dispatch('match/getFilteredMatchList', {})
        uni.hideLoading()
        Navigator.toMatch()
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '数据加载失败，请重试',
          icon: 'none'
        })
      }
	}
},
  
  beforeDestroy() {
    this.animation?.destroy()
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