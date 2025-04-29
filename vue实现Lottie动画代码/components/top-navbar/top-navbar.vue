<template>
	<view class="top-navbar">
		<scroll-view 
			class="tab-bar" 
			scroll-x 
			:scroll-into-view="'tab-' + currentTab"
			:scroll-with-animation="true"
		>
			<view 
				v-for="(tab, index) in tabs" 
				:key="index"
				:id="'tab-' + index"
				class="tab-item"
				:class="{ active: currentTab === index }"
				@click="switchTab(index)"
			>
				{{ tab.name }}
			</view>
		</scroll-view>
	
		<view class="content-container">
			<view v-if="currentTab === 0" class="tab-content">
				<slot name="page1"></slot>
			</view>
			<view v-else-if="currentTab === 1" class="tab-content">
				<slot name="page2"></slot>
			</view>
			<view v-else-if="currentTab === 2" class="tab-content">
				<slot name="page3"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"top-navbar",
		data() {
			return {
				tabs: [
					{ name: '待预约', id: 'tab1' },
					{ name: '已预约', id: 'tab2' },
					{ name: '已完成', id: 'tab3' }
				],
				currentTab: 0
			};
		},
		methods: {
			// 切换Tab
			switchTab(index) {
				this.currentTab = index;
				this.$emit('change', index);
			}
		}
	}
</script>

<style>
.top-navbar {
	display: flex;
	flex-direction: column;
	width: 100%;
	font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

.tab-bar {
	display: flex;
	flex-direction: row;
	background-color: #ffffff;
	padding: 25rpx 0;
	position: sticky;
	top: 0;
	z-index: 100;
	white-space: nowrap;
	width: 100%;
	border-bottom: 2rpx solid #e5e9f2;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
}

.tab-item {
	display: inline-block;
	padding: 15rpx 35rpx;
	text-align: center;
	font-size: 30rpx;
	color: #5d6b89;
	position: relative;
	flex-shrink: 0;
	margin: 0 30rpx;
	border-radius: 40rpx;
	transition: all 0.3s ease;
}

.tab-item.active {
	color: #3a86ff;
	font-weight: bold;
	background-color: #f0f5ff;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: -16rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 48rpx;
	height: 5rpx;
	background-color: #3a86ff;
	border-radius: 6rpx;
}

.content-container {
	flex: 1;
	width: 100%;
}

.tab-content {
	padding: 20rpx;
}
</style>