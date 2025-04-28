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
    <view v-if="showPopup" class="filter-mask" @click="onPopupClose">
          <!-- 学校筛选弹层 -->
    <view v-if="currentOption === 'school'" class="filter-popup">
      <view class="popup-header">
        <text class="popup-title">学校</text>
      </view>
      <view class="popup-content">
        <view class="form-row">
          <ChoiceSelected
            class="form-select"
            componentType="graduateSchool"
            :choiceIndex="formData.targetSchoolIndex"
            :choiceList="targetSchoolList"
            :defaultText="'请选择学校'"
            mode="search"
            searchPlaceholder="输入学校名称"
            @onChoiceClick="handleTargetSchoolSelect"
            @search-input="handleTargetSchoolSearch"
            @linkage-change="handleSchoolChange"
            :enablePagination="true"
            :pageSize="10"
            ref="targetSchoolDropdown"
          />
        </view>
        <!-- 底部按钮 -->
        <view class="popup-buttons">
          <button class="popup-button reset-button" @click="resetSchoolFilter">重置</button>
          <button class="popup-button confirm-button" @click="confirmSchoolFilter">确定</button>
        </view>
      </view>
    </view>

    <!-- 专业课筛选弹层 -->
    <view v-if="currentOption === 'professional'" class="filter-popup">
      <view class="popup-header">
        <text class="popup-title">专业课</text>
      </view>
      <view class="popup-content">
        <view class="form-row">
          <ChoiceSelected
            class="form-select"
            componentType="graduateMajor"
            :choiceIndex="formData.targetMajorIndex"
            :choiceList="targetMajorList"
            :parentValue="formData.targetSchool"
            :isLinkage="true"
            :defaultText="formData.targetSchool ? '请选择专业' : '请先选择学校'"
            mode="search"
            searchPlaceholder="输入专业名称"
            @onChoiceClick="handleTargetMajorSelect"
            @search-input="handleTargetMajorSearch"
            @reset-selection="resetMajorSelection"
            :enablePagination="true"
            :pageSize="10"
            ref="targetMajorDropdown"
          />
        </view>
        <!-- 底部按钮 -->
        <view class="popup-buttons">
          <button class="popup-button reset-button" @click="resetProfessionalFilter">重置</button>
          <button class="popup-button confirm-button" @click="confirmProfessionalFilter">确定</button>
        </view>
      </view>
    </view>

    <!-- 非专业课筛选弹层 -->
    <view v-if="currentOption === 'nonProfessional'" class="filter-popup">
      <view class="popup-header">
        <text class="popup-title">非专业课</text>
      </view>
      <view class="popup-content">
        <!-- 考研数学 -->
        <view class="form-row">
          <text class="filter-label">考研数学</text>
          <ChoiceSelected
            class="form-select"
            :choiceIndex="formData.mathIndex"
            :choiceList="mathOptions"
            defaultText="请选择考研数学"
            mode="select"
            @onChoiceClick="handleMathSelect"
          />
        </view>
        
        <!-- 考研英语 -->
        <view class="form-row">
          <text class="filter-label">考研英语</text>
          <ChoiceSelected
            class="form-select"
            :choiceIndex="formData.englishIndex"
            :choiceList="englishOptions"
            defaultText="请选择考研英语"
            mode="select"
            @onChoiceClick="handleEnglishSelect"
          />
        </view>
        
        <!-- 考研政治 -->
        <view class="form-row">
          <text class="filter-label">考研政治</text>
          <ChoiceSelected
            class="form-select"
            :choiceIndex="formData.politicsIndex"
            :choiceList="politicsOptions"
            defaultText="请选择考研政治"
            mode="select"
            @onChoiceClick="handlePoliticsSelect"
          />
        </view>
        
        <!-- 其他 -->
        <view class="form-row">
          <text class="filter-label">其他</text>
          <ChoiceSelected
            class="form-select"
            :choiceIndex="formData.otherIndex"
            :choiceList="otherOptions"
            defaultText="请选择其他考试"
            mode="select"
            @onChoiceClick="handleOtherSelect"
          />
        </view>
        
        <!-- 底部按钮 -->
        <view class="popup-buttons">
          <button class="popup-button reset-button" @click="resetNonProfessionalFilter">重置</button>
          <button class="popup-button confirm-button" @click="confirmNonProfessionalFilter">确定</button>
        </view>
      </view>
    </view>

    <!-- 排序方式筛选弹层 -->
    <view v-if="currentOption === 'sort'" class="filter-popup">
      <view class="popup-header">
        <text class="popup-title">排序方式</text>
      </view>
      <view class="popup-content">
        <view class="form-row">
          <ChoiceSelected
            class="form-select"
            :choiceIndex="formData.sortIndex"
            :choiceList="sortOptions"
            defaultText="请选择排序方式"
            mode="select"
            @onChoiceClick="handleSortSelect"
          />
        </view>
        
        <!-- 底部按钮 -->
        <view class="popup-buttons">
          <button class="popup-button reset-button" @click="resetSortFilter">重置</button>
          <button class="popup-button confirm-button" @click="confirmSortFilter">确定</button>
          </view>
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

<script>
import { ref, reactive, onMounted, nextTick } from 'vue'
import store from '../../store'
import { Navigator } from '@/router/Router.js'
import ChoiceSelected from '../../components/combobox/combobox'
import GraduateStore from '../../components/combobox/graduate_school_major.js'

// 定义 searchText
const searchText = ref('')

// 选项列表
const options = [
  { key: 'school', label: '学校' },
  { key: 'professional', label: '专业课' },
  { key: 'nonProfessional', label: '非专业课' },
  { key: 'sort', label: '排序方式' }
]

// 当前激活的选项
const currentOption = ref('')
// 弹层显示控制
const showPopup = ref(false)

// 加载状态
const isLoading = ref(false)
// 老师列表数据
const matchTeachers = ref([])

// 表单数据
const formData = reactive({
  targetSchoolIndex: -1,
  targetMajorIndex: -1,
  targetSchool: '',
  targetMajor: '',
  mathIndex: -1,
  englishIndex: -1,
  politicsIndex: -1,
  otherIndex: -1,
  sortIndex: -1,
})

// 学校和专业列表数据
const targetSchoolList = ref([])
const targetMajorList = ref([])
const graduateStore = ref(null)

// 下拉选项列表
const mathOptions = ref(['数学一', '数学二', '数学三'])
const englishOptions = ref(['英语一', '英语二'])
const politicsOptions = ref(['政治必修', '政治选修'])
const otherOptions = ref(['经济学', '管理学', '教育学', '历史学'])
const sortOptions = ref(['综合评分从高到低', '价格从低到高', '价格从高到低', '最新发布'])

// 筛选记录
const filterState = reactive({
  school: '',
  professional: '',
  nonProfessional: {
    math: '',
    english: '',
    politics: '',
    other: ''
  },
  sort: ''
})

const getPopupTitle = () => {
  const option = options.find(o => o.key === currentOption.value)
  return option ? option.label : ''
}

const isActive = key => {
  if (key === 'school') return !!filterState.school
  if (key === 'professional') return !!filterState.professional
  if (key === 'nonProfessional') {
    const nonProf = filterState.nonProfessional
    return !!(nonProf.math || nonProf.english || nonProf.politics || nonProf.other)
  }
  if (key === 'sort') return !!filterState.sort
  return currentOption.value === key
}

const onOptionClick = key => {
  if (currentOption.value === key && showPopup.value) {
    showPopup.value = false
    currentOption.value = ''
    return
  }
  currentOption.value = key
  showPopup.value = true
}

const onPopupClose = () => {
  console.log('onPopupClose called, currentOption:', currentOption.value)
  showPopup.value = false
  currentOption.value = ''
  console.log('After close - showPopup:', showPopup.value, 'currentOption:', currentOption.value)
  nextTick(() => {
    console.log('After nextTick - showPopup:', showPopup.value, 'currentOption:', currentOption.value)
  })
}

const initGraduateData = () => {
  try {
    graduateStore.value = JSON.parse(JSON.stringify(GraduateStore.state))
    GraduateStore.mutations.initSchoolFuse(graduateStore.value)
    const schools = Object.keys(graduateStore.value.schools).slice(0, 50)
    targetSchoolList.value = schools
    console.log('初始化研究生学校专业数据成功')
  } catch (error) {
    console.error('初始化研究生学校专业数据失败:', error)
    targetSchoolList.value = ["北京大学", "清华大学", "复旦大学"]
  }
}

const handleTargetSchoolSelect = (index, school) => {
  formData.targetSchoolIndex = index
  formData.targetSchool = school
  filterState.school = school
  handleSchoolChange(school)
}

const handleSchoolChange = (school) => {
  if (!school) {
    resetMajorSelection()
    return
  }
  GraduateStore.actions.selectSchool({
    commit: (mutation, payload) => {
      GraduateStore.mutations[mutation](graduateStore.value, payload)
    }
  }, school)
  if (graduateStore.value.schools[school]) {
    targetMajorList.value = graduateStore.value.schools[school].slice(0, 20)
  } else {
    resetMajorSelection()
  }
}

const resetMajorSelection = () => {
  formData.targetMajorIndex = -1
  formData.targetMajor = ''
}

const handleTargetMajorSelect = (index, major) => {
  formData.targetMajorIndex = index
  formData.targetMajor = major
  filterState.professional = major
  if (major) {
    formData.mathIndex = -1
    formData.englishIndex = -1
    formData.politicsIndex = -1
    formData.otherIndex = -1
    filterState.nonProfessional = {
      math: '',
      english: '',
      politics: '',
      other: ''
    }
  }
  applyFilters()
}

const handleTargetSchoolSearch = (keyword) => {
  if (!keyword || keyword.trim() === '') {
    const allSchools = Object.keys(graduateStore.value.schools).slice(0, 50)
    targetSchoolList.value = allSchools
    return
  }
  GraduateStore.mutations.setSchoolKeyword(graduateStore.value, keyword)
  const filteredSchools = GraduateStore.getters.filteredSchoolList(graduateStore.value)
  targetSchoolList.value = filteredSchools
}

const handleTargetMajorSearch = (keyword) => {
  if (!graduateStore.value.selectedSchool) {
    return
  }
  if (!keyword || keyword.trim() === '') {
    const allMajors = graduateStore.value.schools[graduateStore.value.selectedSchool] || []
    targetMajorList.value = allMajors.slice(0, 20)
    return
  }
  GraduateStore.mutations.setMajorKeyword(graduateStore.value, keyword)
  const filteredMajors = GraduateStore.getters.filteredMajorList(graduateStore.value)
  targetMajorList.value = filteredMajors
}

const handleMathSelect = (index) => {
  formData.mathIndex = index
  filterState.nonProfessional.math = index >= 0 ? mathOptions.value[index] : ''
  handleNonProfessionalSelect()
  applyFilters()
}

const handleEnglishSelect = (index) => {
  formData.englishIndex = index
  filterState.nonProfessional.english = index >= 0 ? englishOptions.value[index] : ''
  handleNonProfessionalSelect()
  applyFilters()
}

const handlePoliticsSelect = (index) => {
  formData.politicsIndex = index
  filterState.nonProfessional.politics = index >= 0 ? politicsOptions.value[index] : ''
  handleNonProfessionalSelect()
  applyFilters()
}

const handleOtherSelect = (index) => {
  formData.otherIndex = index
  filterState.nonProfessional.other = index >= 0 ? otherOptions.value[index] : ''
  handleNonProfessionalSelect()
  applyFilters()
}

const handleNonProfessionalSelect = () => {
  if (formData.mathIndex >= 0 || formData.englishIndex >= 0 || 
      formData.politicsIndex >= 0 || formData.otherIndex >= 0) {
    formData.targetMajorIndex = -1
    formData.targetMajor = ''
    filterState.professional = ''
  }
}

const handleSortSelect = (index) => {
  formData.sortIndex = index
  filterState.sort = index >= 0 ? sortOptions.value[index] : ''
  applyFilters()
}

const resetSchoolFilter = () => {
  formData.targetSchoolIndex = -1
  formData.targetSchool = ''
  filterState.school = ''
  applyFilters()
}

const resetProfessionalFilter = () => {
  formData.targetMajorIndex = -1
  formData.targetMajor = ''
  filterState.professional = ''
  applyFilters()
}

const resetNonProfessionalFilter = () => {
  formData.mathIndex = -1
  formData.englishIndex = -1
  formData.politicsIndex = -1
  formData.otherIndex = -1
  filterState.nonProfessional = {
    math: '',
    english: '',
    politics: '',
    other: ''
  }
  applyFilters()
}

const resetSortFilter = () => {
  formData.sortIndex = -1
  filterState.sort = ''
  applyFilters()
}

const confirmSchoolFilter = () => {
  console.log('confirmSchoolFilter called')
  onPopupClose()
}

const confirmProfessionalFilter = () => {
  console.log('confirmProfessionalFilter called')
  onPopupClose()
}

const confirmNonProfessionalFilter = () => {
  console.log('confirmNonProfessionalFilter called')
  onPopupClose()
}

const confirmSortFilter = () => {
  console.log('confirmSortFilter called')
  onPopupClose()
}

const applyFilters = () => {
  isLoading.value = true
  setTimeout(() => {
    let filteredTeachers = []
    if (store.state.user && store.state.user.match) {
      filteredTeachers = store.state.user.match.matchList || []
    }
    matchTeachers.value = filteredTeachers
    isLoading.value = false
  }, 500)
}

const viewTeacherDetail = (teacherId) => {
  Navigator.toTeacher(teacherId)
}

const handleCommunicate = (teacherId) => {
  Navigator.toChat(teacherId)
}

const loadMoreTeachers = () => {
  if (isLoading.value) return
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

onMounted(() => {
  initGraduateData()
  if (store.state.user && store.state.user.match) {
    matchTeachers.value = store.state.user.match.matchList || []
  }
})
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

.select-item.active .arrow-icon {
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
  padding: 15rpx 30rpx;
}

/* 顶部标题栏 */
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

/* 筛选标签 */
.filter-label {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
}

/* 底部按钮容器 */
.popup-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 30rpx 0;
  margin-top: auto;
  border-top: 1px solid #f0f0f0;
}

/* 底部按钮样式 */
.popup-button {
  width: 45%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}

/* 重置按钮样式 */
.reset-button {
  background-color: #f5f5f5;
  color: #666;
  border: none;
}

/* 确定按钮样式 */
.confirm-button {
  background-color: #007AFF;
  color: #fff;
  border: none;
}

/* 表单行样式 */
.form-row {
  margin-bottom: 25rpx;
  width: 100%;
}
</style>
