<template>
    <view class="form-container"
          :style="{ paddingBottom: keyboardHeight + 'px' }">
      <slot />
    </view>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  
  /**
   * 这个组件：
   *  - 监听 uni.onKeyboardHeightChange 事件，把 paddingBottom 设为键盘高度
   *  - 暴露一个 openWhenReady(ref) 方法：如果键盘已打开，立即调用 ref.openDropdown()
   *    否则先缓存，待键盘实际弹起后再执行
   */
  
  const keyboardHeight = ref(0)
  const isKeyboardOpen = ref(false)
  const pending = []
  
  function onKbChange(e) {
    const h = e.detail?.height || 0
    keyboardHeight.value = h
    isKeyboardOpen.value = h > 0
  }
  
  onMounted(() => {
    uni.onKeyboardHeightChange(onKbChange)
  })
  onUnmounted(() => {
    uni.offKeyboardHeightChange(onKbChange)
  })
  
  // 对外接口：在父组件里用 `ref="container"` 拿到这个组件实例后，可以这样调用：
  //   container.openWhenReady(this.$refs.schoolDropdown)
  function openWhenReady(dropdownRef) {
    if (!dropdownRef || typeof dropdownRef.openDropdown !== 'function') return
    if (isKeyboardOpen.value) {
      // 如果键盘已经弹起，直接打开
      dropdownRef.openDropdown()
    } else {
      // 否则缓存，等键盘弹起再打开
      pending.push(dropdownRef)
    }
  }
  
  // 监听 keyboardHeight 从 0 变为 >0，然后一次性打开所有 pending 队列
  watch(isKeyboardOpen, val => {
    if (val && pending.length) {
      pending.forEach(ref => ref.openDropdown())
      pending.length = 0
    }
  })
  
  defineExpose({ openWhenReady })
  
  </script>
  
  
  <style scoped>
  .input-wrapper {
    padding: 20rpx;
    background-color: #f2f2f2;
    transition: padding-bottom 0.2s;
  }
  .input {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 8rpx;
    padding: 16rpx;
    font-size: 28rpx;
    background-color: #fff;
  }
  </style>
  