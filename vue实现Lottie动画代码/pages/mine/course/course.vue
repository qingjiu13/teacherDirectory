<template>
	
<<<<<<< HEAD
</template>
=======
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
>>>>>>> 038c1d85f3b1578770934d1c9eab66727d102964
