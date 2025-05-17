<template>
  <view class="header-container">
    <image
      class="nav-back"
      src="/static/image/navBack.png"
      mode="aspectFit"
      @click="onBack"
    />
    <text class="header-title">{{ title }}</text>
  </view>
</template>

<script>
/**
 * 自定义导航栏组件
 * @module Header
 * @props {String} title - 标题文字
 * @emits back - 返回按钮点击事件
 */
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  methods: {
    /**
     * 返回按钮点击事件处理
     * @event back
     */
    onBack() {
      this.$emit('back');
    }
  }
}
</script>

<style scoped>
.header-container {
  width: 100%;
  height: 200rpx;
  display: flex;
  align-items: flex-end;
  position: relative;
  background-color: #fff;
  z-index: 100;
}
.nav-back {
  position: absolute;
  top: 130rpx;
  left: 40rpx;
  width: 72rpx;
  height: 62rpx;
  z-index: 100;
}
.header-title {
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 16rpx;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 36rpx;
  line-height: 70rpx;
  letter-spacing: -1.1rpx;
  color: #000;
}
</style>
