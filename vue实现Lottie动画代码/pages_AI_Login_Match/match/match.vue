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
  <Header :title="'精准匹配'" @back="handleBack" />
  <view class="page">
    <!-- 搜索框 -->
    <view class="search-wrapper">
      <view class="search-container">
        <input
          v-model="searchText"
          placeholder="请输入搜索内容"
          class="search-input"
          @input="onSearchInput"
        />
        <!-- <view v-if="searchText" class="search-clear-btn" @click="clearSearch">
          <text class="clear-icon">×</text>
        </view> -->
      </view>
    </view>

    <!-- 选项容器 -->
    <view class="container-select">
      <view
        v-for="item in options"
        :key="item.key"
        class="select-item"
        :class="{active: isActive(item.key)}"
        @click="onOptionClick(item.key)">
        <view class="select-item-content" :class="{active: isActive(item.key)}">
          <text class="label-text" :class="{active: isActive(item.key)}">{{ item.label }}</text>
          <text v-if="filterSummary[item.key]" class="selected-text">{{ filterSummary[item.key] }}</text>
        </view>
        <image
          :src="'/static/image/arrow/arrow_down.svg'"
          class="arrow-icon"
          :class="{'arrow-icon-rotate': currentOption === item.key}"
        />
      </view>
    </view>

    <!-- 筛选弹层 -->
    <view v-if="showPopup" class="filter-mask" @click.stop="onPopupClose">

      <!-- 学校筛选弹层 -->
      <view 
        v-if="currentOption === 'school'" 
        class="filter-popup"
        @click.stop
      >
        <view class="popup-header">
          <text class="popup-title">学校</text>
        </view>
        <view class="popup-content">
          <view class="form-row">
            <view class="input-wrapper">
              <input
                v-model="schoolInput"
                placeholder="请输入学校名称"
                class="search-input"
                @input="onSchoolInput"
                @click.stop
              />
              <view v-if="schoolInput" class="clear-icon" @click.stop="resetSchoolFilter">×</view>
            </view>
          </view>
          <view class="scroll-container">
            <scroll-view class="result-list" scroll-y="true" @scrolltolower="loadMoreSchools">
              <view
                v-for="(school, idx) in schoolOptions"
                :key="school.id"
                class="result-item"
                :class="{active: school.id === selectedSchoolId}"
                @click="selectSchoolTemp(school)"
              >
                {{ school.name }}
              </view>
              <view v-if="schoolLoading" class="loading-item">加载中...</view>
            </scroll-view>
          </view>
          <view class="save-button-container">
            <button class="save-button" @click.stop="confirmSchoolFilter">
              <image class="save-button-image" src="../static/match/submit.png" mode="aspectFill" alt="确定图标"></image>
              <text class="save-button-text">确定</text>
            </button>
          </view>
        </view>
      </view>
  
      <!-- 专业课筛选弹层 -->
      <view 
        v-if="currentOption === 'professional'" 
        class="filter-popup"
        @click.stop
      >
        <view class="popup-header">
          <text class="popup-title">专业课</text>
        </view>
        <view class="popup-content">
          <view class="form-row">
            <view class="input-wrapper">
              <input
                v-model="majorInput"
                :placeholder="store.getters['user/schoolMajorRequest/selectedGraduateSchool'].id ? '请输入专业名称' : '请先选择学校'"
                class="search-input"
                :disabled="!store.getters['user/schoolMajorRequest/selectedGraduateSchool'].id"
                @input="onMajorInput"
                @click.stop
              />
              <view v-if="majorInput" class="clear-icon" @click.stop="resetProfessionalFilter">×</view>
            </view>
          </view>
          <view class="scroll-container">
            <scroll-view class="result-list" scroll-y="true">
              <view
                v-for="(major, idx) in majorOptions"
                :key="major.id"
                class="result-item"
                :class="{active: major.id === selectedMajorId}"
                @click="selectMajorTemp(major)"
              >
                {{ major.name }}
              </view>
              <view v-if="majorLoading" class="loading-item">加载中...</view>
            </scroll-view>
          </view>
          <view class="save-button-container">
            <button class="save-button" @click.stop="confirmProfessionalFilter">
              <image class="save-button-image" src="../static/match/submit.png" mode="aspectFill" alt="确定图标"></image>
              <text class="save-button-text">确定</text>
            </button>
          </view>
        </view>
      </view>
  
      <!-- 非专业课筛选弹层 -->
      <view 
        v-if="currentOption === 'nonProfessional'" 
        class="filter-popup non-professional-popup" 
        @click.stop
      >
        <view class="popup-header">
          <text class="popup-title">非专业课</text>
        </view>
        <view class="popup-content">
          <!-- 水平排列四个选项 -->
          <view class="nonpro-tabs">
            <view
              v-for="tab in nonProTabs"
              :key="tab.key"
              :class="['tab-item', activeNonProTab === tab.key ? 'active' : '']"
              @click.stop="selectNonProTab(tab.key)"
            >
              {{ tab.label }}
            </view>
          </view>

          <!-- 选中的内容区域 -->
          <view class="filter-section">
              <text class="filter-label">{{ tabLabelMap[activeNonProTab] }}</text>
              <view class="option-buttons">
                <view 
                  v-for="(option, index) in nonProOptions" 
                  :key="option.id"
                  class="option-button"
                  :class="{'option-button-active': option.id === selectedNonProId}"
                  @click.stop="selectNonProOption(option)"
                >
                  {{ option.name }}
                </view>
              </view>
          </view>
          
          <view class="save-button-container">
            <button class="save-button" @click.stop="confirmNonProfessionalFilter">
              <image class="save-button-image" src="../static/match/submit.png" mode="aspectFill" alt="确定图标"></image>
              <text class="save-button-text">确定</text>
            </button>
          </view>
        </view>
      </view>
  
      <!-- 排序方式筛选弹层 -->
      <view 
        v-if="currentOption === 'sort'" 
        class="filter-popup sort-popup"
        @click.stop
      >
        <view class="popup-header">
          <text class="popup-title">排序方式</text>
        </view>
        <view class="popup-content">
          <view class="filter-section">
            <text class="filter-label">选择排序方式</text>
            <view class="option-buttons">
              <view 
                v-for="(option, index) in sortOptions" 
                :key="option.id"
                class="option-button"
                :class="{'option-button-active': option.id === selectedSortId}"
                @click.stop="selectSortOption(option)"
              >
                {{ option.name }}
              </view>
            </view>
          </view>
          
          <view class="save-button-container">
            <button class="save-button" @click.stop="confirmSortFilter">
              <image class="save-button-image" src="../static/match/submit.png" mode="aspectFill" alt="确定图标"></image>
              <text class="save-button-text">确定</text>
            </button>
          </view>
        </view>
      </view>
    </view>
    <!-- 内容区 -->
    <view class="container-match">
      <!-- 老师卡片列表 -->
      <scroll-view class="card-list" scroll-y="true" id="step2" @scrolltolower="loadMoreTeachers">
        <view class="teacher-card" v-for="(teacher, index) in matchTeachers" :key="teacher.id || index">
          <view class="teacher-card-outer">
            <view class="teacher-card-outer-gradient">
              <view class="teacher-card-inner">
                <view class="card-left">
                  <image class="teacher-avatar" :src="teacher.avatar || '/static/image/defaultAvatar/teacher-man.png'" mode="aspectFill" @tap="viewTeacherDetail(teacher.id)"></image>
                </view>
                <view class="card-middle">
                  <!-- 顶部：昵称和认证标签同一行 -->
                  <view class="card-middle-top-row">
                    <view class="teacher-name">{{ teacher.name }}</view>
                    <view class="teacher-tags-inline">
                      <!--
                        认证状态图标
                        @已认证 static/image/certify/certified.png
                        @未认证 static/image/certify/uncertified.png
                      -->
                      <image
                        class="certify-icon"
                        :src="teacher.certificate ? '/static/image/certify/certified.png' : '/static/image/certify/uncertified.png'"
                        :alt="teacher.certificate ? '已认证' : '未认证'"
                      />
                    </view>
                  </view>
                  <!-- 学校单独一行 -->
                  <view class="teacher-info">{{ teacher.school }}</view>
                  <!-- 专业和评分同一行 -->
                  <view class="teacher-major-score">
                    <view class="teacher-major">{{ teacher.major }}</view>
                  </view>
                </view>
                <view class="price-tag-container card-right-center" v-if="teacher.hourPrice">
                  <view class="price-tag middle-text">￥</view>
                  <view class="price-tag">{{ teacher.hourPrice }}元/小时</view>
                  <view class="price-tag small-text">起</view>
                </view>
                <view class="card-right">
                  <button class="communicate-btn" @click.stop="handleCommunicate(teacher.id)">
                    <image class="communicate-icon" src="/pages_AI_Login_Match/static/match/communicate.png" mode="aspectFill" alt="沟通图标"></image>
                    <text class="communicate-text">马上沟通</text>
                  </button>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <view class="empty-state" v-if="matchTeachers.length === 0 && !isLoading">
          <text>暂无匹配的老师信息</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick} from 'vue'
import { useStore } from 'vuex'
import { Navigator } from '@/router/Router.js'
import Header from '@/components/navigationTitleBar/header'

// 初始化 store
const store = useStore()

// 搜索文本 - 从vuex获取
const searchText = computed({
  get: () => store.getters['user/match/searchKey'],
  set: (value) => {
    // 防抖处理
    if (searchTimer) {
      clearTimeout(searchTimer)
    }
    
    searchTimer = setTimeout(() => {
      store.dispatch('user/match/setSearchKey', value)
    }, 500) // 500ms防抖
  }
})

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

// 非专业课相关配置
const activeNonProTab = ref('math')

/**
 * 非专业课四个tab选项
 * @type {Array}
 */
const nonProTabs = [
  { key: 'math', label: '数学' },
  { key: 'english', label: '英语' },
  { key: 'politics', label: '政治' },
  { key: 'other', label: '其他' }
]

/**
 * tab key到中文描述的映射
 * @type {Object}
 */
const tabLabelMap = {
  math: '考研数学',
  english: '考研英语',
  politics: '考研政治',
  other: '其他科目'
}

// 从store中获取匹配的老师列表
const matchTeachers = computed(() => {
  return store.getters['user/match/matchTeachers']
})

// 分页相关状态
const currentPage = computed(() => store.state.user.match.currentPage)
const hasMore = computed(() => store.state.user.match.hasMore)

// 学校相关数据 - 改为使用研究生学校数据
const schoolInput = ref('')
const schoolOptions = computed(() => store.getters['user/schoolMajorRequest/graduateSchoolOptions'])
const schoolLoading = computed(() => store.getters['user/schoolMajorRequest/graduateSchoolSearchStatus'].isLoading)
const schoolHasMore = computed(() => store.getters['user/schoolMajorRequest/graduateSchoolSearchStatus'].hasMore)
const selectedSchoolId = ref(null)
const selectedSchoolName = ref('')

// 专业相关数据 - 改为使用研究生专业数据
const majorInput = ref('')
const majorOptions = computed(() => store.getters['user/schoolMajorRequest/graduateMajorOptions'])
const majorLoading = computed(() => store.getters['user/schoolMajorRequest/graduateMajorSearchStatus'].isLoading)
const selectedMajorId = ref(null)
const selectedMajorName = ref('')

// 非专业课相关数据
const nonProOptions = ref([])
const selectedNonProId = ref(null)
const selectedNonProName = ref('')
const selectedNonProType = ref('')

// 排序相关数据
const sortOptions = computed(() => store.state.user.match.sortMode.options)
const selectedSortId = ref(null)
const selectedSortName = ref('')

// 防抖定时器
let searchTimer = null

/**
 * 判断选项是否处于活跃状态
 * @param {String} key - 选项键名
 * @returns {Boolean} 是否处于活跃状态
 */
const isActive = (key) => {
  if (key === 'school') {
    return !!store.getters['user/schoolMajorRequest/selectedGraduateSchool'].name
  }
  
  if (key === 'professional') {
    return !!store.getters['user/schoolMajorRequest/selectedGraduateMajor'].name
  }
  
  if (key === 'nonProfessional') {
    const nonProfList = store.state.user.match.nonProfessionalList
    return !!(nonProfList.math.selected || nonProfList.english.selected || 
              nonProfList.politics.selected || nonProfList.other.selected)
  }
  
  if (key === 'sort') {
    return !!store.state.user.match.sortMode.selected
  }
  
  return currentOption.value === key
}

/**
 * 点击选项
 * @param {String} key - 选项键名
 */
const onOptionClick = (key) => {
  if (currentOption.value === key && showPopup.value) {
    showPopup.value = false
    currentOption.value = ''
    return
  }
  
  currentOption.value = key
  showPopup.value = true
  
  // 初始化对应的筛选数据
  initFilterData(key)
}

/**
 * 初始化筛选数据
 * @param {String} key - 筛选项键名
 */
const initFilterData = async (key) => {
  if (key === 'school') {
    // 同步当前选中的学校
    const selectedSchool = store.getters['user/schoolMajorRequest/selectedGraduateSchool']
    const searchStatus = store.getters['user/schoolMajorRequest/graduateSchoolSearchStatus']
    
    selectedSchoolId.value = selectedSchool.id
    selectedSchoolName.value = selectedSchool.name
    schoolInput.value = searchStatus.keyword || ''
    
    // 如果没有选项，触发搜索
    if (schoolOptions.value.length === 0) {
      searchSchools('')
    }
  }
  
  if (key === 'professional') {
    // 同步当前选中的专业
    const selectedMajor = store.getters['user/schoolMajorRequest/selectedGraduateMajor']
    const searchStatus = store.getters['user/schoolMajorRequest/graduateMajorSearchStatus']
    
    selectedMajorId.value = selectedMajor.id
    selectedMajorName.value = selectedMajor.name
    majorInput.value = searchStatus.keyword || ''
    
    // 检查是否已选择学校
    const selectedSchool = store.getters['user/schoolMajorRequest/selectedGraduateSchool']
    if (!selectedSchool.id) {
      majorInput.value = ''
      return
    }
    
    // 如果没有选项，触发搜索
    if (majorOptions.value.length === 0) {
      searchMajors('')
    }
  }
  
  if (key === 'nonProfessional') {
    // 初始化非专业课选项
    await loadNonProfessionalOptions(activeNonProTab.value)
    
    // 同步当前选中的非专业课
    const nonProfState = store.state.user.match.nonProfessionalList
    const currentTab = activeNonProTab.value
    if (nonProfState[currentTab] && nonProfState[currentTab].selected) {
      selectedNonProId.value = nonProfState[currentTab].selectedId
      selectedNonProName.value = nonProfState[currentTab].selected
      selectedNonProType.value = currentTab
    }
  }
  
  if (key === 'sort') {
    // 加载排序选项
    await store.dispatch('user/match/fetchSortModeOptions')
    
    // 同步当前选中的排序方式
    const sortState = store.state.user.match.sortMode
    selectedSortId.value = sortState.selectedId
    selectedSortName.value = sortState.selected
  }
}

/**
 * 关闭弹层
 */
const onPopupClose = () => {
  showPopup.value = false
  currentOption.value = ''
}

/**
 * 学校输入处理（防抖）
 * @param {Event} e
 */
const onSchoolInput = (e) => {
  const keyword = e.detail.value || schoolInput.value
  
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  // 设置新的定时器
  searchTimer = setTimeout(() => {
    searchSchools(keyword)
  }, 500) // 500ms防抖
}

/**
 * 专业输入处理（防抖）
 * @param {Event} e
 */
const onMajorInput = (e) => {
  const keyword = e.detail.value || majorInput.value
  
  // 检查 Vuex 中选中的学校而不是本地状态
  const selectedSchool = store.getters['user/schoolMajorRequest/selectedGraduateSchool']
  if (!selectedSchool.id) return
  
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  // 设置新的定时器
  searchTimer = setTimeout(() => {
    searchMajors(keyword)
  }, 500) // 500ms防抖
}

/**
 * 搜索学校
 * @param {String} keyword - 搜索关键词
 * @param {Boolean} loadMore - 是否加载更多
 */
const searchSchools = async (keyword, loadMore = false) => {
  try {
    await store.dispatch('user/schoolMajorRequest/searchGraduateSchools', { keyword, loadMore })
  } catch (error) {
    console.error('搜索学校失败:', error)
    uni.showToast({
      title: '搜索学校失败',
      icon: 'none'
    })
  }
}

/**
 * 搜索专业
 * @param {String} keyword - 搜索关键词
 */
const searchMajors = async (keyword) => {
  try {
    await store.dispatch('user/schoolMajorRequest/searchGraduateMajors', { keyword })
  } catch (error) {
    console.error('搜索专业失败:', error)
    uni.showToast({
      title: '搜索专业失败',
      icon: 'none'
    })
  }
}

/**
 * 加载更多学校
 */
const loadMoreSchools = () => {
  const searchStatus = store.getters['user/schoolMajorRequest/graduateSchoolSearchStatus']
  if (!searchStatus.isLoading && searchStatus.hasMore) {
    searchSchools(schoolInput.value, true)
  }
}

/**
 * 加载非专业课选项
 * @param {String} type - 非专业课类型
 */
const loadNonProfessionalOptions = async (type) => {
  try {
    const response = await store.dispatch('user/match/fetchNonProfessionalOptions', { type })
    if (response && response.data) {
      nonProOptions.value = response.data
    }
  } catch (error) {
    console.error('加载非专业课选项失败:', error)
    nonProOptions.value = []
  }
}

/**
 * 选择学校（临时）
 * @param {Object} school - 学校对象
 */
const selectSchoolTemp = (school) => {
  selectedSchoolId.value = school.id
  selectedSchoolName.value = school.name
  schoolInput.value = school.name
}

/**
 * 选择专业（临时）
 * @param {Object} major - 专业对象
 */
const selectMajorTemp = (major) => {
  selectedMajorId.value = major.id
  selectedMajorName.value = major.name
  majorInput.value = major.name
}

/**
 * 选择非专业课选项
 * @param {Object} option - 选项对象
 */
const selectNonProOption = (option) => {
  // 如果点击的是已选中的选项，则取消选择
  if (selectedNonProId.value === option.id) {
    selectedNonProId.value = null
    selectedNonProName.value = ''
    selectedNonProType.value = ''
  } else {
    selectedNonProId.value = option.id
    selectedNonProName.value = option.name
    selectedNonProType.value = activeNonProTab.value
  }
}

/**
 * 选择排序选项
 * @param {Object} option - 排序选项对象
 */
const selectSortOption = (option) => {
  // 如果点击的是已选中的选项，则取消选择
  if (selectedSortId.value === option.id) {
    selectedSortId.value = null
    selectedSortName.value = ''
  } else {
    selectedSortId.value = option.id
    selectedSortName.value = option.name
  }
}

/**
 * 确认学校筛选
 */
const confirmSchoolFilter = async () => {
  if (selectedSchoolId.value && selectedSchoolName.value) {
    await store.dispatch('user/schoolMajorRequest/selectGraduateSchool', {
      id: selectedSchoolId.value,
      name: selectedSchoolName.value
    })
  } else {
    // 清空选择
    await store.dispatch('user/schoolMajorRequest/selectGraduateSchool', {
      id: null,
      name: ''
    })
  }
  
  applyFilters()
  showPopup.value = false
  currentOption.value = ''
}

/**
 * 确认专业筛选
 */
const confirmProfessionalFilter = async () => {
  if (selectedMajorId.value && selectedMajorName.value) {
    await store.dispatch('user/schoolMajorRequest/selectGraduateMajor', {
      id: selectedMajorId.value,
      name: selectedMajorName.value
    })
  } else {
    // 清空选择
    await store.dispatch('user/schoolMajorRequest/selectGraduateMajor', {
      id: null,
      name: ''
    })
  }
  
  applyFilters()
  showPopup.value = false
  currentOption.value = ''
}

/**
 * 确认非专业课筛选
 */
const confirmNonProfessionalFilter = async () => {
  if (selectedNonProId.value && selectedNonProName.value && selectedNonProType.value) {
    await store.dispatch('user/match/selectNonProfessional', {
      type: selectedNonProType.value,
      id: selectedNonProId.value,
      name: selectedNonProName.value
    })
  } else {
    // 清空选择
    store.commit('user/match/CLEAR_NON_PROFESSIONAL_SELECTION')
  }
  
  applyFilters()
  showPopup.value = false
  currentOption.value = ''
}

/**
 * 确认排序方式筛选
 */
const confirmSortFilter = async () => {
  if (selectedSortId.value && selectedSortName.value) {
    await store.dispatch('user/match/selectSortMode', {
      id: selectedSortId.value,
      name: selectedSortName.value
    })
  } else {
    // 清空选择
    await store.dispatch('user/match/selectSortMode', {
      id: null,
      name: ''
    })
  }
  
  applyFilters()
  showPopup.value = false
  currentOption.value = ''
}

/**
 * 查看老师详情
 * @param {string} teacherId - 老师ID
 */
const viewTeacherDetail = async (teacherId) => {
  console.log('=== viewTeacherDetail 被调用 ===');
  console.log('传入的 teacherId:', teacherId, '类型:', typeof teacherId);
  
  // 确保teacherId是正确的类型（可能需要转换）
  const normalizedTeacherId = String(teacherId);
  console.log('标准化后的 teacherId:', normalizedTeacherId);
  
  try {
    // 显示加载状态
    uni.showLoading({
      title: '加载中...'
    })
    
    console.log('准备调用 store.dispatch...');
    
    // 调用store action获取老师详情
    const result = await store.dispatch('user/match/fetchTeacherDetail', { teacherId: normalizedTeacherId })
    
    console.log('store.dispatch 返回结果:', result);
    
    // 隐藏加载状态
    uni.hideLoading()
    
    console.log('准备跳转到老师详情页面...');
    
    // 跳转到老师详情页面
    Navigator.toTeacher(normalizedTeacherId)
  } catch (error) {
    console.error('=== viewTeacherDetail 发生错误 ===');
    console.error('错误详情:', error);
    uni.hideLoading()
    uni.showToast({
      title: '获取老师详情失败',
      icon: 'none'
    })
  }
}

/**
 * 处理沟通按钮点击
 */
const handleCommunicate = (teacherId) => {
  Navigator.toChat(teacherId)
}

/**
 * 加载更多老师数据
 */
const loadMoreTeachers = () => {
  if (isLoading.value || !hasMore.value) return
  
  isLoading.value = true
  
  store.dispatch('user/match/fetchMatchTeacherList', { loadMore: true })
    .then(() => {
      isLoading.value = false
    })
    .catch(error => {
      console.error('加载更多老师失败:', error)
      isLoading.value = false
    })
}

/**
 * 选择非专业课Tab
 */
const selectNonProTab = async (key) => {
  activeNonProTab.value = key
  await loadNonProfessionalOptions(key)
  
  // 同步当前tab的选中状态
  const nonProfState = store.state.user.match.nonProfessionalList
  if (nonProfState[key] && nonProfState[key].selected) {
    selectedNonProId.value = nonProfState[key].selectedId
    selectedNonProName.value = nonProfState[key].selected
    selectedNonProType.value = key
  } else {
    selectedNonProId.value = null
    selectedNonProName.value = ''
    selectedNonProType.value = ''
  }
}

/**
 * 应用所有筛选条件
 */
const applyFilters = () => {
  isLoading.value = true
  
  store.dispatch('user/match/fetchMatchTeacherList')
    .then(() => {
      isLoading.value = false
    })
    .catch(error => {
      console.error('应用筛选失败:', error)
      isLoading.value = false
    })
}

// 筛选条件摘要
const filterSummary = computed(() => {
  const summary = {}
  
  summary.school = store.getters['user/schoolMajorRequest/selectedGraduateSchool'].name || ''
  summary.professional = store.getters['user/schoolMajorRequest/selectedGraduateMajor'].name || ''
  
  const nonProfList = store.state.user.match.nonProfessionalList
  const nonProfItems = []
  if (nonProfList.math.selected) nonProfItems.push(nonProfList.math.selected)
  if (nonProfList.english.selected) nonProfItems.push(nonProfList.english.selected)
  if (nonProfList.politics.selected) nonProfItems.push(nonProfList.politics.selected)
  if (nonProfList.other.selected) nonProfItems.push(nonProfList.other.selected)
  summary.nonProfessional = nonProfItems.join(', ')
  
  summary.sort = store.state.user.match.sortMode.selected || ''
  
  return summary
})

/**
 * 重置学校筛选
 */
const resetSchoolFilter = () => {
  schoolInput.value = ''
  selectedSchoolId.value = null
  selectedSchoolName.value = ''
  searchSchools('')
}

/**
 * 重置专业课筛选
 */
const resetProfessionalFilter = () => {
  majorInput.value = ''
  selectedMajorId.value = null
  selectedMajorName.value = ''
  searchMajors('')
}

const handleBack = () => {
  Navigator.toIndex()
}

// 初始化
onMounted(async () => {
  console.log('=== match.vue onMounted 开始 ===');
  
  // 设置JWT Token到store中（如果还没有设置的话）
  if (!store.state.user.baseInfo.jwtToken) {
    const testToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJpZCI6MSwibG9naW5fdXNlcl9rZXkiOiI0YjMwYmQ1Yy04ZDUwLTQ0OGEtYTA4Mi1kZWUxOGMwNmIyMzEifQ.sDcrRbV52iDBs2AHVI5t7_ZfqWZaZm9la861HZyRjZvsbVz2ucI-e3RsYOSkUHSACPG3SGD0_5m-pcKyYCUofg';
    store.commit('user/baseInfo/SET_JWT_TOKEN', testToken);
    console.log('已设置JWT Token到store中');
  }
  
  // 初始化搜索关键词
  store.commit('user/match/SET_SEARCH_KEY', '')
  
  // 初始加载排序选项
  try {
    await store.dispatch('user/match/fetchSortModeOptions')
  } catch (error) {
    console.error('初始化排序选项失败:', error)
  }
  
  // 模拟初始数据加载
  isLoading.value = true
  try {
    await store.dispatch('user/match/fetchMatchTeacherList')
    
    // 添加调试信息
    console.log('=== 初始化后的状态检查 ===');
    console.log('matchTeachers computed:', matchTeachers.value);
    console.log('matchTeachers 长度:', matchTeachers.value.length);
    console.log('store.state.user.match.matchList:', store.state.user.match.matchList);
    
    if (matchTeachers.value.length > 0) {
      console.log('第一个老师的数据结构:', JSON.stringify(matchTeachers.value[0], null, 2));
    } else {
      console.log('matchTeachers 为空');
    }
    
    isLoading.value = false
  } catch (error) {
    console.error('初始化匹配列表失败:', error)
    isLoading.value = false
  }
  
  console.log('=== match.vue onMounted 完成 ===');
})

/**
 * 监听搜索框输入变化
 * @param {Event} e - 输入事件
 */
const onSearchInput = (e) => {
  const value = e.detail.value
  searchText.value = value
}

/**
 * 清空搜索内容
 */
const clearSearch = () => {
  searchText.value = ''
}
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
.page {
  position: relative;
  z-index: 1;
}
.search-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
  border-radius: 8rpx;
  padding: 10px;
  background: #fff;
}

.search-container {
  position: relative;
  width: 100%;
  flex-direction: row;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 40px 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.search-clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
}

.search-clear-btn .clear-icon {
  font-size: 14px;
  color: #666;
  line-height: 1;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper .clear-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #999;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  z-index: 2;
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
  padding: 12px 0px;
  position: relative;
  white-space: nowrap;
  display: flex;
  flex-direction: row; /* 水平排列 */
  align-items: center;
  justify-content: center;
}

.select-item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  margin-bottom: 2px;
  color: rgba(0,0,0,0.5);
}

.select-item.active .select-item-content .label-text {
  color: rgba(95, 38, 247, 1);
}


.arrow-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  margin-left: 10rpx;
}
.arrow-icon.active {
  color: rgba(95, 38, 247, 1);
}
.arrow-icon-rotate {
  transform: rotate(180deg);
}

.container-match {
  flex: 1;
  background: #f5f5f5;
  overflow-y: auto;
  background-color: transparent;
}

.popup-content {
  background-color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 15rpx 30rpx;
  flex: 1;
  overflow: hidden;
}
.filter-section{
  min-height: 400rpx;
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
  font-family: 'PingFang SC', sans-serif;
  font-size: 32rpx;
  line-height: 70rpx;
  letter-spacing: -1.1rpx;
  font-weight: 600;
  color: rgba(0, 0, 0, 1);
}

.popup-close {
  color: #007AFF;
  font-size: 28rpx;
  position: absolute;
  right: 32rpx;
  top: 28rpx;
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

.filter-label {
  font-size: 15px;
  color: #333;

  display: block;
}



.option-buttons {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10rpx;
}

.option-button {
  padding: 8px 15px;
  margin-right: 15px;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
  margin-bottom: 10rpx;
  margin-top: 10rpx;
}

.option-button-active {
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

  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(30, 144, 255, 0.1);
  position: relative;
  min-height: 110px;
}

.teacher-card-outer {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: transparent;
}

.teacher-card-outer-gradient {
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  padding: 2rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(228, 241, 255, 1) 0%, rgba(34, 136, 249, 1) 100%);
}

.teacher-card-inner {
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
}

/**
 * 老师卡内容渐变遮罩
 * 参考login页面同学卡内容渐变遮罩
 */
.teacher-card-inner::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(194, 221, 250, 0.2) 11.54%, rgba(34, 136, 249, 0.2) 111.54%);
  z-index: 1;
}

.card-left {
  align-self: flex-start;
  position: relative;
  z-index: 10;
  margin-bottom: -20rpx;
}

.teacher-avatar {

  width: 230rpx;
  height: 230rpx;
  position: relative;
  z-index: 10;
}

.card-middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 70px;
  width: calc(100% - 85px);
  box-sizing: border-box;
}


.card-middle-top-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8rpx;
  min-height: 60rpx;
}

.teacher-name {
  /**
   * 老师名字字体样式
   * @font PingFang SC, 400, 16px, 100%, -0.55px
   */
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 32rpx;
  line-height: 100%;
  letter-spacing: -0.55px;
  color: rgba(0, 0, 0, 1);
  margin-bottom: 20rpx;
  display: inline-flex;
  align-items: center;
}

.teacher-info {
  /**
   * 学校信息字体样式
   * @font PingFang SC, 400, 12px, 100%, -0.55px, 颜色rgba(70, 78, 248, 1)
   */
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 100%;
  letter-spacing: -0.55px;
  color: rgba(70, 78, 248, 1);
  margin-bottom: 4rpx;
}
.teacher-major-score {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap:10rpx;
  margin-top:4rpx
}
.teacher-tags {
  display: flex;
  flex-wrap: wrap;
}

.teacher-tags-inline {
  display: flex;
  flex-wrap: wrap;
  margin-left: 8rpx;
}


.price-tag-container {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  right: 36rpx;
  z-index: 1;
  padding: 8rpx 10rpx;
  border-radius: 8rpx;
  text-align: right;
}

.price-tag {
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 26rpx;
  line-height: 100%;
  letter-spacing: -1.1rpx;
  color: rgba(70, 78, 248, 1);

}
.middle-text {
  font-size: 20rpx;
  margin-top:6rpx;
}
.small-text {
  font-size: 16rpx;
  margin-top:10rpx;
  padding-right: 2rpx;
}

.card-right {
  position: relative;
  right: 36rpx;
  z-index: 2;
  margin-top:140rpx;
}

.card-right-center {
  position: absolute;
  top: 55%;
  transform: translateY(-50%);
  z-index: 2;
}

.communicate-btn {
  flex-direction: row;
  /**
   * 马上沟通按钮样式
   * 渐变背景，圆角，白色文字，指定文字样式
   */
  background: linear-gradient(180deg, #A5A9F7 0%, rgba(70, 78, 248, 0.9) 100%);
  min-height: 52rpx;
  padding: 0 28rpx;
  align-items: center;
  justify-content: center;

}
.communicate-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 20rpx;
}
.communicate-text {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 100%;
  letter-spacing: -1.36rpx;
  text-align: center;
  color: rgba(255, 255, 255, 1);
}
.empty-state {
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.loading-item {
  text-align: center;
  padding: 10px 0;
  color: #999;
  font-size: 14px;
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
  display: flex;
  flex-direction: column;
  height:600rpx;
}
.filter-popup.sort-popup {
  height: 38vh;
}
.filter-popup.non-professional-popup {
  height: 46vh;
}

/* 筛选弹窗内容区 */
.popup-content {
  background-color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 15rpx 30rpx;
  flex: 1;
  overflow: hidden;
}

/* 滚动区域容器 */
.scroll-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  margin-bottom: 20rpx;
}

/* 结果列表样式 */
.result-list {
  height: 300rpx; /* 固定高度 */
  overflow-y: auto;
}

/* 按钮容器 */
.button-container {
  position: relative;
	padding: 10rpx 20rpx 10rpx;

}

/* 底部按钮样式 */
.popup-button {
	width: 100%;
	height: 76rpx;
	background: linear-gradient(180deg, #A5A9F7 0%, rgba(70, 78, 248, 0.9) 100%);
	color: #ffffff;
	border-radius: 45rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 32rpx;
	border-radius: 20rpx;
	flex-direction: row;
	margin-top: 10rpx;

}


/* 表单行样式 */
.form-row {
  margin-bottom: 25rpx;
  width: 100%;
}

.selected-text {
  font-size: 20rpx;
  color: #007AFF;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140rpx;
  text-align: left;
}

/* 非专业课选项卡样式 */
.nonpro-tabs {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.nonpro-tabs .tab-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  color: #666;
  position: relative;
}

.nonpro-tabs .tab-item.active {
  color: #007AFF;
  font-weight: 500;
}

.nonpro-tabs .tab-item.active::after {
  content: '';
  position: absolute;
  left: 25%;
  bottom: -10px;
  width: 50%;
  height: 3px;
  background-color: #007AFF;
  border-radius: 3px;
}

.result-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  color: #333;
  cursor: pointer;
}
.result-item.active {
  color: #007AFF;
  background: #f0f8ff;
}



/* 固定在选项卡下方的按钮容器 */
.fixed-button-container {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background-color: #fff;
  z-index: 5;
}

/* 针对每个弹窗标题的绝对定位样式 */
.popup-title-school {
  position: absolute;
  width: 32px;
  height: 35px;
  top: 160px;
  left: 21px;
}
.popup-title-professional {
  position: absolute;
  width: 47px;
  height: 35px;
  top: 160px;
  left: 110px;
}
.popup-title-nonpro {
  position: absolute;
  width: 63px;
  height: 35px;
  top: 160px;
  left: 212px;
}
.popup-title-sort {
  position: absolute;
  width: 63px;
  height: 35px;
  top: 160px;
  left: 332px;
}



.teacher-major {
  /**
   * 专业和评分字体样式
   * @font PingFang SC, 400, 12px, 100%, -0.55px
   */
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 24rpx;
  line-height: 100%;
  letter-spacing: -0.55px;
  color: #666666;
}

.certify-icon {
  /**
   * 认证状态图标样式
   * @size 16x16px
   * @align 与昵称垂直居中
   */
  width: 94rpx;
  height: 40rpx;
  margin-left: 4rpx;
  display: inline-block;
  z-index: 10;
}

/* 非专业课弹窗确认按钮下移 */
.filter-popup.non-professional-popup .button-container {
  margin-top: auto; /* 自动推到底部 */
  padding-bottom: 25rpx; /* 比默认多20rpx，可根据实际调整 */
}

/* 排序方式弹窗确认按钮下移 */
.filter-popup.sort-popup .button-container {
  margin-top: auto;
  padding-bottom: 25rpx;
}

.save-button-container {
  padding-left: 10rpx;
  padding-right: 10rpx;
}

.save-button {
  width: 100%;
  height: 76rpx;
  background: linear-gradient(180deg, #A5A9F7 0%, rgba(70, 78, 248, 0.9) 100%);
  color: #ffffff;
  border-radius: 45rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  border-radius: 20rpx;
  flex-direction: row;
  margin-top: 10rpx;

}


.save-button-image {
  width: 36rpx;
  height: 36rpx;
  margin-right: 30rpx;
}
.save-button-text {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 1);
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: -0.68px;
  text-align: center;
}

</style>
