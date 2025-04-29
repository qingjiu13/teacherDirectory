// useLottieReady.js
import { ref, onMounted, watch } from 'vue'

/**
 * Lottie动画加载状态钩子
 * @param {import('vue').Ref} cLottieRef - Lottie组件引用
 * @returns {{isReady: import('vue').Ref<boolean>}} 动画加载状态
 */
export function useLottieReady(cLottieRef) {
  const isReady = ref(false)

  /**
   * 绑定Lottie数据加载完成事件
   */
  const attachHandler = () => {
    if (!cLottieRef.value) return
    
    // 兼容新版API
    if (typeof cLottieRef.value.on === 'function') {
      cLottieRef.value.on('dataReady', () => {
        isReady.value = true
        console.log('Lottie 动画已加载完成')
      })
    }
    // 兼容旧版API
    else if (typeof cLottieRef.value.$on === 'function') {
      cLottieRef.value.$on('dataReady', () => {
        isReady.value = true
        console.log('Lottie 动画已加载完成')
      })
    }
  }

  onMounted(() => {
    attachHandler()
  })

  // 防止加载太快没绑定到，watch 观察也处理一下
  watch(cLottieRef, (newVal) => {
    if (newVal) {
      attachHandler()
    }
  })

  return {
    isReady
  }
}
