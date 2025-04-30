使用案例：
<template>
  <view class="page">
    <KeyboardSafeInput v-model="text" placeholder="请输入..." />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import KeyboardSafeInput from '@/components/KeyboardSafeInput.vue'

const text = ref('')
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: flex-end;
}
</style>
封装了键盘监听和样式适配逻辑；

支持 v-model 双向绑定；

可自定义 placeholder；

容器自动适配键盘弹起高度，避免遮挡。