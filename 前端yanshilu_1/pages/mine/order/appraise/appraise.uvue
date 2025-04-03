<template>
  <view class="container">
    <!-- 订单信息卡片 -->
    <view class="order-card">
      <view class="user-info">
        <view class="avatar">
          <text class="avatar-text">学姐</text>
        </view>
        <view class="order-details">
          <text class="user-name">XXXX学姐</text>
          <text class="course-type">类型：线上课程-政治</text>
          <text class="order-time">订单时间：2025/04/12 11:30</text>
        </view>
      </view>
      <text class="price">金额：100.00元</text>
    </view>

    <!-- 评价内容 -->
    <view class="rating-section">
      <!-- 课程总体满意度 -->
      <view class="rating-item">
        <view class="rating-header">
          <view class="icon-wrapper satisfaction">
            <text class="icon-smile">☺</text>
          </view>
          <text class="rating-title">课程总体满意度</text>
        </view>
        <view class="star-group">
          <text 
            v-for="(star, index) in 5" 
            :key="index"
            class="star-icon"
            :class="{ 'star-active': index < overallRating }"
            @click="setRating('overall', index + 1)"
          >★</text>
        </view>
      </view>

      <!-- 专业知识能力 -->
      <view class="rating-item">
        <view class="rating-header">
          <view class="icon-wrapper knowledge">
            <text class="icon-book">📚</text>
          </view>
          <text class="rating-title">专业知识能力</text>
        </view>
        <view class="star-group">
          <text 
            v-for="(star, index) in 5" 
            :key="index"
            class="star-icon"
            :class="{ 'star-active': index < professionalRating }"
            @click="setRating('professional', index + 1)"
          >★</text>
        </view>
      </view>

      <!-- 授课态度 -->
      <view class="rating-item">
        <view class="rating-header">
          <view class="icon-wrapper attitude">
            <text class="icon-heart">❤</text>
          </view>
          <text class="rating-title">授课态度</text>
        </view>
        <view class="star-group">
          <text 
            v-for="(star, index) in 5" 
            :key="index"
            class="star-icon"
            :class="{ 'star-active': index < attitudeRating }"
            @click="setRating('attitude', index + 1)"
          >★</text>
        </view>
      </view>

      <!-- 评价输入框 -->
      <view class="comment-section">
        <view class="comment-header">
          <view class="icon-wrapper comment">
            <text class="icon-edit">✎</text>
          </view>
          <text class="comment-title">课程评价</text>
        </view>
        <textarea 
          class="comment-input" 
          placeholder="请输入您的评价内容，帮助我们提供更好的服务" 
          v-model="comment"
          maxlength="200"
        ></textarea>
        <text class="word-count">{{ comment.length }}/200</text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" @click="submitAppraise">提交评价</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      overallRating: 0,
      professionalRating: 0,
      attitudeRating: 0,
      comment: ''
    }
  },
  methods: {
    setRating(type, rating) {
      switch(type) {
        case 'overall':
          this.overallRating = rating
          break
        case 'professional':
          this.professionalRating = rating
          break
        case 'attitude':
          this.attitudeRating = rating
          break
      }
    },
    submitAppraise() {
      if (this.overallRating === 0 || this.professionalRating === 0 || this.attitudeRating === 0) {
        uni.showToast({
          title: '请完成所有评分项',
          icon: 'none'
        })
        return
      }
      
      uni.showToast({
        title: '评价提交成功',
        icon: 'success'
      })
      
      // 延迟返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  }
}
</script>

<style>
.container {
  flex: 1;
  background-color: #f8f8f8;
  padding-bottom: 120rpx;
  padding-top: 20rpx;
}

.order-card {
  margin: 20rpx;
  padding: 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.user-info {
  flex-direction: row;
  margin-bottom: 20rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  margin-right: 20rpx;
  background: linear-gradient(45deg, #007AFF, #00C6FF);
  justify-content: center;
  align-items: center;
}

.avatar-text {
  color: #ffffff;
  font-size: 32rpx;
  font-weight: bold;
}

.order-details {
  flex: 1;
  justify-content: center;
}

.user-name {
  font-size: 32rpx;
  color: #333333;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.course-type, .order-time {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 6rpx;
}

.price {
  font-size: 30rpx;
  color: #ff6b6b;
  font-weight: 500;
}

.rating-section {
  margin: 20rpx;
  padding: 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.rating-item {
  margin-bottom: 40rpx;
}

.rating-header {
  flex-direction: row;
  align-items: center;
  margin-bottom: 20rpx;
}

.icon-wrapper {
  width: 60rpx;
  height: 60rpx;
  border-radius: 30rpx;
  margin-right: 16rpx;
  justify-content: center;
  align-items: center;
}

.satisfaction {
  background: linear-gradient(45deg, #FFB800, #FFDA00);
}

.knowledge {
  background: linear-gradient(45deg, #00B578, #00E1A0);
}

.attitude {
  background: linear-gradient(45deg, #FF6B6B, #FFA0A0);
}

.comment {
  background: linear-gradient(45deg, #8A2BE2, #BA55D3);
}

.icon-smile, .icon-book, .icon-heart, .icon-edit {
  color: #ffffff;
  font-size: 36rpx;
}

.rating-title {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
}

.star-group {
  flex-direction: row;
  padding: 0 20rpx;
}

.star-icon {
  font-size: 50rpx;
  color: #dddddd;
  margin-right: 30rpx;
}

.star-active {
  color: #ffd700;
}

.comment-section {
  margin-top: 20rpx;
  position: relative;
}

.comment-header {
  flex-direction: row;
  align-items: center;
  margin-bottom: 20rpx;
}

.comment-title {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
}

.comment-input {
  width: 100%;
  height: 240rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #333333;
  background-color: #f8f8f8;
  border-radius: 12rpx;
}

.word-count {
  position: absolute;
  right: 24rpx;
  bottom: 24rpx;
  font-size: 24rpx;
  color: #999999;
}

.submit-section {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx 40rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.submit-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: linear-gradient(45deg, #007AFF, #00C6FF);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: 40rpx;
  text-align: center;
}
</style>