<template>
	<view class="course-container">
		<view class="search-bar">
			<uni-search-bar placeholder="搜索课程" @confirm="searchCourse" />
		</view>
		
		<view class="filter-tabs">
			<uni-segmented-control :current="currentTab" :values="tabs" @clickItem="changeTab" style="box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1); border: 1rpx solid #eee; border-radius: 10rpx; background: linear-gradient(to right, #f6f7f9, #e3e9f2);" />
		</view>
		
		<scroll-view scroll-y class="course-list" refresher-enabled @refresherrefresh="onRefresh">
			<view class="course-card" v-for="(course, index) in filteredCourses" :key="index">				<view class="card-header">
					<image class="teacher-avatar" :src="course.avatar || '/static/image/default_avatar.png'" mode="aspectFill"></image>
					<view class="course-info">
						<text class="course-name">{{course.name}}</text>
						<view class="external-info">
							<uni-rate :value="course.rating" disabled size="14"></uni-rate>
							<text class="progress-text">{{course.progress}}%</text>
						</view>
						<text class="teacher">{{course.teacher}}</text>
					</view>
					<text class="course-status" :class="course.status">{{getStatusText(course.status)}}</text>
				</view>
				<view class="card-body">
					<view class="info-row">
						<text class="label">时间:</text>
						<text class="value">{{course.time}}</text>
					</view>
					<view class="info-row">
						<text class="label">评分:</text>
						<uni-rate :value="course.rating" disabled size="14"></uni-rate>
					</view>
					<view class="info-row">
						<text class="label">进度:</text>
						<progress class="progress" :percent="course.progress" :data-percent="course.progress" stroke-width="6" activeColor="#1890ff" />
					</view>
				</view>
				<view class="card-footer">
					<button class="detail-btn" @click="goToDetail(course.id)">查看详情</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';

// 移除生成头像的函数
// const generateAvatar = (name) => { ... }

// 修改课程数据中的头像路径
const courses = ref([
	{
		id: 2,
		name: '考研政治冲刺班',
		teacher: '李老师',
		time: '2023-10-15 至 2023-12-15',
		status: 'upcoming',
		// 修改头像路径
		avatar: '/static/image/default_avatar.png',
		rating: 4.8,
		progress: 0
	},
	{
		id: 3,
		name: '考研数学基础班',
		teacher: '王老师',
		time: '2023-09-01 至 2023-11-30',
		status: 'completed',
		avatar: '/static/image/default_avatar.png',
		rating: 4.5,
		progress: 100
	},
	{
		id: 4,
		name: '考研专业课辅导',
		teacher: '赵老师',
		time: '2023-11-01 至 2024-01-15',
		status: 'ongoing',
		avatar: '/static/image/teacher4.png',
		rating: 4.7,
		progress: 30
	},
	{
		id: 5,
		name: '考研复试指导',
		teacher: '钱老师',
		time: '2024-02-15 至 2024-03-31',
		status: 'upcoming',
		avatar: '/static/image/teacher5.png',
		rating: 4.9,
		progress: 0
	},
	// 新增课程数据
	{
		id: 6,
		name: '考研写作专项',
		teacher: '孙老师',
		time: '每周一、三 19:00-21:00',
		status: 'ongoing',
		avatar: '/static/image/default_avatar.png',
		rating: 4.6,
		progress: 45,
		details: {
			duration: '24课时',
			students: 128
		}
	},
	{
		id: 7,
		name: '考研英语强化班',
		teacher: '周老师',
		time: '每周二、四 19:00-21:00',
		status: 'ongoing',
		avatar: '/static/image/default_avatar.png',
		rating: 4.7,
		progress: 60
	},
	{
		id: 8,
		name: '考研专业课冲刺',
		teacher: '吴老师',
		time: '2024-01-10 至 2024-02-28',
		status: 'upcoming',
		avatar: '/static/image/default_avatar.png',
		rating: 4.9,
		progress: 0
	}
]);

const currentTab = ref(0);
const tabs = ['全部', '进行中', '即将开始', '已结束'];
const searchText = ref('');

// 根据tab筛选课程
const filteredCourses = computed(() => {
	let filtered = courses.value;
	
	// 根据tab筛选
	if (currentTab.value === 1) {
		filtered = filtered.filter(course => course.status === 'ongoing');
	} else if (currentTab.value === 2) {
		filtered = filtered.filter(course => course.status === 'upcoming');
	} else if (currentTab.value === 3) {
		filtered = filtered.filter(course => course.status === 'completed');
	}
	
	// 根据搜索文本筛选
	if (searchText.value) {
		filtered = filtered.filter(course => 
			course.name.includes(searchText.value) || 
			course.teacher.includes(searchText.value)
		);
	}
	
	return filtered;
});

// 获取状态文本
const getStatusText = (status) => {
	const statusMap = {
		ongoing: '进行中',
		upcoming: '即将开始',
		completed: '已结束'
	};
	return statusMap[status] || '';
};

// 搜索课程
const searchCourse = (e) => {
	searchText.value = e.value;
};

// 切换tab
const changeTab = (e) => {
	currentTab.value = e.currentIndex;
};



// 下拉刷新
const onRefresh = () => {
	setTimeout(() => {
		uni.stopPullDownRefresh();
	}, 1000);
};
</script>

<style lang="scss">
.course-container {
	padding: 20rpx;
	
	.search-bar {
		margin-bottom: 20rpx;
	}
	
	.filter-tabs {
		margin-bottom: 20rpx;
	}
	
	.course-list {
		height: calc(100vh - 220rpx);
		
		.course-card {
			background-color: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.2);
			border: 1rpx solid #1890ff;
			background: linear-gradient(to bottom, #f9fcff, #e6f4ff);
			
			.card-header {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				
				.teacher-avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
				
				.course-info {
					flex: 1;
					flex-direction: column;
					margin-left: 20rpx;
					
					.course-name {
						margin-bottom: 8rpx;
						font-size: 28rpx;
						font-weight: bold;
					}
					
					.external-info {
						display: flex;
						align-items: center;
						margin: 8rpx 0;
						
						.progress-text {
							margin-left: 15rpx;
							font-size: 24rpx;
							color: #1890ff;
						}
					}
					
					.teacher {
						font-size: 22rpx;
						color: #666;
					}
				}
				
				.course-status {
					font-size: 24rpx;
					padding: 5rpx 15rpx;
					border-radius: 20rpx;
					font-weight: 500;
					
					&.ongoing {
						background: linear-gradient(to right, #1890ff, #36cffd);
						color: #fff;
					}
					
					&.upcoming {
						background: linear-gradient(to right, #fa8c16, #ffc069);
						color: #fff;
					}
					
					&.completed {
						background: linear-gradient(to right, #52c41a, #73d13d);
						color: #fff;
					}
				}
			}
			
			.card-body {
				.info-row {
					display: flex;
					align-items: center;
					margin-bottom: 12rpx;
					
					.label {
						font-size: 26rpx;
						color: #666;
						margin-right: 15rpx;
						width: 100rpx;
					}
					
					.value {
						font-size: 26rpx;
						color: #333;
					}
					
					.progress {
						flex: 1;
					}
				}
			}
			
			.card-footer {
				.detail-btn {
					background: linear-gradient(to right, #1890ff, #36cffd);
					color: #fff;
					border-radius: 6rpx;
					font-size: 26rpx;
					border: none;
					height: 60rpx;
					line-height: 60rpx;
				}
			}
		}
	}
}
</style>