<template>
	<view class="top-navbar">
		<view class="tab-container">
			<view 
				v-for="(tab, index) in tabList" 
				:key="index"
				class="tab-item"
				:class="{ active: currentTab === index }"
				@click="switchTab(index)"
			>
				<text>{{ tab.name }}</text>
				<view v-if="currentTab === index" class="tab-line"></view>
			</view>
		</view>
	
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
		props: {
			// 用户角色
			userRole: {
				type: String,
				default: 'student'
			},
			// 导航栏高度
			navHeight: {
				type: Number,
				default: 60
			},
			// 自定义标签页
			customTabs: {
				type: Array,
				default: null
			}
		},
		data() {
			return {
				studentTabs: [
					{ name: '待预约', id: 'tab1' },
					{ name: '待开始', id: 'tab2' },
					{ name: '已完成', id: 'tab3' }
				],
				teacherTabs: [
					{ name: '待预约', id: 'tab1' },
					{ name: '待开始', id: 'tab2' },
					{ name: '已完成', id: 'tab3' }
				],
				currentTab: 0
			};
		},
		computed: {
			// 根据角色或自定义标签返回显示的标签列表
			tabList() {
				if (this.customTabs) {
					return this.customTabs;
				}
				
				return this.userRole === 'teacher' ? this.teacherTabs : this.studentTabs;
			}
		},
		methods: {
			// 切换Tab
			switchTab(index) {
				this.currentTab = index;
				this.$emit('change', index);
			},
			// 重置Tab
			resetTab() {
				this.currentTab = 0;
			}
		},
		watch: {
			// 监听角色变化，重置标签页
			userRole() {
				this.resetTab();
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

.tab-container {
	display: flex;
	flex-direction: row;
	background: linear-gradient(135deg, #f5f9ff, #edf3ff);
	padding: 5rpx 0;
	white-space: nowrap;
	width: 100%;
	justify-content: center;
	height: 80rpx;
}

.tab-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0 30rpx;
	height: 80rpx;
	position: relative;
	margin: 0 20rpx;
}

.tab-item text {
	font-size: 28rpx;
	color: #5d6b89;
}

.tab-item.active text {
	color: #464EF8;
	font-weight: bold;
}

.tab-line {
	position: absolute;
	bottom: 8rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 80%;
	height: 8rpx;
	background-color: #464EF8;
}

.content-container {
	flex: 1;
	width: 100%;
}

.tab-content {
	padding: 0;
}
</style>