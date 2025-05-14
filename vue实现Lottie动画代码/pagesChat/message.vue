<template>
  <view class="container">
    <view class="content">
      <text class="title">消息页面</text>
      <!-- 消息列表内容将在这里 -->
    </view>
    
    <!-- 添加自定义底部导航栏 -->
    <TabBar pageName="message" />
  </view>
</template>

<script>
/**
 * @description 消息页面
 */
import TabBar from '@/components/tab-bar/tab-bar.vue'

export default {
  components: {
    TabBar
  },
  data() {
    return {
      // 消息数据
    }
  },
  onLoad() {
    // 加载消息数据
  },
  methods: {
    /**
     * @description 加载消息列表
     */
    loadMessages() {
      // 实现加载消息的逻辑
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 55px; /* 为自定义tabBar留出空间 */
}
.title {
  font-size: 36rpx;
  color: #333;
}
</style>