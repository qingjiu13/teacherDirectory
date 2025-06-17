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
  <view class="leading-whole-container">
    <Header title="学历认证" class="header" @back="handleBack"/>
	<ScrollView class="leading-container" scroll-y>
		
		<view class="leading-header">
			<view class="leading-title">如何获取在线验证码</view>
		</view>
		<view class="leading-steps">
			<view class="leading-step">
				<view class="step-title">第一步</view>
				<view class="step-desc">点击前往学信网，进入学信档案页面</view>
				<view class="step-img"><!-- 图片区域 --></view>
			</view>
			<view class="leading-step">
				<view class="step-title">第二步</view>
				<view class="step-desc">登录学信网账号，进入个人档案</view>
				<view class="step-img"><!-- 图片区域 --></view>
			</view>
			<view class="leading-step">
				<view class="step-title">第三步</view>
				<view class="step-desc">点击"在线验证报告"</view>
				<view class="step-img"><!-- 图片区域 --></view>
			</view>
			<view class="leading-step">
				<view class="step-title">第四步</view>
				<view class="step-desc">申请并复制在线验证码</view>
				<view class="step-img"><!-- 图片区域 --></view>
			</view>
		</view>
		<button class="btn-chsi" @click="goToChsi">点击前往学信网</button>
		<view class="leading-footer">
			研师录承诺100%保障你的隐私信息安全
		</view>
	</ScrollView>
</view>
</template>

<script>
/**
 * 学信网官网地址
 * @type {string}
 */
const CHSI_URL = 'https://www.chsi.com.cn/';

import { Navigator, MineRoutes } from '@/router/Router.js';
import Header from '@/components/navigationTitleBar/header'
export default {
	name: 'Leading',
	components: {
		Header
	},
	methods: {
		/**
		 * 跳转到学信网官网（H5端直接window.open，小程序端可提示复制链接）
		 */
		goToChsi() {
			// #ifdef H5
			window.open(CHSI_URL, '_blank');
			// #endif
			// #ifndef H5
			uni.setClipboardData({
				data: CHSI_URL,
				success: () => {
					uni.showToast({ title: '链接已复制，请在浏览器打开', icon: 'none' });
				}
			});
			// #endif
		},
		/**
		 * @description 返回上一页
		 */
		handleBack() {
			Navigator.redirectTo(MineRoutes.QUALIFICATION);
		}
	}
};
</script>

<style scoped>
.leading-whole-container{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
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
.leading-container{
    height: 100%;
}
.header{
    position:absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
}

.leading-header {
	margin-bottom: 32rpx;
}
.leading-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #222;
	margin-bottom: 12rpx;
    margin-left: 24rpx;
    margin-top: 20rpx;
}
.leading-steps {
	margin-bottom: 32rpx;
}
.leading-step {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.step-title {
	font-size: 28rpx;
	color: #3edfcf;
	font-weight: 500;
	margin-bottom: 8rpx;
}
.step-desc {
	font-size: 26rpx;
	color: #222;
	margin-bottom: 12rpx;
}
.step-img {
	width: 100%;
	height: 120rpx;
	background: #f7fafd;
	border-radius: 12rpx;
	margin-bottom: 8rpx;
}
.btn-chsi {
	width: 90%;
	background: linear-gradient(90deg, #3edfcf, #5b8cff);
	color: #fff;
	border: none;
	border-radius: 32rpx;
	padding: 20rpx;
	font-size: 30rpx;
	margin-top: 12rpx;
    margin-bottom: 30rpx;
}
.leading-footer {
    margin-top: 20rpx;
    width: 100%;
    text-align: center;
	color: #bbb;
	font-size: 22rpx;
}
</style>
