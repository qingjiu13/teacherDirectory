<template>
	<view class="container" @click="onPageClick">
		<!-- 筛选区域 -->
		<view class="filter-section" @click.stop>
			<!-- 三级筛选：学校、专业和考研科目 -->
			<cascade-container 
				ref="cascadeFilter"
				@apply-filter="onFilterApply" />
			
			<!-- 排序筛选和筛选按钮 -->
			<view class="filter-row">
				<view class="choice-wrapper flex-1">
					<choice-selected 
						:defaultText="'排序筛选'" 
						:choiceIndex="sortIndex" 
						:choiceList="sortList"
						@onChoiceClick="onSortClick">
					</choice-selected>
				</view>
				
				<view class="filter-btn-wrapper">
					<button class="filter-btn" @click="applyFilter">筛选</button>
				</view>
			</view>
		</view>
		
		<!-- 老师卡片列表 -->
		<scroll-view class="card-list" scroll-y="true" id="step2" @scrolltolower="loadMore">
			<view class="teacher-card" v-for="(teacher, index) in matchTeachers" :key="index">
				<view class="card-left">
					<image class="teacher-avatar" :src="teacher.avatar || '/static/image/tab-bar/default_avatar.png'" mode="aspectFill" @tap="viewTeacherDetail(teacher.id)"></image>
				</view>
				<view class="card-middle">
					<view class="card-middle-top">
						<view class="teacher-name">{{ teacher.name }}</view>
						<view class="teacher-info">{{ teacher.school }} | {{ teacher.major }} | {{ teacher.teacherScore }}</view>
					</view>
					<view class="one-on-one-price">一对一辅导: {{ getOneOnOnePrice(teacher) }}</view>
				</view>
				<view class="card-right">
					<button class="communicate-btn" @click.stop="handleCommunicate(teacher.id)">马上沟通</button>
				</view>
			</view>
			
			<view class="empty-state" v-if="matchTeachers.length === 0 && !isLoading">
				<text>暂无匹配的老师信息</text>
			</view>
			
			<!-- 加载提示 -->
			<view class="loading-more" v-if="isLoading">
				<text>加载中...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import choiceSelected from '../../components/combobox/combobox'
	import CascadeContainer from '../../components/cascade-container/cascade-container'
	import { Navigator } from '@/router/Router.js'
	import store from '@/store/index.js'
	import { mapState, mapGetters } from 'vuex'
	
	export default {
		components: {
			choiceSelected,
			CascadeContainer
		},
		data() {
			return {
				// 筛选相关数据
				sortList: [
					{
						choiceItemContent: '综合排序',
						choiceItemValue: 'comprehensive'
					},
					{
						choiceItemContent: '评分最高',
						choiceItemValue: 'score_desc'
					},
					{
						choiceItemContent: '价格最低',
						choiceItemValue: 'price_asc'
					},
					{
						choiceItemContent: '价格最高',
						choiceItemValue: 'price_desc'
					}
				],
				// 排序筛选
				tempSelectedSort: '综合排序',
				// 下拉框索引
				sortIndex: -1,
				// 页面状态
				isLoading: false,
			}
		},
		computed: {
			/**
			 * 使用vuex的getter获取筛选后的老师列表
			 * @returns {Array} 筛选后的老师列表
			 */
			...mapGetters('match', ['filteredMatchList', 'teacherInfo']),
			
			/**
			 * @description 获取页面展示的老师列表
			 * @returns {Array} 要展示的老师列表
			 */
			matchTeachers() {
				return this.filteredMatchList || [];
			}
		},
		onLoad() {
			console.log('匹配页面已加载');
			// 初始化页面数据
			this.initPage();
		},
		methods: {
			/**
			 * @description 初始化页面
			 */
			async initPage() {
				// 每次页面初始化时都重新加载数据
				console.log('初始化页面 - 开始加载数据');
				await this.loadData(true);
			},
			
			/**
			 * @description 获取老师的一对一辅导服务价格
			 * @param {Object} teacher - 老师对象
			 * @returns {String} 格式化后的价格，如果没有一对一辅导服务则返回"暂无价格"
			 */
			getOneOnOnePrice(teacher) {
				if (!teacher || !teacher.service || teacher.service.length === 0) {
					return "暂无一对一辅导价格";
				}
				
				// 查找类型为"一对一辅导"的服务
				const oneOnOneService = teacher.service.find(s => s.type === '一对一辅导');
				
				if (oneOnOneService && oneOnOneService.price) {
					return `¥${oneOnOneService.price}/小时`;
				} else {
					return "暂无价格";
				}
			},
			
			/**
			 * @description 处理筛选器应用事件
			 * @param {Object} filters - 筛选条件对象
			 */
			onFilterApply(filters) {
				console.log('应用筛选条件:', filters);
				// 设置临时选择变量
				this.tempSelectedSchool = filters.school;
				this.tempSelectedMajor = filters.major;
				this.tempSelectedSubject = filters.subject;
				
				// 应用筛选
				this.applyFilter();
			},
			
			/**
			 * @description 加载数据
			 * @param {Boolean} forceRefresh - 是否强制刷新数据
			 */
			async loadData(forceRefresh = false) {
				try {
					this.isLoading = true;
					// 显示加载提示
					uni.showLoading({
						title: '加载中...'
					});
					
					// 从级联选择器中获取筛选值
					const cascadeValues = this.$refs.cascadeFilter ? 
						this.$refs.cascadeFilter.getSelectedValues() : 
						{ school: '', major: '', subject: '' };
					
					// 构建筛选条件对象
					const filters = {
						school: cascadeValues.school,
						major: cascadeValues.major,
						subject: cascadeValues.subject,
						sort: this.tempSelectedSort
					};
					
					// 如果强制刷新或者有筛选条件，则重新获取数据
					if (forceRefresh || filters.school || filters.major || filters.subject || filters.sort !== '综合排序') {
						// 调用Vuex action获取数据
						await store.dispatch('match/getFilteredMatchList', filters);
					} else if (this.matchTeachers && this.matchTeachers.length > 0) {
						// 如果有缓存数据且没有筛选条件，则使用缓存数据
						console.log('使用已缓存的数据');
					} else {
						// 没有缓存数据，也需要获取
						await store.dispatch('match/getFilteredMatchList', filters);
					}
				} catch (error) {
					console.error('加载数据失败:', error);
					// 显示错误信息
					uni.showToast({
						title: error.message || '加载失败，请重试',
						icon: 'none'
					});
				} finally {
					this.isLoading = false;
					uni.hideLoading();
				}
			},
			
			/**
			 * @description 加载更多数据
			 */
			async loadMore() {
				// 滚动到底部时加载更多数据
				console.log('加载更多数据');
				// 在实际应用中，这里应该触发新的API请求，加载下一页数据
			},
			
			// 页面点击事件
			onPageClick() {
				// 关闭所有下拉框
				// 1. 关闭排序选择下拉框
				let comboboxComponents = this.$children.filter(child => child.$options.name === 'ChoiceSelected');
				comboboxComponents.forEach(component => {
					if (component.closeDropdown) {
						component.closeDropdown();
					}
				});
				
				// 2. 关闭级联选择器下拉框
				if (this.$refs.cascadeFilter) {
					const cascadeSelectors = this.$refs.cascadeFilter.$children.filter(child => 
						child.$options.name === 'CascadeSelector'
					);
					cascadeSelectors.forEach(selector => {
						if (selector.closeDropdown) {
							selector.closeDropdown();
						}
					});
				}
			},
			
			// 应用筛选
			async applyFilter() {
				// 重新加载数据，强制刷新
				await this.loadData(true);
			},
			
			// 排序下拉框选择处理
			onSortClick(position) {
				this.sortIndex = position;
				// 只更新临时选择，不立即应用
				this.tempSelectedSort = this.sortList[position].choiceItemContent;
			},
			
			/**
			 * @description 查看老师详情
			 * @param {String} teacherId - 老师ID
			 */
			async viewTeacherDetail(teacherId) {
				try {
					// 显示加载提示
					uni.showLoading({
						title: '加载中...'
					});
					
					// 首先尝试从现有列表中获取老师基本信息
					const teacherExists = this.teacherInfo(teacherId);
					
					if (teacherExists) {
						// 如果老师已存在于列表中，则直接获取ID并跳转
						Navigator.toTeacher(teacherId);
					} else {
						// 如果老师不在列表中，则需要先获取信息
						await store.dispatch('match/getTeacherById', teacherId);
						Navigator.toTeacher(teacherId);
					}
				} catch (error) {
					console.error('获取老师详情失败:', error);
					// 显示来自后端的错误信息
					uni.showToast({
						title: error.message || '加载失败，请重试',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},
			
			/**
			 * @description 处理沟通按钮点击
			 * @param {String} teacherId - 老师ID
			 */
			handleCommunicate(teacherId) {
				// 处理沟通按钮点击事件，可以直接导航到聊天页面
				Navigator.toChat(teacherId);
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #F5F9FC;
		position: relative;
		overflow: hidden;
		width: 100%;
	}
	
	.filter-section {
		display: flex;
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
		border-radius: 15px;
		margin: 15px 10px;
		margin-top: 20px;
		width: auto;
	}
	
	.filter-row {
		display: flex;
		flex-direction: row;
		width: 100%;
		margin-bottom: 10px;
	}
	
	.filter-row:last-child {
		margin-bottom: 0;
	}
	
	.choice-wrapper {
		flex: 1;
		margin: 0 4px;
		min-width: 90px;
	}
	
	.flex-1 {
		flex: 1;
	}
	
	.card-list {
		flex: 1;
		padding: 10px 15px;
		position: relative;
		z-index: 1;
	}
	
	.teacher-card {
		display: flex;
		flex-direction: row;
		background-color: #ffffff;
		border-radius: 16px;
		padding: 18px;
		margin-bottom: 15px;
		box-shadow: 0 4px 12px rgba(30, 144, 255, 0.1);
		position: relative;
		min-height: 110px;
	}
	
	.card-left {
		margin-right: 15px;
		align-self: flex-start;
	}
	
	.teacher-avatar {
		width: 70px;
		height: 70px;
		border-radius: 35px;
		background-color: #f5f5f5;
	}
	
	.card-middle {
		flex: 1;
		padding-right: 65px;
		display: flex;
		flex-direction: column;
		min-height: 70px;
		justify-content: space-between;
		width: calc(100% - 85px);
		box-sizing: border-box;
	}
	
	.card-middle-top {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	
	.teacher-name {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 6px;
		color: #333333;
	}
	
	.teacher-info {
		font-size: 14px;
		color: #666666;
		margin-bottom: 12px;
	}
	
	.one-on-one-price {
		font-size: 14px;
		color: #FF6B00;
		font-weight: 500;
		margin-top: auto;
	}
	
	.card-right {
		position: absolute;
		top: 18px;
		right: 18px;
		z-index: 2;
	}
	
	.communicate-btn {
		background-color: #1E90FF;
		color: #ffffff;
		font-size: 14px;
		padding: 6px 12px;
		border-radius: 20px;
		border: none;
		font-weight: 500;
		line-height: 1.2;
		min-width: 80px;
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 200px;
		color: #999999;
		font-size: 16px;
	}
	
	.loading-more {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60px;
		color: #999999;
		font-size: 14px;
	}
	
	.filter-btn-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
		width: 100px;
	}
	
	.filter-btn {
		background-color: #1E90FF;
		color: #ffffff;
		font-size: 14px;
		padding: 0 15px;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		border: none;
		font-weight: 500;
		width: 100%;
		text-align: center;
		box-shadow: 0 2px 6px rgba(30, 144, 255, 0.2);
	}
</style>
