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
    <Header title="学历认证"  @back="handleBack"/>
	<view class="why-qualification-container">
	
		<view class="why-qualification-header">
			<view class="why-qualification-title">为什么要认证</view>
			<view class="why-qualification-desc">
				完成认证可以点亮对应标识，信息真实度越高，越容易获得对方的青睐哦~
			</view>
		</view>
		<view class="qualification-card">
			<view class="qualification-icon">
				<!-- 这里可放学历认证icon -->
			</view>
			<view class="qualification-info">
				<view class="qualification-title">学历认证</view>
				<view class="qualification-desc">
					支持学信网在线验证码、毕业证、学生证等多种认证方式。
				</view>
			</view>
			<view class="qualification-action">
				<button
					v-if="!isCertified"
					class="btn-certify"
					@click="goToQualification"
				>去认证</button>
				<button
					v-else
					class="btn-certified"
					disabled
				>已认证</button>
			</view>
		</view>
		<view class="why-qualification-footer">
			研师录承诺100%保障你的隐私信息安全
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { Navigator, MineRoutes } from '@/router/Router.js';
import Header from '@/components/navigationTitleBar/header'
export default {
	name: 'WhyQualification',
	components: {
		Header
	},
	computed: {
		/**
		 * 是否已认证
		 * @returns {boolean}
		 */
		...mapState({
			isCertified: state => state.user.baseInfo.userInfo.certificate === 1
		})
	},
	methods: {
		/**
		 * 跳转到学历认证页面
		 */
		goToQualification() {
			Navigator.toQualification();
		},
		/**
		 * @description 返回上一页
		 */
		handleBack() {
			Navigator.redirectTo(MineRoutes.MINE);
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
.why-qualification-container {
	background: #f7fafd;
	min-height: 100vh;
	padding: 32rpx 24rpx 0 24rpx;
}
.why-qualification-header {
	margin-bottom: 40rpx;
}
.why-qualification-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #222;
	margin-bottom: 12rpx;
}
.why-qualification-desc {
	font-size: 26rpx;
	color: #666;
}
.qualification-card {
	background: #fff;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	flex-direction: row;
	padding: 32rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.qualification-icon {
	width: 72rpx;
	height: 72rpx;
	background: #e6f7f7;
	border-radius: 50%;
	margin-right: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.qualification-info {
	flex: 1;
}
.qualification-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #222;
	margin-bottom: 8rpx;
}
.qualification-desc {
	font-size: 24rpx;
	color: #888;
}
.qualification-action {
	margin-left: 16rpx;
}
.btn-certify {
	background: linear-gradient(90deg, #3edfcf, #5b8cff);
	color: #fff;
	border: none;
	border-radius: 32rpx;
	padding: 12rpx 32rpx;
	font-size: 28rpx;
}
.btn-certified {
	background: #e5e5e5;
	color: #aaa;
	border: none;
	border-radius: 32rpx;
	padding: 12rpx 32rpx;
	font-size: 28rpx;
}
.why-qualification-footer {
    position:absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
	color: #bbb;
	font-size: 22rpx;
}
</style>
