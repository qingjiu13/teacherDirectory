# Lottie for MiniProgram

lottie 动画库适配小程序的版本。

基于官方lottie-miniprogram库修改

> 修复了lottie动画未播完就退出，下次无法播放问题

> 修复了lottie动画实例无法destroy的问题

> lottie 的相关介绍与动画生成方法等请参考[官方说明](https://github.com/airbnb/lottie-web)

> 依赖小程序基础库版本 >= 2.9.0 的环境

## 使用

大致步骤如下：

1. 通过 npm 安装：
```
npm install --save @chinaso2018/lottie-miniprogram
```

2. 传入 canvas 对象用于适配
```
<canvas id="canvas" type="2d"></canvas>
```
```
import lottie from '@chinaso2018/lottie-miniprogram'

Page({
  onReady() {
    wx.createSelectorQuery().select('#canvas').node(res => {
      const canvas = res.node
      lottie.setup(canvas)
    }).exec()
  }
})
```

3. 使用 lottie 接口
```
lottie.setup(canvas)
lottie.loadAnimation({
  ...
})
```

## 接口

目前提供两个接口：

#### lottie.setup(canvas)
需要在任何 lottie 接口调用之前调用，传入 canvas 对象

#### lottie.loadAnimation(options)
与原来的 [loadAnimation](https://github.com/airbnb/lottie-web/wiki/loadAnimation-options) 有些不同，支持的参数有：
* loop
* autoplay
* animationData
* path （只支持网络地址）
* rendererSettings.context （必填）
* assetsPath 如果lottie动画包含图片文件，这个参数设置图片目录

## 说明
* 本项目依赖小程序基础库 2.8.0 里性能更好的 canvas 实现，由于还有些小问题~~没有正式开放~~（2.9.0 已正式对外），但目前用在此处暂无发现问题。
* 由于小程序本身不支持动态执行脚本，因此 lottie 的 expression 功能也是不支持的。
