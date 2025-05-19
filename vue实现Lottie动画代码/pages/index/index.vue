<template>
  <view class="container">
    <image class="background-image" src="/static/index/background.png" mode="aspectFill" alt="背景图" />
    <!-- 主页面内容 -->
    <view class="page-container">
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
        <button class="match-button" @click.stop="matchAnimation">
          <view class="match-content">
            <image
              class="match-icon"
              src="/static/index/matchsearch.png"
              mode="aspectFit"
              alt="匹配图标"
            />
            <text class="match-text">精准匹配</text>
          </view>
        </button>
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
import { ref, onMounted, onActivated, onBeforeUnmount } from "vue";

// 创建一个缓存对象，用于存储动画数据
const animationCache = new Map();

const cLottieRef = ref()
const animationSrc = ref('')
const defaultSrc = 'https://lottie.host/b43a7279-b25d-460a-b48c-60e2a24ecf2f/GDx9VFTMQr.json'
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
 * 检查动画是否已缓存
 * @param {String} url - 动画URL
 * @returns {Boolean} 是否已缓存
 */
const isAnimationCached = (url) => {
  return animationCache.has(url)
}

/**
 * 从缓存中获取动画数据
 * @param {String} url - 动画URL
 * @returns {Object|null} 动画数据或null
 */
const getAnimationFromCache = (url) => {
  return animationCache.get(url) || null
}

/**
 * 将动画数据存入缓存
 * @param {String} url - 动画URL
 * @param {Object} data - 动画数据
 */
const saveAnimationToCache = (url, data) => {
  animationCache.set(url, data)
  
  // 同时保存到本地存储，以便下次应用启动时可以恢复
  try {
    const key = `lottie_${getAnimationKey(url)}`
    uni.setStorageSync(key, data)
    console.log('动画数据已保存到本地存储', key)
  } catch (e) {
    console.error('保存到本地存储失败', e)
  }
}

/**
 * 恢复本地存储中的动画数据到缓存
 * @param {String} url - 动画URL
 * @returns {Boolean} 是否成功恢复
 */
const restoreAnimationFromStorage = (url) => {
  const key = `lottie_${getAnimationKey(url)}`
  try {
    const data = uni.getStorageSync(key)
    if (data) {
      animationCache.set(url, data)
      console.log('已从本地存储恢复动画数据到缓存', key)
      return true
    }
  } catch (e) {
    console.error('从本地存储恢复失败', e)
  }
  return false
}

/**
 * 加载动画数据
 * @param {String} url - 动画URL
 * @returns {Promise<Object>} 动画数据
 */
const loadAnimationData = async (url) => {
  if (loading.value) {
    console.log('已有加载任务正在进行')
    return null
  }
  
  loading.value = true
  
  // 首先检查内存缓存
  if (isAnimationCached(url)) {
    console.log('从内存缓存获取动画数据')
    loading.value = false
    return getAnimationFromCache(url)
  }
  
  // 然后检查本地存储
  if (restoreAnimationFromStorage(url)) {
    console.log('从本地存储恢复动画数据')
    loading.value = false
    return getAnimationFromCache(url)
  }
  
  // 最后从网络加载
  console.log('从网络加载动画数据', url)
  try {
    const { data } = await uni.request({
      url: url,
      method: 'GET'
    })
    
    // 保存到缓存
    saveAnimationToCache(url, data)
    
    loading.value = false
    return data
  } catch (e) {
    console.error('网络加载动画数据失败', e)
    loading.value = false
    return null
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
  const targetSrc = props.src || defaultSrc
  animationSrc.value = targetSrc
  
  // 预加载动画数据
  loadAnimationData(targetSrc).then(data => {
    if (data) {
      console.log('动画数据加载成功')
      animationLoaded.value = true
    }
  })
  
  // 设置超时处理，最长等待3秒
  loadTimeout = setTimeout(() => {
    console.log('动画加载超时，强制显示页面')
    pageReady.value = true
  }, 3000)
  
  // 如果已经缓存，可能不会触发dataReady事件，需要主动检查
  if (isAnimationCached(targetSrc)) {
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

/**
 * 清理函数，在组件销毁前清除超时计时器
 */
const cleanup = () => {
  if (loadTimeout) {
    clearTimeout(loadTimeout)
    loadTimeout = null
  }
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

// 在组件卸载前清理资源
onBeforeUnmount(() => {
  cleanup()
})
</script>

<style >
.container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none; /* 保证背景图不影响交互 */
}

.page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 180rpx; /* 调整底部间距，确保内容不被tab-bar遮挡 */
  /* background-color: #f8f8f8; */
  z-index: 1;
}

.header {
  display: flex;
  flex-direction: column;
  margin-left: 100px;
  margin-top: 110px;
  width: 100%;
}

/**
 * main-title 主标题样式
 * @font-family PingFang SC
 * @font-weight 400
 * @font-size 24px (约48rpx)
 * @line-height 35px (约70rpx)
 * @letter-spacing -0.55px (约-1.1rpx)
 */
 .main-title {
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  font-weight: 550;
  font-size: 48rpx;
  line-height: 70rpx;
  letter-spacing: -1.1rpx;
  color: #333;
}

/**
 * sub-title 副标题样式
 * @font-family PingFang SC
 * @font-weight 400
 * @font-size 20px (约40rpx)
 * @line-height 35px (约70rpx)
 * @letter-spacing -0.55px (约-1.1rpx)
 */
 .sub-title {
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  font-weight: 400;
  font-size: 40rpx;
  line-height: 70rpx;
  letter-spacing: -1.1rpx;
  color: #666;
  text-align: left;
}

.button-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;
}

/**
 * match-button 精准匹配按钮样式
 * @width 159px (约318rpx)
 * @height 53px (约106rpx)
 * @border-radius 10px (约20rpx)
 * @background 渐变色 linear-gradient(180deg, #A5A9F7 0%, rgba(70, 78, 248, 0.9) 100%)
 */
 .match-button {
  width: 318rpx;
  height: 106rpx;
  border-radius: 20rpx;
  background: linear-gradient(180deg, #A5A9F7 0%, rgba(70, 78, 248, 0.9) 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: none;
  box-shadow: none;
  padding-left: 32rpx;
  padding: 0;
  gap: 16rpx;
  /* 可选：去除原有边框和阴影 */
}

/**
 * match-content 按钮内容容器，横向排列图标和文字
 */
.match-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 33rpx;
}

/**
 * match-icon 按钮内左侧图标样式
 * @width 20.3px (约40rpx)
 * @height 20.3px (约40rpx)
 * @margin-right 16rpx（图标与文字间距）
 */
.match-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 40rpx;
}

.match-animation {
  position: relative;
  margin-top: 50rpx;
  top: 0;
  left: 0;
}

/**
 * match-text 精准匹配文字样式
 * @font-family PingFang SC
 * @font-weight 400
 * @font-size 18px (约36rpx)
 * @line-height 100%
 * @letter-spacing -0.68px (约-1.36rpx)
 * @text-align center
 */
.match-text {
  font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1;
  letter-spacing: -1.36rpx;
  text-align: center;
  color: #fff;
}

</style>