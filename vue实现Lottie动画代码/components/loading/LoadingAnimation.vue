<template>
  <view class="loading-animation-container" :class="{ 'visible': visible }">
    <view class="animation-wrapper">
      <view class="lottie-container">
        <c-lottie
          ref="lottieRef"
          :src="animationSrc"
          :width="width"
          :height="height"
          :loop="true"
          :autoPlay="autoPlay"
          @dataReady="onDataReady"
        ></c-lottie>
      </view>
      <text v-if="showText" class="loading-text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
import { useAnimationCache } from './useAnimationCache.js';

/**
 * @typedef {Object} LoadingAnimationProps
 * @property {String} src - 动画源文件地址
 * @property {String} width - 动画宽度
 * @property {String} height - 动画高度
 * @property {Boolean} autoPlay - 是否自动播放
 * @property {Boolean} showText - 是否显示加载文字
 * @property {String} text - 加载文字内容
 */

/**
 * 组件属性
 * @type {LoadingAnimationProps}
 */
const props = defineProps({
  src: {
    type: String,
    default: 'https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json'
  },
  width: {
    type: String,
    default: '200rpx'
  },
  height: {
    type: String,
    default: '200rpx'
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  showText: {
    type: Boolean,
    default: true
  },
  text: {
    type: String,
    default: '加载中...'
  }
})

/**
 * 组件事件
 * @type {Object}
 */
const emit = defineEmits(['mounted', 'dataReady', 'error', 'timeout'])

// 组件内部状态
const lottieRef = ref(null)
const visible = ref(false)
const animationSrc = ref(props.src)
const isLoaded = ref(false)
const isPlaying = ref(false)
const loadingTimeout = ref(null)

// 使用动画缓存功能
const { 
  isAnimationCached, 
  loadAnimationData, 
  getAnimationFromCache,
  getAnimationStats
} = useAnimationCache()

/**
 * 显示加载动画
 */
const show = () => {
  if (!isLoaded.value) {
    preload()
  }
  visible.value = true
  if (lottieRef.value && isLoaded.value) {
    lottieRef.value.call('play')
    isPlaying.value = true
  }
}

/**
 * 隐藏加载动画
 */
const hide = () => {
  visible.value = false
  if (lottieRef.value && isPlaying.value) {
    lottieRef.value.call('stop')
    isPlaying.value = false
  }
}

/**
 * 预加载动画资源
 * @returns {Promise<boolean>} 预加载结果
 */
const preload = async () => {
  if (isLoaded.value) {
    return true
  }
  
  try {
    // 设置加载超时处理
    if (loadingTimeout.value) {
      clearTimeout(loadingTimeout.value)
    }
    
    loadingTimeout.value = setTimeout(() => {
      console.warn('动画加载超时', animationSrc.value)
      emit('timeout', animationSrc.value)
    }, 5000)
    
    // 预加载动画数据
    const animationData = await loadAnimationData(animationSrc.value)
    
    if (animationData) {
      if (loadingTimeout.value) {
        clearTimeout(loadingTimeout.value)
        loadingTimeout.value = null
      }
      
      isLoaded.value = true
      return true
    }
    
    return false
  } catch (error) {
    console.error('预加载动画失败', error)
    emit('error', error)
    
    if (loadingTimeout.value) {
      clearTimeout(loadingTimeout.value)
      loadingTimeout.value = null
    }
    
    return false
  }
}

/**
 * 动画数据准备完成回调
 */
const onDataReady = () => {
  console.log('动画数据准备完成')
  isLoaded.value = true
  
  if (loadingTimeout.value) {
    clearTimeout(loadingTimeout.value)
    loadingTimeout.value = null
  }
  
  emit('dataReady')
  
  // 如果当前应该显示动画，则播放
  if (visible.value && !isPlaying.value) {
    lottieRef.value.call('play')
    isPlaying.value = true
  }
}

/**
 * 监听src属性变化
 */
watch(() => props.src, (newSrc) => {
  if (newSrc !== animationSrc.value) {
    animationSrc.value = newSrc
    isLoaded.value = false
    
    // 如果当前正在显示，需要重新加载
    if (visible.value) {
      preload()
    }
  }
})

/**
 * 提供给外部的组件方法
 */
defineExpose({
  show,
  hide,
  preload,
  isLoaded: computed(() => isLoaded.value),
  isPlaying: computed(() => isPlaying.value),
  lottieRef,
  getAnimationStats
})

// 组件挂载时预加载
onMounted(() => {
  console.log('加载动画组件已挂载')
  
  // 检查是否已缓存
  if (isAnimationCached(animationSrc.value)) {
    console.log('动画已缓存，直接标记为已加载')
    isLoaded.value = true
  } else {
    // 自动预加载但不显示
    preload().then(() => {
      console.log('动画预加载完成', isLoaded.value)
    })
  }
  
  emit('mounted')
})

// 组件卸载前清理
onBeforeUnmount(() => {
  if (loadingTimeout.value) {
    clearTimeout(loadingTimeout.value)
    loadingTimeout.value = null
  }
  
  // 停止播放
  if (lottieRef.value && isPlaying.value) {
    lottieRef.value.call('stop')
    isPlaying.value = false
  }
})
</script>

<style>
.loading-animation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.loading-animation-container.visible {
  opacity: 1;
  visibility: visible;
}

.animation-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lottie-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #666;
}
</style> 