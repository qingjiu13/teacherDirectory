<template>
  <view class="container">
    <!-- 订单信息卡片 -->
    <view class="order-card">
      <view class="user-info">
        <view class="avatar">
          <text class="avatar-text">{{ courseInfo.teacher ? courseInfo.teacher.substring(0, 1) : '讲' }}</text>
        </view>
        <view class="order-details">
          <text class="user-name">{{ courseInfo.teacher || 'XXXX老师' }}</text>
          <text class="course-type">课程：{{ courseInfo.name || 'XXXX课程' }}</text>
          <text class="order-time">订单时间：{{ getCurrentDate() }}</text>
        </view>
      </view>
      <text class="price">金额：{{ courseInfo.price }}元</text>
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
      comment: '',
      courseInfo: {
        id: '',
        name: '',
        teacher: '',
        price: 0
      }
    }
  },
  onLoad(options) {
    // 接收传递的课程信息
    if (options) {
      this.courseInfo = {
        id: options.courseId || '',
        name: options.courseName || 'XXXX课程',
        teacher: options.teacherName || 'XXXX老师',
        price: options.price || '100.00'
      };
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
      
      // 构建评价数据，实际应用中可以发送到服务器
      const appraiseData = {
        courseId: this.courseInfo.id,
        courseName: this.courseInfo.name,
        teacher: this.courseInfo.teacher,
        ratings: {
          overall: this.overallRating,
          professional: this.professionalRating,
          attitude: this.attitudeRating
        },
        comment: this.comment,
        submitTime: new Date().toLocaleString()
      };
      
      console.log('提交评价:', appraiseData);
      
      uni.showToast({
        title: '评价提交成功',
        icon: 'success'
      })
      
      // 延迟返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    },
    getCurrentDate() {
      const date = new Date();
      return date.toLocaleString();
    }
  }
}
</script>

<style>
.container {
  flex: 1;
  background-color: #f7f9fc;
  padding-bottom: 120rpx;
  padding-top: 30rpx;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.order-card {
  margin: 20rpx 30rpx;
  padding: 35rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  border-left: 8rpx solid #3a86ff;
}

.user-info {
  flex-direction: row;
  margin-bottom: 25rpx;
}

.avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: 55rpx;
  margin-right: 25rpx;
  background: linear-gradient(135deg, #3a86ff, #4361ee);
  justify-content: center;
  align-items: center;
  box-shadow: 0 6rpx 12rpx rgba(67, 97, 238, 0.2);
}

.avatar-text {
  color: #ffffff;
  font-size: 36rpx;
  font-weight: bold;
}

.order-details {
  flex: 1;
  justify-content: center;
}

.user-name {
  font-size: 34rpx;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 14rpx;
}

.course-type, .order-time {
  font-size: 28rpx;
  color: #5d6b89;
  margin-bottom: 8rpx;
  display: flex;
  align-items: center;
}

.course-type::before, .order-time::before {
  content: "";
  display: inline-block;
  width: 6rpx;
  height: 6rpx;
  background-color: #5d6b89;
  border-radius: 50%;
  margin-right: 8rpx;
}

.price {
  font-size: 34rpx;
  color: #ff5a5f;
  font-weight: 500;
}

.rating-section {
  margin: 20rpx 30rpx;
  padding: 35rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.rating-item {
  margin-bottom: 45rpx;
}

.rating-header {
  flex-direction: row;
  align-items: center;
  margin-bottom: 25rpx;
}

.icon-wrapper {
  width: 65rpx;
  height: 65rpx;
  border-radius: 32.5rpx;
  margin-right: 20rpx;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
}

.satisfaction {
  background: linear-gradient(45deg, #ffb800, #ffda00);
}

.knowledge {
  background: linear-gradient(45deg, #00b578, #00e1a0);
}

.attitude {
  background: linear-gradient(45deg, #ff5a5f, #ff8a8e);
}

.comment {
  background: linear-gradient(45deg, #8a2be2, #ba55d3);
}

.icon-smile, .icon-book, .icon-heart, .icon-edit {
  color: #ffffff;
  font-size: 38rpx;
}

.rating-title {
  font-size: 32rpx;
  color: #2c3e50;
  font-weight: 500;
}

.star-group {
  flex-direction: row;
  padding: 0 25rpx;
}

.star-icon {
  font-size: 55rpx;
  color: #e5e9f2;
  margin-right: 35rpx;
  transition: all 0.2s ease;
}

.star-active {
  color: #ffd700;
}

.comment-section {
  margin-top: 30rpx;
  position: relative;
}

.comment-header {
  flex-direction: row;
  align-items: center;
  margin-bottom: 25rpx;
}

.comment-title {
  font-size: 32rpx;
  color: #2c3e50;
  font-weight: 500;
}

.comment-input {
  width: 100%;
  height: 240rpx;
  padding: 30rpx;
  font-size: 30rpx;
  color: #2c3e50;
  background-color: #f7f9fc;
  border-radius: 16rpx;
  border: 1px solid #e5e9f2;
}

.word-count {
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
  font-size: 26rpx;
  color: #8c9db5;
}

.submit-section {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 25rpx 40rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.08);
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background: linear-gradient(135deg, #3a86ff, #4361ee);
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 500;
  border-radius: 45rpx;
  text-align: center;
  box-shadow: 0 6rpx 12rpx rgba(67, 97, 238, 0.2);
}
</style>