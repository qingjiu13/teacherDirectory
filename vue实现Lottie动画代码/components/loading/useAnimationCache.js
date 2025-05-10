import { ref } from 'vue'

// 创建全局状态对象
const globalAnimationCache = new Map()
const globalStats = ref({
  totalCached: 0,
  totalLoaded: 0,
  totalFailed: 0,
  animations: []
})
const globalLoading = ref(false)

/**
 * 从URL中提取唯一键
 * @param {String} url - 动画URL
 * @returns {String} 唯一键
 */
const getAnimationKey = (url) => {
  return url.split('/').pop().split('.')[0]
}

/**
 * 使用动画缓存功能
 * @returns {Object} 缓存相关的方法集合
 */
export const useAnimationCache = () => {
  /**
   * 检查动画是否已缓存
   * @param {String} url - 动画URL
   * @returns {Boolean} 是否已缓存
   */
  const isAnimationCached = (url) => {
    return globalAnimationCache.has(url)
  }
  
  /**
   * 从缓存中获取动画数据
   * @param {String} url - 动画URL
   * @returns {Object|null} 动画数据或null
   */
  const getAnimationFromCache = (url) => {
    return globalAnimationCache.get(url) || null
  }
  
  /**
   * 将动画数据存入缓存
   * @param {String} url - 动画URL
   * @param {Object} data - 动画数据
   */
  const saveAnimationToCache = (url, data) => {
    globalAnimationCache.set(url, data)
    
    // 更新统计信息
    const animIndex = globalStats.value.animations.findIndex(a => a.url === url)
    if (animIndex === -1) {
      globalStats.value.animations.push({
        url,
        key: getAnimationKey(url),
        cached: true,
        loadTime: Date.now()
      })
    } else {
      globalStats.value.animations[animIndex].cached = true
      globalStats.value.animations[animIndex].loadTime = Date.now()
    }
    
    globalStats.value.totalCached = globalAnimationCache.size
    
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
        globalAnimationCache.set(url, data)
        
        // 更新统计信息
        const animIndex = globalStats.value.animations.findIndex(a => a.url === url)
        if (animIndex === -1) {
          globalStats.value.animations.push({
            url,
            key: getAnimationKey(url),
            cached: true,
            loadTime: Date.now(),
            fromStorage: true
          })
        } else {
          globalStats.value.animations[animIndex].cached = true
          globalStats.value.animations[animIndex].loadTime = Date.now()
          globalStats.value.animations[animIndex].fromStorage = true
        }
        
        globalStats.value.totalCached = globalAnimationCache.size
        
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
    if (globalLoading.value) {
      console.log('已有加载任务正在进行')
      return null
    }
    
    globalLoading.value = true
    
    // 记录加载开始
    const startTime = Date.now()
    const animIndex = globalStats.value.animations.findIndex(a => a.url === url)
    if (animIndex === -1) {
      globalStats.value.animations.push({
        url,
        key: getAnimationKey(url),
        cached: false,
        loading: true,
        startTime
      })
    } else {
      globalStats.value.animations[animIndex].loading = true
      globalStats.value.animations[animIndex].startTime = startTime
    }
    
    // 首先检查内存缓存
    if (isAnimationCached(url)) {
      console.log('从内存缓存获取动画数据')
      
      // 更新统计信息
      const idx = globalStats.value.animations.findIndex(a => a.url === url)
      if (idx !== -1) {
        globalStats.value.animations[idx].loading = false
        globalStats.value.animations[idx].loadedFromCache = true
        globalStats.value.animations[idx].loadTime = Date.now() - startTime
      }
      
      globalLoading.value = false
      return getAnimationFromCache(url)
    }
    
    // 然后检查本地存储
    if (restoreAnimationFromStorage(url)) {
      console.log('从本地存储恢复动画数据')
      
      // 更新统计信息
      const idx = globalStats.value.animations.findIndex(a => a.url === url)
      if (idx !== -1) {
        globalStats.value.animations[idx].loading = false
        globalStats.value.animations[idx].loadedFromStorage = true
        globalStats.value.animations[idx].loadTime = Date.now() - startTime
      }
      
      globalStats.value.totalLoaded++
      globalLoading.value = false
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
      
      // 更新统计信息
      const idx = globalStats.value.animations.findIndex(a => a.url === url)
      if (idx !== -1) {
        globalStats.value.animations[idx].loading = false
        globalStats.value.animations[idx].loadedFromNetwork = true
        globalStats.value.animations[idx].loadTime = Date.now() - startTime
      }
      
      globalStats.value.totalLoaded++
      globalLoading.value = false
      return data
    } catch (e) {
      console.error('网络加载动画数据失败', e)
      
      // 更新统计信息
      const idx = globalStats.value.animations.findIndex(a => a.url === url)
      if (idx !== -1) {
        globalStats.value.animations[idx].loading = false
        globalStats.value.animations[idx].failed = true
        globalStats.value.animations[idx].error = e.message || '未知错误'
      }
      
      globalStats.value.totalFailed++
      globalLoading.value = false
      return null
    }
  }
  
  /**
   * 清除特定动画的缓存
   * @param {String} url - 动画URL
   * @returns {Boolean} 是否成功清除
   */
  const clearAnimationCache = (url) => {
    const key = `lottie_${getAnimationKey(url)}`
    
    try {
      // 删除内存缓存
      const deleted = globalAnimationCache.delete(url)
      
      // 删除本地存储
      uni.removeStorageSync(key)
      
      // 更新统计信息
      if (deleted) {
        const idx = globalStats.value.animations.findIndex(a => a.url === url)
        if (idx !== -1) {
          globalStats.value.animations[idx].cached = false
          globalStats.value.animations[idx].cleared = true
          globalStats.value.animations[idx].clearTime = Date.now()
        }
        
        globalStats.value.totalCached = globalAnimationCache.size
      }
      
      return deleted
    } catch (e) {
      console.error('清除动画缓存失败', e)
      return false
    }
  }
  
  /**
   * 清除所有动画缓存
   */
  const clearAllAnimationCache = () => {
    try {
      // 获取所有URL列表
      const urls = Array.from(globalAnimationCache.keys())
      
      // 逐个清除
      urls.forEach(url => {
        clearAnimationCache(url)
      })
      
      console.log('已清除所有动画缓存')
      return true
    } catch (e) {
      console.error('清除所有动画缓存失败', e)
      return false
    }
  }
  
  /**
   * 获取缓存统计信息
   * @returns {Object} 统计信息
   */
  const getAnimationStats = () => {
    return {
      ...globalStats.value,
      timestamp: Date.now()
    }
  }
  
  /**
   * 批量预加载动画
   * @param {Array<String>} urls - 动画URL列表
   * @param {Function} progressCallback - 进度回调函数
   * @returns {Promise<Object>} 加载结果
   */
  const preloadAnimations = async (urls, progressCallback) => {
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return { totalSuccess: 0, totalFailed: 0 }
    }
    
    const total = urls.length
    let completed = 0
    let success = 0
    let failed = 0
    
    // 创建进度跟踪对象
    const progress = {
      total,
      completed,
      success,
      failed,
      progress: 0
    }
    
    // 逐个加载
    for (const url of urls) {
      try {
        const result = await loadAnimationData(url)
        completed++
        
        if (result) {
          success++
        } else {
          failed++
        }
        
        // 更新进度
        progress.completed = completed
        progress.success = success
        progress.failed = failed
        progress.progress = (completed / total) * 100
        
        // 调用进度回调
        if (typeof progressCallback === 'function') {
          progressCallback(progress)
        }
      } catch (e) {
        console.error(`预加载动画失败: ${url}`, e)
        completed++
        failed++
        
        // 更新进度
        progress.completed = completed
        progress.failed = failed
        progress.progress = (completed / total) * 100
        
        // 调用进度回调
        if (typeof progressCallback === 'function') {
          progressCallback(progress)
        }
      }
    }
    
    return {
      totalSuccess: success,
      totalFailed: failed,
      total
    }
  }
  
  /**
   * 检查所有动画是否已加载
   * @returns {Boolean} 是否所有动画都已加载
   */
  const isAllAnimationsLoaded = () => {
    // 如果没有动画，返回true
    if (globalStats.value.animations.length === 0) {
      return true
    }
    
    // 检查是否所有动画都已缓存
    return globalStats.value.animations.every(a => a.cached && !a.loading)
  }
  
  return {
    isAnimationCached,
    getAnimationFromCache,
    saveAnimationToCache,
    restoreAnimationFromStorage,
    loadAnimationData,
    clearAnimationCache,
    clearAllAnimationCache,
    getAnimationStats,
    preloadAnimations,
    isAllAnimationsLoaded,
    globalStats
  }
}

/**
 * 提供全局动画状态管理
 * @returns {Object} 全局动画状态和方法
 */
export const useGlobalAnimationState = () => {
  // 直接使用单例模式返回
  const methods = useAnimationCache()
  
  return {
    globalState: globalStats,
    getGlobalStats: methods.getAnimationStats,
    isAllAnimationsLoaded: methods.isAllAnimationsLoaded,
    preloadAnimation: methods.loadAnimationData,
    preloadAnimations: methods.preloadAnimations,
    getAnimationFromCache: methods.getAnimationFromCache,
    clearAnimationCache: methods.clearAnimationCache,
    clearAllAnimationCache: methods.clearAllAnimationCache
  }
}

// 预加载多个动画的辅助函数
export const preloadAnimations = async (urls, progressCallback) => {
  const { preloadAnimations: preload } = useAnimationCache()
  return await preload(urls, progressCallback)
} 