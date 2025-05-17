<template>
	<view class="top-navbar">
		<scroll-view 
			class="tab-bar" 
			scroll-x 
			:scroll-into-view="'tab-' + currentTab"
			:scroll-with-animation="true"
		>
			<view 
				v-for="(tab, index) in tabList" 
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

.tab-bar {
	display: flex;
	flex-direction: row;
	background: linear-gradient(135deg, #f5f9ff, #edf3ff);
	padding: 5rpx 0 0 0;
	position: sticky;
	top: 0;
	z-index: 100;
	white-space: nowrap;
	width: 100%;
	border-bottom: none;
	justify-content: center;
	box-shadow: none;
	height: 60rpx;
}

.tab-item {
	display: inline-block;
	padding: 4rpx 30rpx;
	text-align: center;
	font-size: 28rpx;
	color: #5d6b89;
	position: relative;
	flex-shrink: 0;
	margin: 0 25rpx;
	border-radius: 30rpx;
	transition: all 0.3s ease;
	line-height: 1.5;
}

.tab-item.active {
	color: #3a86ff;
	font-weight: bold;
	background-color: #f0f5ff;
}

.tab-item.active::after {
	display: none;
}

.content-container {
	flex: 1;
	width: 100%;
	margin-top: 0;
}

.tab-content {
	padding: 0;
}
</style>