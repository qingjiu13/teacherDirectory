<template>
    <view class="background-image">
    <image
      class="background-image-img"
      src="/static/image/bgPicture/background1.png"
      mode="aspectFill" alt="背景图"
    />
  </view>
  <view class="background-image">
    <image
      class="background-image-img"
      src="/static/image/bgPicture/background.png"
      mode="aspectFill" alt="背景图"
    />
  </view>
<view class="qualification-whole-container">
  <Header title="学历认证"  @back="handleBack"/>
  <view class="qualification-container">

    <view class="qualification-header">
      <view class="qualification-desc">
        这里是海量高学历单身用户聚集地，完成学历认证，认识更多和你一样优秀的她~
      </view>
    </view>
    <view class="qualification-form">
      <view class="qualification-method-title">认证方式</view>
      <view class="qualification-method-box">
        <view class="qualification-method-label">学信网在线验证码</view>
      </view>
      <view class="qualification-code-title">在线验证码</view>
      <input
        class="qualification-code-input"
        type="text"
        v-model="code"
        maxlength="18"
        placeholder="请输入12-18位编号"
      />
      <view class="qualification-tip">
        <text class="tip-link" @click="goToLeading">如何获取在线验证码</text>
      </view>
      <button
        class="btn-auth"
        :disabled="!code"
        :class="{ 'btn-auth-disabled': !code }"
        @click="submitAuth"
      >立即认证</button>
    </view>
    <view class="qualification-footer">
      研师录承诺100%保障你的隐私信息安全
    </view>
  </view>
  </view>
</template>

<script>
import { Navigator, MineRoutes } from '@/router/Router.js';
import Header from '@/components/navigationTitleBar/header'
export default {
  name: 'Qualification',
  components: {
    Header
  },
  data() {
    return {
      /**
       * 学信网在线验证码
       * @type {string}
       */
      code: ''
    };
  },
  methods: {
    /**
     * 跳转到学信网验证码获取引导页
     */
    goToLeading() {
      Navigator.toLeading();
    },
    /**
     * 提交认证（此处仅做演示，实际需接入后端）
     */
    submitAuth() {
      if (!this.code) return;
      // TODO: 提交认证逻辑
      uni.showToast({ title: '已提交认证', icon: 'success' });
    },
    /**
     * @description 返回上一页
     */
    handleBack() {
      Navigator.redirectTo(MineRoutes.WHY_QUALIFICATION);
    }
  }
};
</script>

<style scoped>
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
}
.background-image-img {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  display: block;
}
.qualification-whole-container {
  height:100%;
}
.qualification-container {
  background: transparent;
  height:100%;
}
.qualification-header {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
    padding: 20rpx;
}
.qualification-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 12rpx;
}
.qualification-desc {
  font-size: 26rpx;
  color: #666;
}
.qualification-form {
  background:transparent;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.qualification-method-title {
  font-size: 26rpx;
  color: #888;
  margin-bottom: 8rpx;
}
.qualification-method-box {
  text-align: center;
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  margin-bottom: 12rpx;
  background: #f7fafd;
}
.qualification-method-label {
  text-align: left;
  font-size: 28rpx;
  color: #222;
  margin-top:26rpx;
}
.qualification-code-title {
  font-size: 26rpx;
  color: #888;
  margin-bottom: 8rpx;
}
.qualification-code-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  margin-bottom: 12rpx;
  background: #f7fafd;
}
.qualification-tip {
  margin-bottom: 24rpx;
}
.tip-link {
  color: #5b8cff;
  font-size: 24rpx;
  text-decoration: underline;
}
.btn-auth {
  width: 100%;
  background: linear-gradient(90deg, #3edfcf, #5b8cff);
  color: #fff;
  border: none;
  border-radius: 32rpx;
  padding: 20rpx 0;
  font-size: 30rpx;
  margin-top: 12rpx;
}
.btn-auth-disabled {
  background: #e5e5e5 !important;
  color: #aaa !important;
}
.qualification-footer {
  text-align: center;
  color: #bbb;
  font-size: 22rpx;
  margin-top: 80rpx;
}
</style>