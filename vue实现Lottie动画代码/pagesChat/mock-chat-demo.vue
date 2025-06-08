<template>
  <view class="demo-container">
    <chat-demo></chat-demo>
  </view>
</template>

<script>
import ChatDemo from './components/ChatDemo.vue';

export default {
  components: {
    ChatDemo
  },
  data() {
    return {};
  },
  onLoad() {
    uni.setNavigationBarTitle({
      title: '聊天模拟数据演示'
    });
  }
}
</script>

<style>
.demo-container {
  width: 100%;
  height: 100vh;
}
</style> 