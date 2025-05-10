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
        :class="{active: isActive(item.key)}"
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
            <scroll-view class="result-list" scroll-y="true">
              <view
                v-for="(school, idx) in filteredSchoolList"
                :key="school"
                class="result-item"
                :class="{active: idx === formData.targetSchoolIndex}"
                @click="selectSchoolTemp(idx, school)"
              >
                {{ school }}
              </view>
            </scroll-view>
          </view>
          <view class="button-container">
            <button class="popup-button confirm-button" @click.stop="confirmSchoolFilter">确认</button>
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
                :placeholder="formData.targetSchool ? '请输入专业名称' : '请先选择学校'"
                class="search-input"
                :disabled="!formData.targetSchool"
                @input="onMajorInput"
                @click.stop
              />
              <view v-if="majorInput" class="clear-icon" @click.stop="resetProfessionalFilter">×</view>
            </view>
          </view>
          <view class="scroll-container">
            <scroll-view class="result-list" scroll-y="true">
              <view
                v-for="(major, idx) in filteredMajorList"
                :key="major"
                class="result-item"
                :class="{active: idx === formData.targetMajorIndex}"
                @click="selectMajorTemp(idx, major)"
              >
                {{ major }}
              </view>
            </scroll-view>
          </view>
          <view class="button-container">
            <button class="popup-button confirm-button" @click.stop="confirmProfessionalFilter">确认</button>
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
          
          <!-- 固定位置的确认按钮 -->
          <view class="fixed-button-container">
            <button class="popup-button confirm-button" @click.stop="confirmNonProfessionalFilter">确认</button>
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
                :key="index"
                class="option-button"
                :class="{'option-button-active': index === formData.sortIndex}"
                @click.stop="handleSortSelect(index)"
              >
                {{ option }}
              </view>
            </view>
          </view>
          
          <view class="button-container">
            <button class="popup-button confirm-button" @click.stop="confirmSortFilter">确认</button>
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
          <view class="price-tag-container" v-if="oneToOneMatchPrice(matchTeachers)[teacher.id]">
            <view class="price-tag">{{ oneToOneMatchPrice(matchTeachers)[teacher.id].hourlyPrice }}元/小时起</view>
          </view>
        </view>
        
        <view class="empty-state" v-if="matchTeachers.length === 0 && !isLoading">
          <text>暂无匹配的老师信息</text>
        </view>
        
        <!-- 使用全局Lottie动画替代文本加载提示 -->
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted} from 'vue'
import { useStore } from 'vuex'
import { Navigator } from '@/router/Router.js'
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

const matchTeachers = computed(() => {
  return store.state.user.match.matchList || []
})

// 表单数据
const formData = reactive({
  targetSchoolIndex: -1,
  targetMajorIndex: -1,
  targetSchool: '',
  targetMajor: '',
  
  // 非专业课筛选数据
  mathIndex: -1,
  englishIndex: -1,
  politicsIndex: -1,
  otherIndex: -1,
  
  // 排序方式
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

// 新增响应式变量
const schoolInput = ref('')
const majorInput = ref('')

// 筛选结果列表
const filteredSchoolList = ref([])
const filteredMajorList = ref([])

/**
 * 获取教师一对一课程的每小时价格
 * @param {Array} matchTeachers - 匹配的教师列表
 * @returns {Object} - 包含每小时价格信息的对象
 */
const oneToOneMatchPrice = (matchTeachers) => {
  const result = {};
  
  if (!matchTeachers || !Array.isArray(matchTeachers)) {
    return result;
  }
  
  matchTeachers.forEach(teacher => {
    const oneToOneService = teacher.service?.find(
      service => service.type?.typename === '一对一课程'
    );
    
    if (oneToOneService) {
      const priceValue = parseFloat(oneToOneService.price.replace(/[^0-9.]/g, ''));
      const hourValue = parseFloat(
        oneToOneService.type.fulllength.hours.replace(/[^0-9.]/g, '')
      );
      const minuteValue = parseFloat(
        oneToOneService.type.fulllength.minutes.replace(/[^0-9.]/g, '')
      );
      
      const totalHours = hourValue + (minuteValue / 60);
      
      if (totalHours > 0) {
        result[teacher.id] = {
          name: teacher.name,
          hourlyPrice: (priceValue / totalHours).toFixed(2)
        };
      }
    }
  });
  
  return result;
};

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
  if (currentOption.value === key && showPopup.value) {
    showPopup.value = false
    currentOption.value = ''
    return
  }
  
  currentOption.value = key
  showPopup.value = true
  
  syncStateToForm(key)
}

/**
 * 从Vuex状态同步特定筛选项的数据到表单
 * @param {String} key - 筛选项键名
 */
const syncStateToForm = (key) => {
  if (key === 'school') {
    const schoolList = store.state.user.match.schoolList
    schoolInput.value = schoolList || ''
    if (schoolList) {
      formData.targetSchool = schoolList
      const idx = filteredSchoolList.value.findIndex(s => s === schoolList)
      if (idx >= 0) {
        formData.targetSchoolIndex = idx
      }
    }
    updateFilteredSchoolList()
  }
  
  if (key === 'professional') {
    const professionalList = store.state.user.match.professionalList
    majorInput.value = professionalList || ''
    if (professionalList) {
      formData.targetMajor = professionalList
      const idx = filteredMajorList.value.findIndex(m => m === professionalList)
      if (idx >= 0) {
        formData.targetMajorIndex = idx
      }
    }
    updateFilteredMajorList()
  }
  
  if (key === 'nonProfessional') {
    const nonProfList = store.state.user.match.nonProfessionalList
    
    if (nonProfList.math) {
      const idx = mathOptions.value.findIndex(opt => opt === nonProfList.math)
      if (idx >= 0) {
        formData.mathIndex = idx
        activeNonProTab.value = 'math'
      }
    } else if (nonProfList.english) {
      const idx = englishOptions.value.findIndex(opt => opt === nonProfList.english)
      if (idx >= 0) {
        formData.englishIndex = idx
        activeNonProTab.value = 'english'
      }
    } else if (nonProfList.politics) {
      const idx = politicsOptions.value.findIndex(opt => opt === nonProfList.politics)
      if (idx >= 0) {
        formData.politicsIndex = idx
        activeNonProTab.value = 'politics'
      }
    } else if (nonProfList.other) {
      const idx = otherOptions.value.findIndex(opt => opt === nonProfList.other)
      if (idx >= 0) {
        formData.otherIndex = idx
        activeNonProTab.value = 'other'
      }
    }
  }
  
  if (key === 'sort') {
    const sortMode = store.state.user.match.sortMode
    if (sortMode) {
      const idx = sortOptions.value.findIndex(opt => opt === sortMode)
      if (idx >= 0) {
        formData.sortIndex = idx
      }
    }
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
  
  GraduateStore.actions.selectSchool({
    commit: (mutation, payload) => {
      GraduateStore.mutations[mutation](graduateStore.value, payload)
    }
  }, school)
  
  if (graduateStore.value.schools[school]) {
    const majorsCount = graduateStore.value.schools[school].length
    targetMajorList.value = graduateStore.value.schools[school].slice(0, 100)
    
    if (store.state.user.match.professionalList) {
      const savedMajor = store.state.user.match.professionalList
      const majorIndex = targetMajorList.value.findIndex(
        major => major === savedMajor
      )
      
      if (majorIndex >= 0) {
        formData.targetMajorIndex = majorIndex
        formData.targetMajor = savedMajor
      } else {
        resetMajorSelection()
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
    graduateStore.value = JSON.parse(JSON.stringify(GraduateStore.state))
    GraduateStore.mutations.initSchoolFuse(graduateStore.value)
    const schools = Object.keys(graduateStore.value.schools).slice(0, 50)
    targetSchoolList.value = schools
  } catch (error) {
    targetSchoolList.value = ["北京大学", "清华大学", "复旦大学"]
  }
}

/**
 * 处理学校输入
 * @param {Event} e
 */
const onSchoolInput = (e) => {
  const keyword = e.detail.value || schoolInput.value
  
  GraduateStore.mutations.setSchoolKeyword(graduateStore.value, keyword)
  
  if (!keyword) {
    formData.targetSchoolIndex = -1
    formData.targetSchool = ''
    
    majorInput.value = ''
    formData.targetMajorIndex = -1
    formData.targetMajor = ''
  } 
  updateFilteredSchoolList()
}

/**
 * 处理专业输入
 * @param {Event} e
 */
const onMajorInput = (e) => {
  if (!formData.targetSchool) return
  
  const keyword = e.detail.value || majorInput.value
  
  // 确保关键词正确设置到GraduateStore中
  GraduateStore.mutations.setMajorKeyword(graduateStore.value, keyword)
  
  if (!keyword) {
    formData.targetMajorIndex = -1
    formData.targetMajor = ''
  }
  updateFilteredMajorList(keyword)
}

/**
 * 更新学校搜索结果
 */
const updateFilteredSchoolList = () => {
  filteredSchoolList.value = GraduateStore.getters.filteredSchoolList(graduateStore.value)
}

/**
 * 更新专业搜索结果
 * @param {String} forceKeyword - 强制使用的关键词（如果提供）
 */
const updateFilteredMajorList = (forceKeyword) => {
  if (!formData.targetSchool) {
    filteredMajorList.value = []
    return
  }
  
  GraduateStore.mutations.setSelectedSchool(graduateStore.value, formData.targetSchool)
  
  // 使用强制关键词或从状态获取关键词
  const currentKeyword = forceKeyword !== undefined ? forceKeyword : graduateStore.value.majorKeyword || ''
  
  // 如果关键词被意外清空，重新设置
  if (forceKeyword && forceKeyword !== graduateStore.value.majorKeyword) {
    GraduateStore.mutations.setMajorKeyword(graduateStore.value, forceKeyword)
  }
  
  // 获取原始专业列表
  let originalMajorList = []
  if (currentKeyword) {
    // 使用关键词搜索
    // 临时设置关键词到graduate_store确保搜索正确
    const originalKeyword = graduateStore.value.majorKeyword
    GraduateStore.mutations.setMajorKeyword(graduateStore.value, currentKeyword)
    
    // 使用Fuse.js搜索功能获取匹配结果
    originalMajorList = GraduateStore.getters.filteredMajorList(graduateStore.value)
    
    // 确保原始的关键词还原
    if (originalKeyword !== currentKeyword) {
      GraduateStore.mutations.setMajorKeyword(graduateStore.value, originalKeyword)
    }
  } else {
    // 无关键词时，获取所有专业
    originalMajorList = graduateStore.value.schools[formData.targetSchool]?.slice(0, 100) || []
  }
  
  filteredMajorList.value = originalMajorList
  
  if (!currentKeyword) {
    customSortMajorList()
  } else {
    ensureSelectedMajorVisible()
  }
}

/**
 * 确保选中的专业在列表中可见
 */
const ensureSelectedMajorVisible = () => {
  if (!formData.targetMajor || !filteredMajorList.value.length) {
    return
  }
  
  const index = filteredMajorList.value.findIndex(major => major === formData.targetMajor)
  
  if (index === -1) {
    filteredMajorList.value.unshift(formData.targetMajor)
  } 
  else if (index > 0) {
    const selectedMajor = filteredMajorList.value.splice(index, 1)[0]
    filteredMajorList.value.unshift(selectedMajor)
  }
}

/**
 * 自定义专业列表排序
 */
const customSortMajorList = () => {
  if (!filteredMajorList.value || filteredMajorList.value.length === 0) {
    return
  }
  
  // 修改排序逻辑
  filteredMajorList.value.sort((a, b) => {
    // 选中项置顶
    if (a === formData.targetMajor) return -1
    if (b === formData.targetMajor) return 1
    
    // 计算机相关专业优先显示（如果当前学校是同济大学）
    if (formData.targetSchool === '同济大学') {
      const aHasComputer = a.includes('计算') || a.includes('软件') || a.includes('信息') || a.includes('通信')
      const bHasComputer = b.includes('计算') || b.includes('软件') || b.includes('信息') || b.includes('通信')
      
      if (aHasComputer && !bHasComputer) return -1
      if (!aHasComputer && bHasComputer) return 1
    }
    
    // 按拼音首字母排序
    return a.localeCompare(b, 'zh-CN')
  })
}

/**
 * 选择学校（临时）
 */
const selectSchoolTemp = (idx, school) => {
  formData.targetSchoolIndex = idx
  formData.targetSchool = school
  schoolInput.value = school
}

/**
 * 确认学校筛选
 */
const confirmSchoolFilter = () => {
  store.dispatch('user/match/updateSchoolList', formData.targetSchool)
  
  // 如果选择了学校，触发学校变更处理
  if (formData.targetSchool) {
    handleSchoolChange(formData.targetSchool)
  } else {
    // 如果清空学校，重置专业相关数据
    majorInput.value = ''
    formData.targetMajorIndex = -1
    formData.targetMajor = ''
    updateFilteredMajorList()
  }
  
  applyFilters()
  showPopup.value = false
  currentOption.value = ''
}

/**
 * 选择专业（临时）
 */
const selectMajorTemp = (idx, major) => {
  formData.targetMajorIndex = idx
  formData.targetMajor = major
  majorInput.value = major
  
  // 临时选择专业时不清空关键词，保持搜索结果
  // GraduateStore.mutations.setMajorKeyword(graduateStore.value, '')
}

/**
 * 确认专业筛选前的预处理
 */
const prepareProfessionalFilter = () => {
  // 如果有输入关键词但没有选中专业，尝试使用关键词匹配第一个专业
  if (!formData.targetMajor && majorInput.value && filteredMajorList.value.length > 0) {
    // 获取当前搜索框的关键词
    const keyword = majorInput.value
    
    // 直接使用关键词进行搜索，不改变store状态
    let searchResults = []
    
    if (keyword) {
      // 临时设置关键词进行搜索
      const originalKeyword = graduateStore.value.majorKeyword
      GraduateStore.mutations.setMajorKeyword(graduateStore.value, keyword)
      
      // 执行搜索
      searchResults = GraduateStore.getters.filteredMajorList(graduateStore.value)
      
      // 恢复原始关键词
      GraduateStore.mutations.setMajorKeyword(graduateStore.value, originalKeyword)
    }
    
    if (searchResults.length > 0) {
      // 使用搜索结果中的第一项（最匹配的结果）
      formData.targetMajor = searchResults[0]
    } else {
      // 如果搜索无结果，使用当前过滤列表的第一项
      formData.targetMajor = filteredMajorList.value[0]
    }
    formData.targetMajorIndex = 0
    majorInput.value = formData.targetMajor
  }
  
  return formData.targetMajor
}

/**
 * 确认专业筛选
 */
const confirmProfessionalFilter = () => {
  // 使用预处理函数处理关键词匹配和专业选择
  const selectedMajor = prepareProfessionalFilter()
  
  if (selectedMajor) {
    formData.mathIndex = -1
    formData.englishIndex = -1
    formData.politicsIndex = -1
    formData.otherIndex = -1
    
    store.dispatch('user/match/updateNonProfessionalList', {
      math: '',
      english: '',
      politics: '',
      other: ''
    })
  }
  
  store.dispatch('user/match/updateProfessionalList', selectedMajor)
  
  // 清空关键词，以便下次打开时显示完整列表
  if (graduateStore.value) {
    GraduateStore.mutations.setMajorKeyword(graduateStore.value, '')
  }
  
  applyFilters()
  showPopup.value = false
  currentOption.value = ''
}

/**
 * 获取当前tab对应的选中索引
 */
const getChoiceIndex = (key) => {
  switch (key) {
    case 'math': return formData.mathIndex
    case 'english': return formData.englishIndex
    case 'politics': return formData.politicsIndex
    case 'other': return formData.otherIndex
    default: return -1
  }
}

/**
 * 处理下拉框选项选择
 */
const handleChoiceSelect = (key, index) => {
  // 检查是否点击了已选中的选项
  if ((key === 'math' && formData.mathIndex === index) ||
      (key === 'english' && formData.englishIndex === index) ||
      (key === 'politics' && formData.politicsIndex === index) ||
      (key === 'other' && formData.otherIndex === index)) {
    // 如果点击的是已选中的选项，则取消选择
    formData.mathIndex = -1
    formData.englishIndex = -1
    formData.politicsIndex = -1
    formData.otherIndex = -1
    return
  }
  
  // 如果点击的是未选中的选项，则清空其他选择，选中当前选项
  formData.mathIndex = -1
  formData.englishIndex = -1
  formData.politicsIndex = -1
  formData.otherIndex = -1
  
  switch (key) {
    case 'math': formData.mathIndex = index; break
    case 'english': formData.englishIndex = index; break
    case 'politics': formData.politicsIndex = index; break
    case 'other': formData.otherIndex = index; break
  }
}

/**
 * 确认非专业课筛选
 */
const confirmNonProfessionalFilter = () => {
  const updateObj = {
    math: formData.mathIndex >= 0 ? mathOptions.value[formData.mathIndex] : '',
    english: formData.englishIndex >= 0 ? englishOptions.value[formData.englishIndex] : '',
    politics: formData.politicsIndex >= 0 ? politicsOptions.value[formData.politicsIndex] : '',
    other: formData.otherIndex >= 0 ? otherOptions.value[formData.otherIndex] : ''
  }
  
  store.dispatch('user/match/updateNonProfessionalList', updateObj)
  
  if (formData.mathIndex >= 0 || formData.englishIndex >= 0 || formData.politicsIndex >= 0 || formData.otherIndex >= 0) {
    formData.targetMajorIndex = -1
    formData.targetMajor = ''
    
    store.dispatch('user/match/updateProfessionalList', '')
  }
  
  applyFilters()
  showPopup.value = false
  currentOption.value = ''
}

/**
 * 临时选择排序方式
 */
const handleSortSelect = (index) => {
  // 如果点击了已选中的排序选项，则取消选择
  if (formData.sortIndex === index) {
    formData.sortIndex = -1
  } else {
    formData.sortIndex = index
  }
}

/**
 * 确认排序方式筛选
 */
const confirmSortFilter = () => {
  const sortValue = formData.sortIndex >= 0 ? sortOptions.value[formData.sortIndex] : ''
  store.dispatch('user/match/updateSortMode', sortValue)
  
  applyFilters()
  showPopup.value = false
  currentOption.value = ''
}

/**
 * 查看老师详情
 */
const viewTeacherDetail = (teacherId) => {
  Navigator.toTeacher(teacherId)
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
  if (isLoading.value) return
  isLoading.value = true
  
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
 */
const selectNonProTab = (key) => {
  activeNonProTab.value = key
}

/**
 * 获取当前tab对应的选项列表
 */
const getChoiceList = (key) => {
  switch (key) {
    case 'math': return mathOptions.value
    case 'english': return englishOptions.value
    case 'politics': return politicsOptions.value
    case 'other': return otherOptions.value
    default: return []
  }
}

/**
 * 应用所有筛选条件
 */
const applyFilters = () => {
  isLoading.value = true
  
  store.dispatch('user/match/fetchMatchTeachers')
    .finally(() => {
      isLoading.value = false
    })
}

// 筛选条件摘要
const filterSummary = computed(() => {
  const summary = {}
  
  summary.school = store.state.user.match.schoolList || ''
  summary.professional = store.state.user.match.professionalList || ''
  
  const nonProfList = store.state.user.match.nonProfessionalList
  const nonProfItems = []
  if (nonProfList.math) nonProfItems.push(nonProfList.math)
  if (nonProfList.english) nonProfItems.push(nonProfList.english)
  if (nonProfList.politics) nonProfItems.push(nonProfList.politics)
  if (nonProfList.other) nonProfItems.push(nonProfList.other)
  summary.nonProfessional = nonProfItems.join(', ')
  
  summary.sort = store.state.user.match.sortMode || ''
  
  return summary
})

/**
 * 重置学校筛选
 */
const resetSchoolFilter = () => {
  schoolInput.value = ''
  formData.targetSchoolIndex = -1
  formData.targetSchool = ''
  
  majorInput.value = ''
  formData.targetMajorIndex = -1
  formData.targetMajor = ''
  
  updateFilteredSchoolList()
}

/**
 * 重置专业课筛选
 */
const resetProfessionalFilter = () => {
  majorInput.value = ''
  formData.targetMajorIndex = -1
  formData.targetMajor = ''
  
  store.dispatch('user/match/updateProfessionalList', '')
  
  if (formData.targetSchool && graduateStore.value) {
    GraduateStore.mutations.setMajorKeyword(graduateStore.value, '')
  }
  
  updateFilteredMajorList()
}

/**
 * 重置排序方式筛选
 */
const resetSortFilter = () => {
  formData.sortIndex = -1
}

/**
 * 重置非专业课筛选
 */
const resetNonProfessionalFilter = () => {
  formData.mathIndex = -1
  formData.englishIndex = -1
  formData.politicsIndex = -1
  formData.otherIndex = -1
  
  activeNonProTab.value = ''
}

// 初始化
onMounted(() => {
  initGraduateData().then(() => {
    updateFilteredSchoolList()
    updateFilteredMajorList()
    
    // 如果已有选中的学校，初始化对应的专业列表
    const selectedSchool = store.state.user.match.schoolList
    if (selectedSchool && graduateStore.value?.schools[selectedSchool]) {
      const majors = graduateStore.value.schools[selectedSchool].slice(0, 100)
      targetMajorList.value = majors
    }
  })
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

.input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 30px 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.clear-icon {
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
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 15rpx 30rpx;
  flex: 1;
  overflow: hidden;
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

.price-tag-container {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 1;
}

.price-tag {
  font-size: 13px;
  color: #ff6b00;
  background-color: rgba(255, 107, 0, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  display: inline-flex;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(255, 107, 0, 0.1);
  border: 1px solid rgba(255, 107, 0, 0.2);
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
.filter-popup.sort-popup {
  height: 51vh;
}
.filter-popup.non-professional-popup {
  height: 60vh;
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
  width: 100%;
  padding: 20rpx 0;
  position: relative;
}

/* 底部按钮样式 */
.popup-button {
  margin-left: 10%;
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

.confirm-button {
  background-color: #007AFF;
  color: #ffffff;
  border: none;
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
</style>
