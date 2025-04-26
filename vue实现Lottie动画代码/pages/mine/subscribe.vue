<template>
  <view class="container">
    <view class="subscribe-box">
      <view class="header">
        <image class="qr-code" src="/static/image/qrcode-placeholder.png" mode="aspectFit"></image>
      </view>
      <view class="content">
        <view class="title">扫码关注公众号</view>
        <view class="description">
          <text>关注公众号，获取最新课程资讯、教学动态</text>
          <text>以及专属优惠活动</text>
        </view>
        <view class="benefits">
          <view class="benefit-item">
            <text class="icon">📚</text>
            <text class="text">海量优质课程</text>
          </view>
          <view class="benefit-item">
            <text class="icon">🎁</text>
            <text class="text">专属会员优惠</text>
          </view>
          <view class="benefit-item">
            <text class="icon">📱</text>
            <text class="text">便捷学习体验</text>
          </view>
        </view>
      </view>
      <view class="footer">
        <button class="back-btn" @click="goBack">返回</button>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @description 公众号订阅页面
 */
export default {
  data() {
    return {}
  },
  methods: {
    /**
     * @description 返回上一页
     */
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.subscribe-box {
  width: 100%;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.qr-code {
  width: 400rpx;
  height: 400rpx;
  border: 1px solid #eeeeee;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
}

.description {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
}

.description text {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.5;
  text-align: center;
}

.benefits {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 60rpx;
}

.benefit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.text {
  font-size: 24rpx;
  color: #666666;
}

.footer {
  display: flex;
  justify-content: center;
}

.back-btn {
  width: 300rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #007AFF;
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 40rpx;
}
</style> 