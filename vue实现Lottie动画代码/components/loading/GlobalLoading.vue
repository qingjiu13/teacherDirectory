<template>
  <view class="global-loading-wrapper" :style="wrapperStyle" :class="{ 'visible': visible, 'fullscreen': fullscreen }">
    <LoadingAnimation 
      ref="loadingRef"
      :src="src"
      :width="width"
      :height="height" 
      :showText="showText"
      :text="text"
      :autoPlay="autoPlay"
      @dataReady="onDataReady"
      @error="onError"
      @timeout="onTimeout"
      @mounted="onMounted"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted, provide, onBeforeUnmount } from 'vue'
import LoadingAnimation from './LoadingAnimation.vue'
import { useGlobalAnimationState } from './useAnimationCache.js'

/**
 * @typedef {Object} GlobalLoadingProps
 * @property {String} src - 动画源文件地址
 * @property {String} width - 动画宽度
 * @property {String} height - 动画高度
 * @property {Boolean} fullscreen - 是否全屏显示
 * @property {Boolean} transparent - 背景是否透明
 * @property {String} backgroundColor - 背景颜色
 * @property {Boolean} autoPlay - 是否自动播放
 * @property {Boolean} preload - 是否预加载
 * @property {Boolean} showText - 是否显示加载文字
 * @property {String} text - 加载文字内容
 * @property {Number} zIndex - 层级
 */

/**
 * 组件属性
 * @type {GlobalLoadingProps}
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
  fullscreen: {
    type: Boolean,
    default: true
  },
  transparent: {
    type: Boolean,
    default: false
  },
  backgroundColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.9)'
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  preload: {
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
  },
  zIndex: {
    type: Number,
    default: 9999
  }
})

/**
 * 组件事件
 * @type {Object}
 */
const emit = defineEmits(['mounted', 'dataReady', 'error', 'timeout'])

// 组件内部状态
const loadingRef = ref(null)
const visible = ref(false)
const isPreloaded = ref(false)

// 获取全局动画状态
const { 
  globalState, 
  getGlobalStats, 
  isAllAnimationsLoaded,
} = useGlobalAnimationState()

/**
 * 计算包装器样式
 */
const wrapperStyle = computed(() => {
  return {
    backgroundColor: props.transparent ? 'transparent' : props.backgroundColor,
    zIndex: props.zIndex
  }
})

/**
 * 显示加载动画
 */
const show = () => {
  visible.value = true
  if (loadingRef.value) {
    loadingRef.value.show()
  }
}

/**
 * 隐藏加载动画
 */
const hide = () => {
  visible.value = false
  if (loadingRef.value) {
    loadingRef.value.hide()
  }
}

/**
 * 预加载动画资源
 * @returns {Promise<boolean>} 预加载结果
 */
const preload = async () => {
  if (isPreloaded.value) {
    return true
  }
  
  try {
    if (loadingRef.value) {
      const result = await loadingRef.value.preload()
      if (result) {
        isPreloaded.value = true
      }
      return result
    }
    return false
  } catch (error) {
    console.error('预加载全局动画失败', error)
    return false
  }
}

/**
 * 获取动画组件
 * @returns {Object|null} 动画组件实例
 */
const getLottieRef = () => {
  if (loadingRef.value && loadingRef.value.lottieRef) {
    return loadingRef.value.lottieRef.value
  }
  return null
}

/**
 * 获取动画统计信息
 * @returns {Object} 统计信息
 */
const getAnimationStats = () => {
  return getGlobalStats()
}

/**
 * 动画数据准备完成回调
 */
const onDataReady = () => {
  isPreloaded.value = true
  emit('dataReady')
}

/**
 * 处理错误
 * @param {Error} error - 错误信息
 */
const onError = (error) => {
  emit('error', error)
}

/**
 * 处理超时
 * @param {String} src - 动画源
 */
const onTimeout = (src) => {
  emit('timeout', src)
}

/**
 * 动画组件挂载完成
 */
const onMounted = () => {
  // 如果设置了预加载，则自动预加载
  if (props.preload) {
    preload()
  }
  
  emit('mounted')
}

/**
 * 提供给外部的组件方法
 */
defineExpose({
  show,
  hide,
  preload,
  isPreloaded: computed(() => isPreloaded.value),
  getLottieRef,
  getAnimationStats
})

// 全局状态注入
provide('globalLoading', {
  show,
  hide,
  preload,
  isPreloaded: computed(() => isPreloaded.value),
  stats: getGlobalStats
})

// 组件挂载
onMounted(() => {
  // 注册全局实例
  const globalApp = getApp()
  if (globalApp) {
    globalApp.globalData = globalApp.globalData || {}
    
    // 更新全局$loading对象
    globalApp.globalData.$loading = {
      show,
      hide,
      preload,
      isPreloaded: { value: isPreloaded.value },
      getStatus: getAnimationStats,
      globalState,
      isReady: true,
      componentMounted: true
    }
    
    console.log('全局$loading对象已更新')
  }
})

// 组件卸载
onBeforeUnmount(() => {
  // 清理全局引用
  const globalApp = getApp()
  if (globalApp && globalApp.globalData && globalApp.globalData.$loading) {
    // 保留引用但标记为未挂载
    globalApp.globalData.$loading.componentMounted = false
  }
})
</script>

<style>
.global-loading-wrapper {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.global-loading-wrapper.fullscreen {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.global-loading-wrapper.visible {
  opacity: 1;
  visibility: visible;
}
</style> 