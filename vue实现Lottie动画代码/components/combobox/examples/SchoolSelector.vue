<template>
  <view class="school-selector-container">
    <!-- 选择器类型切换 -->
    <view class="selector-type">
      <view class="type-item" :class="{ active: selectorType === 'undergraduate' }" @click="switchType('undergraduate')">本科生院校</view>
      <view class="type-item" :class="{ active: selectorType === 'graduate' }" @click="switchType('graduate')">考研院校专业</view>
    </view>
    
    <!-- 本科生院校选择器 -->
    <view v-if="selectorType === 'undergraduate'" class="undergraduate-selector">
      <text class="selector-label">请选择院校：</text>
      <ChoiceSelected
        mode="search"
        componentType="undergraduate"
        :choiceList="undergraduateSchools"
        :choiceIndex="selectedUndergraduateIndex"
        searchPlaceholder="输入院校名称搜索"
        @search-input="updateUndergraduateKeyword"
        @onChoiceClick="selectUndergraduateSchool"
        ref="undergraduateSelector"
      />
    </view>
    
    <!-- 考研院校专业选择器 -->
    <view v-if="selectorType === 'graduate'" class="graduate-selector">
      <!-- 考研院校选择 -->
      <view class="graduate-school-selector">
        <text class="selector-label">请选择考研院校：</text>
        <ChoiceSelected
          mode="search"
          componentType="graduateSchool"
          :choiceList="graduateSchools"
          :choiceIndex="selectedGraduateSchoolIndex"
          searchPlaceholder="输入考研院校名称搜索"
          @search-input="updateGraduateSchoolKeyword"
          @onChoiceClick="selectGraduateSchool"
          @linkage-change="handleSchoolChange"
          ref="graduateSchoolSelector"
        />
      </view>
      
      <!-- 考研专业选择 -->
      <view class="graduate-major-selector">
        <text class="selector-label">请选择考研专业：</text>
        <ChoiceSelected
          mode="search"
          componentType="graduateMajor"
          :choiceList="graduateMajors"
          :choiceIndex="selectedGraduateMajorIndex"
          :parentValue="selectedGraduateSchool"
          :isLinkage="true"
          searchPlaceholder="输入考研专业名称搜索"
          :defaultText="selectedGraduateSchool ? '请选择专业' : '请先选择院校'"
          @search-input="updateGraduateMajorKeyword"
          @onChoiceClick="selectGraduateMajor"
          @reset-selection="resetMajorSelection"
          ref="graduateMajorSelector"
        />
      </view>
    </view>
    
    <!-- 选择结果展示 -->
    <view class="selection-result">
      <view v-if="selectorType === 'undergraduate' && selectedUndergraduateSchool">
        <text class="result-label">已选择本科院校：</text>
        <text class="result-value">{{ selectedUndergraduateSchool }}</text>
      </view>
      
      <view v-if="selectorType === 'graduate'">
        <view v-if="selectedGraduateSchool">
          <text class="result-label">已选择考研院校：</text>
          <text class="result-value">{{ selectedGraduateSchool }}</text>
        </view>
        
        <view v-if="selectedGraduateMajor">
          <text class="result-label">已选择考研专业：</text>
          <text class="result-value">{{ selectedGraduateMajor }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ChoiceSelected from '../combobox.vue';
import UndergraduateStore from '../undergraduate_school.js';
import GraduateStore from '../graduate_school_major.js';

export default {
  components: {
    ChoiceSelected
  },
  data() {
    return {
      selectorType: 'undergraduate', // 'undergraduate' | 'graduate'
      
      // 本科生数据
      undergraduateStore: UndergraduateStore.state,
      selectedUndergraduateIndex: -1,
      selectedUndergraduateSchool: '',
      
      // 考研数据
      graduateStore: GraduateStore.state,
      selectedGraduateSchoolIndex: -1,
      selectedGraduateSchool: '',
      selectedGraduateMajorIndex: -1,
      selectedGraduateMajor: ''
    };
  },
  computed: {
    /**
     * @description 获取过滤后的本科生学校列表
     * @returns {Array} 过滤后的学校列表
     */
    undergraduateSchools() {
      return UndergraduateStore.getters.filteredSchools(this.undergraduateStore);
    },
    
    /**
     * @description 获取过滤后的考研学校列表
     * @returns {Array} 过滤后的考研学校列表
     */
    graduateSchools() {
      return GraduateStore.getters.filteredSchoolList(this.graduateStore);
    },
    
    /**
     * @description 获取过滤后的考研专业列表
     * @returns {Array} 过滤后的考研专业列表
     */
    graduateMajors() {
      return GraduateStore.getters.filteredMajorList(this.graduateStore);
    }
  },
  methods: {
    /**
     * @description 切换选择器类型
     * @param {String} type - 选择器类型
     */
    switchType(type) {
      this.selectorType = type;
    },
    
    // ===== 本科生相关方法 =====
    /**
     * @description 更新本科生学校搜索关键词
     * @param {String} keyword - 搜索关键词
     */
    updateUndergraduateKeyword(keyword) {
      UndergraduateStore.actions.updateFilterKeyword({
        commit: (mutation, payload) => {
          UndergraduateStore.mutations[mutation](this.undergraduateStore, payload);
        }
      }, keyword);
    },
    
    /**
     * @description 选择本科生学校
     * @param {Number} index - 选中项索引
     * @param {String} school - 选中的学校名称
     */
    selectUndergraduateSchool(index, school) {
      this.selectedUndergraduateIndex = index;
      this.selectedUndergraduateSchool = school;
    },
    
    // ===== 考研相关方法 =====
    /**
     * @description 更新考研学校搜索关键词
     * @param {String} keyword - 搜索关键词
     */
    updateGraduateSchoolKeyword(keyword) {
      GraduateStore.actions.updateSchoolKeyword({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }, keyword);
    },
    
    /**
     * @description 选择考研学校
     * @param {Number} index - 选中项索引
     * @param {String} school - 选中的学校名称
     */
    selectGraduateSchool(index, school) {
      this.selectedGraduateSchoolIndex = index;
      this.selectedGraduateSchool = school;
      
      // 更新GraduateStore中的选中学校
      GraduateStore.actions.updateSelectedSchool({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }, school);
      
      // 重置专业选择
      this.selectedGraduateMajorIndex = -1;
      this.selectedGraduateMajor = '';
    },
    
    /**
     * @description 处理学校变更事件
     * @param {String} school - 变更后的学校名称
     */
    handleSchoolChange(school) {
      if (!school) {
        // 学校被清空，重置专业选择
        this.resetMajorSelection();
      }
    },
    
    /**
     * @description 更新考研专业搜索关键词
     * @param {String} keyword - 搜索关键词
     */
    updateGraduateMajorKeyword(keyword) {
      GraduateStore.actions.updateMajorKeyword({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }, keyword);
    },
    
    /**
     * @description 选择考研专业
     * @param {Number} index - 选中项索引
     * @param {String} major - 选中的专业名称
     */
    selectGraduateMajor(index, major) {
      this.selectedGraduateMajorIndex = index;
      this.selectedGraduateMajor = major;
    },
    
    /**
     * @description 重置专业选择
     */
    resetMajorSelection() {
      this.selectedGraduateMajorIndex = -1;
      this.selectedGraduateMajor = '';
    }
  }
}
</script>

<style scoped>
.school-selector-container {
  padding: 20rpx;
}

.selector-type {
  display: flex;
  margin-bottom: 30rpx;
}

.type-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  background-color: #f5f5f5;
  border: 1rpx solid #ddd;
}

.type-item.active {
  background-color: #F0AD4E;
  color: white;
}

.undergraduate-selector, 
.graduate-school-selector, 
.graduate-major-selector {
  margin-bottom: 30rpx;
}

.selector-label {
  font-size: 28rpx;
  margin-bottom: 10rpx;
  display: block;
}

.selection-result {
  margin-top: 50rpx;
  padding: 20rpx;
  border-top: 1rpx solid #eee;
}

.result-label {
  font-size: 28rpx;
  color: #666;
}

.result-value {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}
</style> 