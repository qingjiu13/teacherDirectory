<template>
  <view class="page">
    <!-- 搜索框 -->
    <view class="search-wrapper">
      <input
        v-model="searchText"
        placeholder="请输入搜索内容"
        class="search-input"
      />
    </view>

    <!-- 选项容器 -->
    <view class="container-select">
      <view
        v-for="item in options"
        :key="item.key"
        class="select-item"
        :class="{
          active: isActive(item.key)
        }"
        @click="onOptionClick(item.key)">
        <text class="label-text">{{ item.label }}</text>
        <image
          :src="'/static/image/arrow/arrow_down.svg'"
          class="arrow-icon"
          :class="{'arrow-icon-rotate': currentOption === item.key}"
        />
      </view>
    </view>

    <!-- 筛选弹层 -->
    <view v-if="showPopup" class="filter-mask" @click="onPopupClose"></view>
    <view v-if="showPopup" class="filter-popup">
      <view class="popup-header">
        <text class="popup-title">{{ getPopupTitle() }}</text>
        <text class="popup-close" @click="onPopupClose">完成</text>
      </view>
      <view class="popup-content">
        <view class="popup-complete-text" v-if="changedOptions[currentOption]">
          <text class="complete-text">完成</text>
        </view>
      </view>
    </view>

    <!-- 内容区 -->
    <view class="container-match">
      <!-- 老师卡片列表 -->
      <scroll-view class="card-list" scroll-y="true" id="step2" @scrolltolower="loadMoreTeachers">
        <view class="teacher-card" v-for="(teacher, index) in matchTeachers" :key="teacher.id || index">
          <view class="card-left">
            <image class="teacher-avatar" :src="teacher.avatar || '/static/image/tab-bar/default_avatar.png'" mode="aspectFill" @tap="viewTeacherDetail(teacher.id)"></image>
          </view>
          <view class="card-middle">
            <view class="card-middle-top">
              <view class="teacher-name">{{ teacher.name }}</view>
              <view class="teacher-info">{{ teacher.school }} | {{ teacher.major }} | {{ teacher.teacherScore }}</view>
            </view>
            <view class="teacher-tags">
              <view class="tag" v-if="teacher.certificate">已认证</view>
              <view class="tag" v-else>未认证</view>
            </view>
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
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Navigator } from '@/router/Router.js'

// 实例化store
const store = useStore()

// 选项列表
const options = [
  { key: 'school', label: '学校' },
  { key: 'professional', label: '专业课' },
  { key: 'nonProfessional', label: '非专业课' },
  { key: 'filter', label: '筛选' }
]

// 当前激活的选项
const currentOption = ref('')
// 弹层显示控制
const showPopup = ref(false)
// 记录已修改的选项
const changedOptions = reactive({})
// 加载状态
const isLoading = ref(false)
// 老师列表数据
const matchTeachers = ref([])

// 选择数据
const selectedSchool = ref('')
const selectedProfessional = ref('')
const selectedNonProfessional = ref('')
const filterOptions = reactive({
  certified: null
})

/**
 * 获取弹出层标题
 * @returns {String} 当前选项的标题
 */
const getPopupTitle = () => {
  const option = options.find(o => o.key === currentOption.value)
  return option ? option.label : ''
}

// 判断是否高亮
const isActive = key => {
  // 专业课和非专业课互斥
  if (key === 'professional' && changedOptions.nonProfessional) return false
  if (key === 'nonProfessional' && changedOptions.professional) return false
  // 若已修改，则保持高亮
  if (changedOptions[key]) return true
  // 若当前正激活
  return currentOption.value === key
}

// 点击选项
const onOptionClick = key => {
  // 专业/非专业互斥：若其中一个已选且已修改，不可点击另一个
  if ((key === 'professional' && changedOptions.nonProfessional) ||
      (key === 'nonProfessional' && changedOptions.professional)) {
    return
  }
  
  // 如果点击的是已经打开的选项，则关闭弹窗
  if (currentOption.value === key && showPopup.value) {
    showPopup.value = false
    currentOption.value = ''
    return
  }
  
  currentOption.value = key
  showPopup.value = true
  
  // 标记该选项已被选择（模拟行为）
  if (!changedOptions[key]) {
    changedOptions[key] = true
  }
}

// 弹层关闭
const onPopupClose = () => {
  showPopup.value = false
  
  // 若此选项未修改，取消激活
  if (!changedOptions[currentOption.value]) {
    currentOption.value = ''
  }
}

/**
 * 查看老师详情
 * @param {String} teacherId - 老师ID
 */
const viewTeacherDetail = (teacherId) => {
  Navigator.toTeacher(teacherId)
}

/**
 * 处理沟通按钮点击
 * @param {String} teacherId - 老师ID
 */
const handleCommunicate = (teacherId) => {
  Navigator.toChat(teacherId)
}

/**
 * 加载更多老师数据
 */
const loadMoreTeachers = () => {
  if (isLoading.value) return
  isLoading.value = true
  
  // 这里只是模拟加载效果，后续会由实际接口替代
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

// 在组件挂载时获取数据
onMounted(() => {
  // 从store获取教师列表数据
  if (store.state.user && store.state.user.match) {
    matchTeachers.value = store.state.user.match.matchList || []
  }
})

// 专业课和非专业课选择后互斥
const onProfessionalSelected = (majorName) => {
  if (selectedProfessional.value !== majorName) {
    selectedProfessional.value = majorName
    selectedNonProfessional.value = '' // 修改了才挤掉非专业课
  }
}

const onNonProfessionalSelected = (nonMajorName) => {
  if (selectedNonProfessional.value !== nonMajorName) {
    selectedNonProfessional.value = nonMajorName
    selectedProfessional.value = '' // 修改了才挤掉专业课
  }
}
</script>

<style scoped>
.searchText {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.search-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.search-wrapper {
  padding: 10px;
  background: #fff;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.container-select {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  background: #fff;
  width: 100%;
  flex-wrap: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
  overflow-x: hidden;
}

.select-item {
  flex: 1;
  min-width: 0;
  padding: 12px 5px;
  position: relative;
  white-space: nowrap;
  display: flex;
  flex-direction: row; /* 水平排列 */
  align-items: center;
  justify-content: center;
}

.label-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  margin-bottom: 2px;
}

.select-item.active .label-text {
  color: #007AFF;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.arrow-icon-rotate {
  transform: rotate(180deg);
}

.select-item.active .arrow-icon {
  color: #007AFF;
}

.container-match {
  flex: 1;
  background: #f5f5f5;
  overflow-y: auto;
}

.popup-content {
  background-color: #fff;
  border-radius: 16px 16px 0 0;
  height: 70vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* 顶部标题栏 */
.popup-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: center;
  position: relative;
}

.popup-close {
  color: #007AFF;
  font-size: 14px;
  position: absolute;
  right: 16px;
  top: 14px;
}

/* 状态提示栏 */
.popup-status-bar {
  text-align: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.popup-status {
  font-size: 14px;
  color: #333;
}

/* 选项列表区域 */
.popup-scroll {
  flex: 1;
  height: calc(100% - 80px);
}

/* 列表项样式 */
.popup-item {
  width: 100%;
  padding: 15px 16px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 15px;
  color: #333;
  box-sizing: border-box;
}

.popup-item-active {
  color: #007AFF;
}

.filter-section {
  padding: 10px 16px;
}

.filter-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
}

.filter-option {
  padding: 8px 12px;
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
}

.filter-option-active {
  background-color: #e6f2ff;
  color: #007AFF;
  border: 1px solid #007AFF;
}

/* 老师卡片样式 */
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

.teacher-tags {
  display: flex;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  color: #1E90FF;
  background-color: rgba(30, 144, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  /* 新增以下属性 */
  display: inline-flex;
  justify-content: center;
  white-space: nowrap;
  width: fit-content;
  /* 或者可以使用 min-width: fit-content; */
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
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.loading-more {
  text-align: center;
  padding: 15px 0;
  color: #999;
}

/* 弹出层蒙版 */
.filter-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 998;
}

/* 弹出层容器 */
.filter-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 999;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* 弹出层标题栏 */
.popup-header {
  position: relative;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f5f5f5;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.popup-close {
  position: absolute;
  right: 30rpx;
  color: #007AFF;
  font-size: 28rpx;
}

/* 弹出层内容 */
.popup-content {
  padding: 20rpx 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.popup-complete-text {
  width: 100%;
  text-align: right;
  padding-right: 30rpx;
}

.complete-text {
  color: #007AFF;
  font-size: 28rpx;
}
</style>
