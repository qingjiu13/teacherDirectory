<template>
  <view class="container">
    <!-- 加载状态显示 -->
    <view class="loading-container" v-if="!pageReady">
      <view class="loading-spinner"></view>
      <view class="loading-text">加载中...</view>
    </view>
    
    <!-- 主页面内容 -->
    <view class="page-container" v-else>
      <view class="header">
        <view class="main-title">一站式对接</view>
        <view class="sub-title">目标院校专业学长学姐</view>
      </view>
  		<c-lottie class="match-animation"
  			ref="cLottieRef"
  			:src="animationSrc"
  			width="600rpx"
        :autoPlay="false"
  			height="600rpx"
  			:loop="true"
        @dataReady="onDataReady"
  		></c-lottie>
      <view class="button-area">
        <button class="match-button" @click.stop="matchAnimation">精准匹配</button>
      </view>
  
      <!-- <AICartoon /> -->
      <TabBar pageName="index" />
    </view>
  </view>
</template>

<script setup>
// import AICartoon from '@/components/AI-cartoon/AI-cartoon.vue'
import TabBar from '@/components/tab-bar/tab-bar.vue'
import { Navigator } from '@/router/Router.js'
import { ref, onMounted, onActivated } from "vue";

const cLottieRef = ref()
const animationSrc = ref('')
const defaultSrc = 'https://lottie.host/aa045d36-86ee-46d3-9705-1eeb65b38465/V6aAFX4Fmk.json'
const animationLoaded = ref(false)
const loading = ref(false)
const pageReady = ref(false)
let loadTimeout = null

/**
 * 组件属性
 * @type {Object}
 */
const props = defineProps({
  src: {
    type: String,
    default: defaultSrc
  }
})

/**
 * 从URL中提取唯一键
 * @param {String} url - 动画URL
 * @returns {String} 唯一键
 */
const getAnimationKey = (url) => {
  return url.split('/').pop().split('.')[0]
}

/**
 * 检查缓存状态
 * @param {String} key - 存储键名
 * @returns {Boolean} 是否已缓存
 */
const checkCached = (key) => {
  const storageKey = `lottie_${key}`
  try {
    const stored = uni.getStorageSync(storageKey)
    return !!stored
  } catch (e) {
    console.error('检查缓存状态失败', e)
    return false
  }
}

/**
 * 预加载并缓存动画数据
 * @param {String} url - 动画URL
 * @param {String} key - 存储键名
 * @returns {Promise<Boolean>} 是否成功
 */
const preloadLottieAnimation = async (url, key) => {
  if (loading.value) return false
  
  loading.value = true
  const storageKey = `lottie_${key}`
  
  // 检查是否已缓存
  if (checkCached(key)) {
    console.log('动画已缓存，无需预加载')
    loading.value = false
    return true
  }
  
  // 从网络加载
  console.log('从网络预加载Lottie动画')
  try {
    const { data } = await uni.request({
      url: url,
      method: 'GET'
    })
    
    // 保存到本地缓存
    try {
      uni.setStorageSync(storageKey, data)
      console.log('Lottie动画已缓存到本地')
      loading.value = false
      return true
    } catch (e) {
      console.error('保存缓存失败', e)
      loading.value = false
      return false
    }
  } catch (e) {
    console.error('获取动画文件失败', e)
    loading.value = false
    return false
  }
}

/**
 * 初始化动画
 */
const initAnimation = async () => {
  // 清除可能存在的超时计时器
  if (loadTimeout) {
    clearTimeout(loadTimeout)
  }
  
  // 重置页面准备状态
  pageReady.value = false
  
  // 设置动画源
  animationSrc.value = props.src
  
  // 检查是否已经缓存了动画数据
  const animationKey = getAnimationKey(props.src)
  const isCached = checkCached(animationKey)
  
  // 预加载动画到缓存（不影响当前显示）
  preloadLottieAnimation(props.src, animationKey)
  
  // 设置超时处理，最长等待3秒
  loadTimeout = setTimeout(() => {
    console.log('动画加载超时，强制显示页面')
    pageReady.value = true
  }, 3000)
  
  // 如果已经缓存，可能不会触发dataReady事件，需要主动检查
  if (isCached) {
    console.log('检测到缓存数据，预先设置动画加载状态')
    animationLoaded.value = true
    // 短暂延迟后显示页面
    setTimeout(() => {
      pageReady.value = true
    }, 500)
  }
}

/**
 * 数据准备完成回调
 */
const onDataReady = () => {
  console.log('动画数据准备完成，触发dataReady事件')
  animationLoaded.value = true
  
  // 清除加载超时计时器
  if (loadTimeout) {
    clearTimeout(loadTimeout)
    loadTimeout = null
  }
  
  // 动画准备好后，标记页面可以显示
  setTimeout(() => {
    console.log('设置页面为可显示状态')
    pageReady.value = true
  }, 100)
}

/**
 * 执行匹配动画
 */
const matchAnimation = () => {
  if (!animationLoaded.value) {
    console.log('动画尚未加载完成')
    return
  }
  
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

// 组件挂载时初始化
onMounted(() => {
  console.log('组件挂载，初始化动画')
  initAnimation()
})

// 在页面被激活时确保动画已加载（如从其他页面返回时）
onActivated(() => {
  console.log('页面激活')
  if (!animationSrc.value) {
    initAnimation()
  } else {
    // 如果已有源但页面未准备好，强制准备
    if (!pageReady.value) {
      console.log('动画源已存在但页面未准备好，强制显示')
      pageReady.value = true
    }
  }
})
</script>

<style >
.container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

/* 加载状态样式 */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  z-index: 999;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 8rpx solid #f3f3f3;
  border-top: 8rpx solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

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