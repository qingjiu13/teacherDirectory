# Lottie动画组件使用说明

## 简介

这是一个基于Vue3开发的Lottie动画组件，支持在H5、App以及各类小程序中使用。该组件可以轻松加载和控制Lottie格式的动画，使您的应用界面更加生动有趣。

## 特性

- 支持多端：H5、App、小程序
- 支持网络动画文件和本地动画数据
- 提供丰富的动画控制API
- 支持自动播放、循环播放
- 支持动画事件监听
- 提供canvas和svg两种渲染模式（小程序仅支持canvas）

## 安装

### 1. 安装依赖

```bash
# 安装lottie-web（适用于H5和App）
npm install lottie-web --save

# 安装lottie-miniprogram（适用于小程序）
npm install lottie-miniprogram --save
```

### 2. 导入组件

在需要使用的页面中导入组件：

```javascript
import CLottie from '@/components/c-lottie/c-lottie.vue'

export default {
  components: {
    CLottie
  }
}
```

## 使用方法

### 基础用法

```html
<template>
  <c-lottie 
    width="300rpx" 
    height="300rpx" 
    src="https://assets2.lottiefiles.com/packages/lf20_UJNc2t.json" 
    :autoPlay="true"
    :loop="true"
    @Complete="onAnimationComplete"
  />
</template>

<script setup>
import { ref } from 'vue'

const onAnimationComplete = () => {
  console.log('动画播放完成')
}
</script>
```

### 动画控制

通过ref获取组件实例，调用`call`方法控制动画：

```html
<template>
  <c-lottie 
    ref="lottieRef"
    width="300rpx" 
    height="300rpx" 
    src="https://assets2.lottiefiles.com/packages/lf20_UJNc2t.json" 
    :autoPlay="false"
  />
  <button @click="play">播放</button>
  <button @click="pause">暂停</button>
  <button @click="stop">停止</button>
  <button @click="setSpeed(2)">2倍速</button>
</template>

<script setup>
import { ref } from 'vue'

const lottieRef = ref(null)

// 播放动画
const play = () => {
  lottieRef.value.call('play')
}

// 暂停动画
const pause = () => {
  lottieRef.value.call('pause')
}

// 停止动画
const stop = () => {
  lottieRef.value.call('stop')
}

// 设置播放速度
const setSpeed = (speed) => {
  lottieRef.value.call('setSpeed', speed)
}
</script>
```

## 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| canvasId | String | 自动生成 | 画布id |
| width | String | '750rpx' | 图像宽度，单位rpx/px |
| height | String | '750rpx' | 图像高度，单位rpx/px |
| src | String | - | Lottie文件地址（小程序只支持网络地址） |
| data | String | - | Lottie文件data数据 |
| autoPlay | Boolean | true | 是否自动播放 |
| loop | Boolean | true | 是否循环播放 |
| renderer | String | 'canvas' | 渲染模式，可选值：svg、canvas（小程序不支持svg） |
| isOnChange | Boolean | false | 是否开启播放进度监听，false时不触发EnterFrame事件 |

## 事件说明

| 事件名 | 说明 |
| --- | --- |
| Complete | 动画播放完成时触发 |
| LoopComplete | 当前循环播放完成时触发 |
| EnterFrame | 动画播放进度变化时触发（需设置isOnChange为true） |
| SegmentStart | 开始播放一个动画片段时触发 |
| dataReady | 当动画的所有部分都已加载完成时触发 |
| dataFailed | 当部分动画无法加载时触发 |

## 方法说明

组件内部方法统一使用 `call(funName, args)` 调用player实例方法：

```javascript
// 示例：播放动画
lottieRef.value.call('play')

// 示例：设置播放速度
lottieRef.value.call('setSpeed', 2)
```

### 常用方法

| 方法名 | 参数 | 说明 |
| --- | --- | --- |
| play | - | 播放动画 |
| pause | - | 暂停动画 |
| stop | - | 停止动画 |
| setSpeed | speed | 设置播放速度，例如：2表示2倍速 |
| goToAndPlay | position, isFrame | 跳转到指定位置并播放 |
| goToAndStop | position, isFrame | 跳转到指定位置并停止 |
| setDirection | direction | 设置播放方向，1为正向，-1为反向 |
| playSegments | segments, forceFlag | 播放指定片段 |
| destroy | - | 销毁动画实例 |

## 注意事项

1. 小程序环境下只支持网络地址的Lottie文件
2. 小程序环境下只支持canvas渲染模式
3. 组件卸载时会自动销毁动画实例，无需手动处理
4. 在H5和App端，推荐使用svg渲染模式获得更好的性能
5. 若在使用中遇到动画加载失败，请检查Lottie文件格式是否正确

## 示例代码

```html
<template>
  <view class="container">
    <c-lottie
      ref="lottieRef"
      width="500rpx"
      height="500rpx"
      src="https://assets9.lottiefiles.com/packages/lf20_vcr2lj.json"
      :loop="true"
      :autoPlay="true"
      :isOnChange="true"
      @Complete="onComplete"
      @LoopComplete="onLoopComplete"
      @EnterFrame="onEnterFrame"
      @dataReady="onDataReady"
    />
    
    <view class="control-panel">
      <button @click="playAnimation">播放</button>
      <button @click="pauseAnimation">暂停</button>
      <button @click="stopAnimation">停止</button>
      <button @click="setAnimationSpeed(0.5)">0.5倍速</button>
      <button @click="setAnimationSpeed(1)">1倍速</button>
      <button @click="setAnimationSpeed(2)">2倍速</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const lottieRef = ref(null)

// 事件处理函数
const onComplete = () => {
  console.log('动画播放完成')
}

const onLoopComplete = () => {
  console.log('当前循环播放完成')
}

const onEnterFrame = (frame) => {
  console.log('当前帧:', frame)
}

const onDataReady = () => {
  console.log('动画数据加载完成')
}

// 控制函数
const playAnimation = () => {
  lottieRef.value.call('play')
}

const pauseAnimation = () => {
  lottieRef.value.call('pause')
}

const stopAnimation = () => {
  lottieRef.value.call('stop')
}

const setAnimationSpeed = (speed) => {
  lottieRef.value.call('setSpeed', speed)
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.control-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

button {
  margin: 5px;
}
</style>
``` 