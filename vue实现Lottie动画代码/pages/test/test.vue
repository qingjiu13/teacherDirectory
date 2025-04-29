<template>
	<view>
		<c-lottie
			ref="cLottieRef"
			:src='src'
			@LoopComplete="onLoopComplete" 
			width="750rpx" height='750rpx' :loop="true"></c-lottie>
		<view class="content">
			<view>切换图像</view>
			<view class="btnBox">
				<button @click="src='https://lottie.host/5082ce37-c10e-4773-984c-ea2558105fd8/KhTUklUfWb.json'" size="mini">测试</button>
				<button @click="src='https://lottie.host/5082ce37-c10e-4773-984c-ea2558105fd8/KhTUklUfWb.json'" size="mini">测试动画</button>
			</view>
			<view>播放暂停</view>
			<view class="btnBox">
				<button @click="cLottieRef.call('play')" size="mini">播放</button>
				<button @click="cLottieRef.call('setDirection',-1)" size="mini">反向播放</button>
				<button @click="cLottieRef.call('pause')" size="mini">暂停播放</button>
				<button @click="cLottieRef.call('stop')" size="mini">停止播放</button>
			</view>
			<view>播放速度</view>
			<view class="btnBox">
				<button @click="cLottieRef.call('setSpeed',1)" size="mini">播放速度1x</button>
				<button @click="cLottieRef.call('setSpeed',2)" size="mini">播放速度2x</button>
			</view>
			<view>播放其它设置</view>
			<view class="btnBox">
				<button @click="cLottieRef.call('goToAndStop',[2000,false])" size="mini">跳转到2s并暂停</button>
				<button @click="cLottieRef.call('goToAndPlay',[2000,false])" size="mini">跳转到2s并播放</button>
			</view>
			<view class="btnBox">
				<button @click="cLottieRef.call('goToAndStop',[2,true])" size="mini">跳转到第2帧并暂停</button>
				<button @click="cLottieRef.call('goToAndPlay',[2,true])" size="mini">跳转到第2帧并播放</button>
			</view>
			<view class="btnBox">
				<button @click="cLottieRef.call('playSegments',[[10,20],false])" size="mini">播放完之前的片段，播放10-20帧</button>
			</view>
			<view class="btnBox">
				<button @click="cLottieRef.call('playSegments',[[[0,5],[10,18]],true])" size="mini">直接播放0-5帧和10-18帧</button>
			</view>
			
		</view>
	</view>
</template>

<script setup>
	import { ref } from "vue";
	const cLottieRef = ref()
	let src=ref('https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json')
	const onLoopComplete=(val)=>{
		// console.log('当前循环播放完成',val);
	}
</script>

<style lang="scss">
	.page{
		width: 100vw;
		overflow-x: hidden;
	}
	.content{
		padding: 20rpx;
		font-size: 28rpx;
	}
	.btnBox{
		width: 100%;
		display: flex;align-items: center;
		margin-top: 20rpx;
		margin-bottom: 30rpx;
	}
</style>