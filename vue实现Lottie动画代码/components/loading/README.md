# Lottie全局加载动画组件

这是一个基于Lottie的全局加载动画组件，支持缓存和全局控制功能。

## 功能特点

- 支持Lottie动画展示
- 全局控制API
- 动画数据缓存（内存+本地存储）
- 预加载机制
- 进度跟踪
- 支持自定义样式和配置

## 组件结构

- `LoadingAnimation.vue`: 基础Lottie动画组件
- `GlobalLoading.vue`: 全局加载蒙层组件
- `useAnimationCache.js`: 动画缓存和全局状态管理
- `index.js`: 插件注册和API导出

## 使用方法

### 1. 在main.js中注册插件

```js
import { createApp } from 'vue'
import App from './App.vue'
import LoadingPlugin from './components/loading'

const app = createApp(App)

// 注册加载插件
app.use(LoadingPlugin, {
  preload: {
    animations: [
      'https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json'
    ]
  }
})

app.mount('#app')
```

### 2. 在App.vue中使用全局组件

```vue
<template>
  <App>
    <GlobalLoading ref="globalLoadingRef" />
  </App>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const globalLoadingRef = ref(null)

onMounted(() => {
  // 可以直接使用引用访问
  if (globalLoadingRef.value) {
    globalLoadingRef.value.preload()
  }
})
</script>
```

### 3. 在任意组件中使用全局API

```vue
<template>
  <view>
    <button @click="showLoading">显示加载</button>
    <button @click="hideLoading">隐藏加载</button>
  </view>
</template>

<script setup>
const showLoading = () => {
  // 方式1：通过全局App对象
  const app = getApp()
  if (app.globalData.$loading) {
    app.globalData.$loading.show()
  }
  
  // 方式2：通过组件实例方法
  uni.$loading.show()
}

const hideLoading = () => {
  uni.$loading.hide()
}
</script>
```

### 4. 直接使用LoadingAnimation组件

```vue
<template>
  <view>
    <LoadingAnimation 
      src="https://lottie.host/aa045d36-86ee-46d3-9705-1eeb65b38465/V6aAFX4Fmk.json"
      width="300rpx"
      height="300rpx"
      :autoPlay="true"
      text="数据加载中..."
    />
  </view>
</template>

<script setup>
import { LoadingAnimation } from '@/components/loading'
</script>
```

### 5. 使用Hooks

```vue
<script setup>
import { useAnimationCache, useGlobalAnimationState } from '@/components/loading'

// 使用动画缓存
const { 
  loadAnimationData, 
  isAnimationCached, 
  getAnimationFromCache 
} = useAnimationCache()

// 使用全局状态
const { 
  globalState, 
  getGlobalStats, 
  isAllAnimationsLoaded 
} = useGlobalAnimationState()

// 预加载动画
const preloadAnimation = async () => {
  const animationUrl = 'https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json'
  
  // 检查是否已缓存
  if (isAnimationCached(animationUrl)) {
    console.log('动画已缓存')
    return getAnimationFromCache(animationUrl)
  }
  
  // 加载动画
  const data = await loadAnimationData(animationUrl)
  return data
}
</script>
```

## API参考

### GlobalLoading组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|-------|------|
| src | String | - | 动画源文件地址 |
| width | String | '200rpx' | 动画宽度 |
| height | String | '200rpx' | 动画高度 |
| fullscreen | Boolean | true | 是否全屏显示 |
| transparent | Boolean | false | 背景是否透明 |
| backgroundColor | String | 'rgba(255, 255, 255, 0.9)' | 背景颜色 |
| autoPlay | Boolean | true | 是否自动播放 |
| preload | Boolean | true | 是否预加载 |
| showText | Boolean | true | 是否显示加载文字 |
| text | String | '加载中...' | 加载文字内容 |
| zIndex | Number | 9999 | 层级 |

### GlobalLoading组件方法

| 方法 | 参数 | 返回值 | 说明 |
|------|------|-------|------|
| show | - | - | 显示加载动画 |
| hide | - | - | 隐藏加载动画 |
| preload | - | Promise<boolean> | 预加载动画资源 |
| getAnimationStats | - | Object | 获取动画统计信息 |

### useAnimationCache Hook

| 方法 | 参数 | 返回值 | 说明 |
|------|------|-------|------|
| isAnimationCached | url: String | Boolean | 检查动画是否已缓存 |
| getAnimationFromCache | url: String | Object\|null | 从缓存中获取动画数据 |
| loadAnimationData | url: String | Promise<Object> | 加载动画数据 |
| clearAnimationCache | url: String | Boolean | 清除特定动画的缓存 |
| clearAllAnimationCache | - | Boolean | 清除所有动画缓存 |
| preloadAnimations | urls: Array<String>, progressCallback: Function | Promise<Object> | 批量预加载动画 |

## 注意事项

1. 确保在App.vue中引入GlobalLoading组件
2. 在main.js中注册插件以启用全局API
3. 常用动画建议在应用启动时预加载
4. 缓存数据会保存在本地存储中，以便下次使用 