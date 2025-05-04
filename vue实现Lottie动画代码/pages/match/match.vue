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
        <view class="select-item-content">
          <text class="label-text">{{ item.label }}</text>
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
    <view v-if="showPopup" class="filter-mask" @click="onPopupClose">

      <!-- 学校筛选弹层 -->
      <view 
        v-if="currentOption === 'school'" 
        class="filter-popup"
      >
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
              :defaultSearchValue="filterSummary.school"
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
          <button class="popup-button reset-button" @click="resetSchoolFilter">重置</button>

        </view>
      </view>
  
      <!-- 专业课筛选弹层 -->
      <view 
        v-if="currentOption === 'professional'" 
        class="filter-popup"
      >
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
              :defaultSearchValue="filterSummary.professional"
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

          <button class="popup-button reset-button" @click="resetProfessionalFilter">重置</button>

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
                  v-for="(option, index) in getChoiceList(activeNonProTab)" 
                  :key="index"
                  class="option-button"
                  :class="{'option-button-active': index === getChoiceIndex(activeNonProTab)}"
                  @click.stop="handleChoiceSelect(activeNonProTab, index)"
                >
                  {{ option }}
                </view>
              </view>
          </view>
                      <!-- 底部按钮 -->
          <button class="nonpro-popup-button reset-button" @click.stop="resetNonProfessionalFilter">重置</button>
        </view>
      </view>
  
      <!-- 排序方式筛选弹层 -->
      <view 
        v-if="currentOption === 'sort'" 
        class="filter-popup"
      >
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
          <button class="popup-button reset-button" @click="resetSortFilter">重置</button>
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
import { ref, reactive, computed, onMounted} from 'vue'
import { useStore } from 'vuex'
import { Navigator } from '@/router/Router.js'
import ChoiceSelected from '../../components/combobox/combobox'
import GraduateStore from '../../components/combobox/graduate_school_major.js'

// 初始化 store
const store = useStore()

// 搜索文本
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

// 非专业课相关配置
// 当前选择的非专业课Tab（只允许一个）
const activeNonProTab = ref('')

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

/**
 * 从Vuex获取匹配的老师列表
 */
const matchTeachers = computed(() => {
  return store.state.user.match.matchList || []
})

// 表单数据 - 由于只是临时UI状态，仍使用本地状态管理
const formData = reactive({
  targetSchoolIndex: -1,  // 目标学校索引
  targetMajorIndex: -1,   // 目标专业索引
  targetSchool: '',       // 学校名称
  targetMajor: '',        // 专业名称
  
  // 非专业课筛选数据
  mathIndex: -1,         // 考研数学类型索引
  englishIndex: -1,      // 考研英语类型索引
  politicsIndex: -1,     // 考研政治类型索引
  otherIndex: -1,        // 其他考试类型索引
  
  // 排序方式
  sortIndex: -1,         // 排序方式索引
})

// 学校和专业列表数据
const targetSchoolList = ref([]) // 目标学校列表
const targetMajorList = ref([])  // 目标专业列表
const graduateStore = ref(null)  // 研究生数据存储对象

// 下拉选项列表
const mathOptions = ref(['数学一', '数学二', '数学三'])
const englishOptions = ref(['英语一', '英语二'])
const politicsOptions = ref(['政治必修', '政治选修'])
const otherOptions = ref(['经济学', '管理学', '教育学', '历史学'])
const sortOptions = ref(['综合评分从高到低', '价格从低到高', '价格从高到低', '最新发布'])



/**
 * 判断选项是否处于活跃状态
 * @param {String} key - 选项键名
 * @returns {Boolean} 是否处于活跃状态
 */
const isActive = (key) => {
  if (key === 'school') {
    return !!store.state.user.match.schoolList
  }
  
  if (key === 'professional') {
    return !!store.state.user.match.professionalList
  }
  
  if (key === 'nonProfessional') {
    const nonProfList = store.state.user.match.nonProfessionalList
    return !!(nonProfList.math || nonProfList.english || nonProfList.politics || nonProfList.other)
  }
  
  if (key === 'sort') {
    return !!store.state.user.match.sortMode
  }
  
  return currentOption.value === key
}

/**
 * 点击选项
 * @param {String} key - 选项键名
 */
const onOptionClick = (key) => {
  // 如果点击的是已经打开的选项，则关闭弹窗
  if (currentOption.value === key && showPopup.value) {
    showPopup.value = false
    currentOption.value = ''
    return
  }
  
  // 设置当前选项并显示弹窗
  currentOption.value = key
  showPopup.value = true
  
  // 在打开弹窗时，先从store同步最新的筛选状态到表单
  syncStateToForm(key)
}

/**
 * 从Vuex状态同步特定筛选项的数据到表单
 * @param {String} key - 筛选项键名
 */
const syncStateToForm = (key) => {
  switch (key) {
    case 'school':
      // 学校筛选同步
      if (store.state.user.match.schoolList) {
        formData.targetSchool = store.state.user.match.schoolList
        // 找到对应的学校索引
        const schoolIndex = targetSchoolList.value.findIndex(
          school => school === formData.targetSchool
        )
        formData.targetSchoolIndex = schoolIndex >= 0 ? schoolIndex : -1
      }
      break
      
    case 'professional':
      // 专业课筛选同步
      if (store.state.user.match.professionalList) {
        formData.targetMajor = store.state.user.match.professionalList
        // 找到对应的专业索引
        const majorIndex = targetMajorList.value.findIndex(
          major => major === formData.targetMajor
        )
        formData.targetMajorIndex = majorIndex >= 0 ? majorIndex : -1
      }
      break
      
    case 'nonProfessional':
      // 非专业课筛选同步
      const nonProfList = store.state.user.match.nonProfessionalList
      
      // 重置所有索引
      formData.mathIndex = -1
      formData.englishIndex = -1
      formData.politicsIndex = -1
      formData.otherIndex = -1
      activeNonProTab.value = ''
      
      // 找出哪个字段有值，并设置对应的tab和索引
      if (nonProfList.math) {
        const mathIndex = mathOptions.value.findIndex(item => item === nonProfList.math)
        formData.mathIndex = mathIndex >= 0 ? mathIndex : -1
        activeNonProTab.value = 'math'
      } else if (nonProfList.english) {
        const englishIndex = englishOptions.value.findIndex(item => item === nonProfList.english)
        formData.englishIndex = englishIndex >= 0 ? englishIndex : -1
        activeNonProTab.value = 'english'
      } else if (nonProfList.politics) {
        const politicsIndex = politicsOptions.value.findIndex(item => item === nonProfList.politics)
        formData.politicsIndex = politicsIndex >= 0 ? politicsIndex : -1
        activeNonProTab.value = 'politics'
      } else if (nonProfList.other) {
        const otherIndex = otherOptions.value.findIndex(item => item === nonProfList.other)
        formData.otherIndex = otherIndex >= 0 ? otherIndex : -1
        activeNonProTab.value = 'other'
      }
      break
      
    case 'sort':
      // 排序方式同步
      if (store.state.user.match.sortMode) {
        const sortIndex = sortOptions.value.findIndex(item => item === store.state.user.match.sortMode)
        formData.sortIndex = sortIndex >= 0 ? sortIndex : -1
      } else {
        formData.sortIndex = -1
      }
      break
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
 * 处理学校变更，更新专业列表
 * @param {String} school - 变更后的学校名称
 */
const handleSchoolChange = async (school) => {
  if (!school) {
    resetMajorSelection()
    return
  }
  
  // 更新专业搜索实例
  GraduateStore.actions.selectSchool({
    commit: (mutation, payload) => {
      GraduateStore.mutations[mutation](graduateStore.value, payload)
    }
  }, school)
  
  // 更新专业列表
  if (graduateStore.value.schools[school]) {
    targetMajorList.value = graduateStore.value.schools[school].slice(0, 20)
    
    // 如果state中有已选专业，尝试在新的专业列表中找到匹配项
    if (store.state.user.match.professionalList) {
      const savedMajor = store.state.user.match.professionalList
      const majorIndex = targetMajorList.value.findIndex(
        major => major === savedMajor
      )
      
      // 如果当前学校下有匹配的专业，则设置选中状态
      if (majorIndex >= 0) {
        formData.targetMajorIndex = majorIndex
        formData.targetMajor = savedMajor
      } else {
        // 如果没有匹配的专业，则清空专业选择
        resetMajorSelection()
        // 同时更新state中的专业课记录
        store.dispatch('user/match/updateProfessionalList', '')
      }
    }
  } else {
    resetMajorSelection()
  }
}

/**
 * 初始化研究生学校专业数据
 */
const initGraduateData = async () => {
  try {
    // 初始化研究生数据状态
    graduateStore.value = JSON.parse(JSON.stringify(GraduateStore.state))
    
    // 初始化搜索引擎
    GraduateStore.mutations.initSchoolFuse(graduateStore.value)
    
    // 设置目标学校列表初始值
    const schools = Object.keys(graduateStore.value.schools).slice(0, 50) // 初始只显示前50所
    targetSchoolList.value = schools
    
    console.log('初始化研究生学校专业数据成功')
  } catch (error) {
    console.error('初始化研究生学校专业数据失败:', error)
    // 设置默认数据
    targetSchoolList.value = ["北京大学", "清华大学", "复旦大学"]
  }
}

/**
 * 处理目标学校选择
 * @param {Number} index - 选择的索引
 * @param {String} school - 选择的学校名称
 */
const handleTargetSchoolSelect = (index, school) => {
  // 直接更新到正式表单数据
  formData.targetSchoolIndex = index
  formData.targetSchool = school
  
  // 使用Vuex的actions更新学校选择
  store.dispatch('user/match/updateSchoolList', school)
  
  // 更新专业列表
  handleSchoolChange(school)
}

/**
 * 处理目标专业选择
 * @param {Number} index - 选择的索引
 * @param {String} major - 选择的专业名称
 */
const handleTargetMajorSelect = (index, major) => {
  // 直接更新到正式表单数据
  formData.targetMajorIndex = index
  formData.targetMajor = major
  
  // 使用Vuex的actions更新专业选择
  store.dispatch('user/match/updateProfessionalList', major)
  
  // 如果选择了专业课，则清空非专业课选择（互斥逻辑）
  if (major) {
    // 清空非专业课相关数据
    formData.mathIndex = -1
    formData.englishIndex = -1
    formData.politicsIndex = -1
    formData.otherIndex = -1
    
    // 清空非专业课筛选状态 - 使用Vuex的actions重置非专业课筛选
    store.dispatch('user/match/updateFilterMode', {
      math: '',
      english: '',
      politics: '',
      other: ''
    })
  }
  
  // 应用筛选
  applyFilters()
}

/**
 * 处理目标学校搜索
 * @param {String} keyword - 搜索关键词
 */
const handleTargetSchoolSearch = (keyword) => {
  if (!keyword || keyword.trim() === '') {
    const allSchools = Object.keys(graduateStore.value.schools).slice(0, 50)
    targetSchoolList.value = allSchools
    return
  }
  
  // 更新学校搜索关键词
  GraduateStore.mutations.setSchoolKeyword(graduateStore.value, keyword)
  
  // 获取过滤结果
  const filteredSchools = GraduateStore.getters.filteredSchoolList(graduateStore.value)
  targetSchoolList.value = filteredSchools
}

/**
 * 处理目标专业搜索
 * @param {String} keyword - 搜索关键词
 */
const handleTargetMajorSearch = (keyword) => {
  if (!graduateStore.value.selectedSchool) {
    return
  }
  
  if (!keyword || keyword.trim() === '') {
    const allMajors = graduateStore.value.schools[graduateStore.value.selectedSchool] || []
    targetMajorList.value = allMajors.slice(0, 20)
    return
  }
  
  // 更新专业搜索关键词
  GraduateStore.mutations.setMajorKeyword(graduateStore.value, keyword)
  
  // 获取过滤结果
  const filteredMajors = GraduateStore.getters.filteredMajorList(graduateStore.value)
  targetMajorList.value = filteredMajors
}

/**
 * 处理排序方式选择
 * @param {Number} index - 选择的索引
 */
const handleSortSelect = (index) => {
  // 直接更新到正式表单数据
  formData.sortIndex = index
  
  // 更新排序方式 - 使用Vuex的actions更新排序模式
  const sortValue = index >= 0 ? sortOptions.value[index] : ''
  store.dispatch('user/match/updateSortMode', sortValue)
  
  // 应用筛选
  applyFilters()
}

/**
 * 重置学校筛选
 */
const resetSchoolFilter = () => {
  // 直接重置学校相关筛选数据
  formData.targetSchoolIndex = -1
  formData.targetSchool = ''
  
  // 使用Vuex的actions重置学校筛选
  store.dispatch('user/match/updateSchoolList', '')
  
  // 应用筛选
  applyFilters()
}

/**
 * 重置专业课筛选
 */
const resetProfessionalFilter = () => {
  // 直接重置专业课相关筛选数据
  formData.targetMajorIndex = -1
  formData.targetMajor = ''
  
  // 使用Vuex的actions重置专业课筛选
  store.dispatch('user/match/updateProfessionalList', '')
  
  // 应用筛选
  applyFilters()
}

/**
 * 重置非专业课筛选
 */
const resetNonProfessionalFilter = () => {
  // 直接重置非专业课相关筛选数据
  formData.mathIndex = -1
  formData.englishIndex = -1
  formData.politicsIndex = -1
  formData.otherIndex = -1
  
  // 使用Vuex的actions重置非专业课筛选
  store.dispatch('user/match/updateNonProfessionalList', {
    math: '',
    english: '',
    politics: '',
    other: ''
  })
  
  // 重置当前选中的tab
  activeNonProTab.value = ''
  
  // 应用筛选
  applyFilters()
}

/**
 * 重置排序方式筛选
 */
const resetSortFilter = () => {
  // 直接重置排序相关筛选数据
  formData.sortIndex = -1
  
  // 重置排序方式 - 使用Vuex的actions重置排序模式
  store.dispatch('user/match/updateSortMode', '')
  
  // 应用筛选
  applyFilters()
}

/**
 * 应用所有筛选条件 - 触发Vuex的获取匹配老师列表action
 */
const applyFilters = () => {
  isLoading.value = true
  
  // 使用Vuex的actions获取筛选后的老师列表
  store.dispatch('user/match/fetchMatchTeachers')
    .finally(() => {
      isLoading.value = false
    })
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
  
  // 使用Vuex的actions加载更多老师
  store.dispatch('user/match/loadMoreTeachers')
    .finally(() => {
      isLoading.value = false
    })
}

/**
 * 重置专业选择
 */
const resetMajorSelection = () => {
  formData.targetMajorIndex = -1
  formData.targetMajor = ''
}

/**
 * 选择非专业课Tab
 * @param {String} key - 选项key
 */
const selectNonProTab = (key) => {
  activeNonProTab.value = key
}

/**
 * 获取当前tab对应的选项列表
 * @param {String} key - 选项key
 * @returns {Array} 选项列表
 */
const getChoiceList = (key) => {
  switch (key) {
    case 'math':
      return mathOptions.value
    case 'english':
      return englishOptions.value
    case 'politics':
      return politicsOptions.value
    case 'other':
      return otherOptions.value
    default:
      return []
  }
}

/**
 * 获取当前tab对应的选中索引
 * @param {String} key - 选项key
 * @returns {Number} 选中索引
 */
const getChoiceIndex = (key) => {
  switch (key) {
    case 'math':
      return formData.mathIndex
    case 'english':
      return formData.englishIndex
    case 'politics':
      return formData.politicsIndex
    case 'other':
      return formData.otherIndex
    default:
      return -1
  }
}

/**
 * 处理下拉框选项选择
 * @param {String} key - 选项key
 * @param {Number} index - 选中索引
 */
const handleChoiceSelect = (key, index) => {
  // 先清空所有非专业课选择
  formData.mathIndex = -1
  formData.englishIndex = -1
  formData.politicsIndex = -1
  formData.otherIndex = -1
  
  // 只设置当前选中的值
  switch (key) {
    case 'math':
      formData.mathIndex = index
      // 更新Vuex状态
      store.dispatch('user/match/updateNonProfessionalList', {
        math: index >= 0 ? mathOptions.value[index] : '',
        english: '',
        politics: '',
        other: ''
      })
      break
    case 'english':
      formData.englishIndex = index
      // 更新Vuex状态
      store.dispatch('user/match/updateNonProfessionalList', {
        math: '',
        english: index >= 0 ? englishOptions.value[index] : '',
        politics: '',
        other: ''
      })
      break
    case 'politics':
      formData.politicsIndex = index
      // 更新Vuex状态
      store.dispatch('user/match/updateNonProfessionalList', {
        math: '',
        english: '',
        politics: index >= 0 ? politicsOptions.value[index] : '',
        other: ''
      })
      break
    case 'other':
      formData.otherIndex = index
      // 更新Vuex状态
      store.dispatch('user/match/updateNonProfessionalList', {
        math: '',
        english: '',
        politics: '',
        other: index >= 0 ? otherOptions.value[index] : ''
      })
      break
  }
  
  // 如果选择了非专业课，则清空专业课选择（互斥逻辑）
  if (index >= 0) {
    // 清空专业课相关数据
    formData.targetMajorIndex = -1
    formData.targetMajor = ''
    
    // 清空专业课筛选状态 - 使用Vuex的actions重置专业课筛选
    store.dispatch('user/match/updateProfessionalList', '')
  }
  
  // 应用筛选
  applyFilters()
}

// 创建一个计算属性来处理已保存的筛选条件显示
const filterSummary = computed(() => {
  const summary = {}
  
  // 学校筛选摘要
  summary.school = store.state.user.match.schoolList || ''
  
  // 专业课筛选摘要
  summary.professional = store.state.user.match.professionalList || ''
  
  // 非专业课筛选摘要
  const nonProfList = store.state.user.match.nonProfessionalList
  const nonProfItems = []
  if (nonProfList.math) nonProfItems.push(nonProfList.math)
  if (nonProfList.english) nonProfItems.push(nonProfList.english)
  if (nonProfList.politics) nonProfItems.push(nonProfList.politics)
  if (nonProfList.other) nonProfItems.push(nonProfList.other)
  summary.nonProfessional = nonProfItems.join(', ')
  
  // 排序方式摘要
  summary.sort = store.state.user.match.sortMode || ''
  
  return summary
})


// 生命周期钩子：组件挂载时添加键盘高度变化监听
onMounted(() => {
  // 初始化研究生学校专业数据
  initGraduateData()
  
  // 从Vuex store获取教师列表数据 - 初始化加载
  store.dispatch('user/match/fetchMatchTeachers')
  
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

.filter-label {
  font-size: 15px;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.filter-section {
  padding: 25rpx 0;
}


.option-buttons {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10rpx;
}

.option-button {
  padding: 8px 15px;
  margin-right: 15px;
  margin-bottom: 15px;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
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
  display: flex;
  flex-direction: column;
  height: 650rpx;

}
.filter-popup.non-professional-popup {
  height: 60vh;
}

/* 底部按钮样式 */
.popup-button {
  
  margin-top: 320rpx;
  margin-left: 10%;
  width: 80%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}
.nonpro-popup-button {
  position: absolute;
  top: 640rpx;
  left: 10%;
  width: 80%;
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
  border: 1px solid #007AFF;
}


/* 表单行样式 */
.form-row {
  margin-bottom: 25rpx;
  width: 100%;
}

.selected-text {
  font-size: 12px;
  color: #007AFF;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
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
</style>
