<template>
  <view class="cascade-container">
    <!-- 第一级：学校选择 -->
    <view class="filter-row">
      <cascade-selector
        v-model="selectedSchool"
        :options="formattedSchoolOptions"
        :placeholder="'选择学校'"
        :searchable="true"
        :search-placeholder="'搜索学校'"
        @change="onSchoolChange"
        @search="onSchoolSearch"
      />
    </view>
    
    <!-- 第二级：专业选择 -->
    <view class="filter-row">
      <cascade-selector
        v-model="selectedMajor"
        :options="formattedMajorOptions"
        :placeholder="'选择专业'"
        :disabled="!selectedSchool"
        @change="onMajorChange"
      />
    </view>
    
    <!-- 第三级：考研科目选择 -->
    <view class="filter-row">
      <cascade-selector
        v-model="selectedSubject"
        :options="formattedSubjectOptions"
        :placeholder="'选择考研科目'"
        :disabled="!selectedMajor"
        :searchable="true"
        :search-placeholder="'搜索考研科目'"
        @search="onSubjectSearch"
        @change="onSubjectChange"
      />
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CascadeSelector from './cascade-selector'

/**
 * 级联选择容器
 * @description 管理学校、专业和考研科目的三级联动选择
 */
export default {
  name: 'CascadeContainer',
  components: {
    CascadeSelector
  },
  
  props: {
    /**
     * 是否直接应用选中的值（不需要点击筛选按钮）
     * @type {Boolean}
     * @default false
     */
    autoApply: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      selectedSchool: '',
      selectedMajor: '',
      selectedSubject: ''
    }
  },
  
  computed: {
    ...mapGetters('filter', [
      'schoolOptions',
      'majorOptions',
      'subjectOptions',
      'filteredSchoolOptions',
      'filteredMajorOptions',
      'filteredSubjectOptions'
    ]),
    
    /**
     * @description 将vuex中的学校选项格式化为cascade-selector需要的格式
     * @returns {Array} 格式化后的学校选项
     */
    formattedSchoolOptions() {
      return this.filteredSchoolOptions.map(option => ({
        label: option.choiceItemContent,
        value: option.choiceItemValue
      }));
    },
    
    /**
     * @description 将vuex中的专业选项格式化为cascade-selector需要的格式
     * @returns {Array} 格式化后的专业选项
     */
    formattedMajorOptions() {
      return this.filteredMajorOptions.map(option => ({
        label: option.choiceItemContent,
        value: option.choiceItemValue
      }));
    },
    
    /**
     * @description 将vuex中的考研科目选项格式化为cascade-selector需要的格式
     * @returns {Array} 格式化后的考研科目选项
     */
    formattedSubjectOptions() {
      return this.filteredSubjectOptions.map(option => ({
        label: option.choiceItemContent,
        value: option.choiceItemValue
      }));
    }
  },
  
  methods: {
    ...mapActions('filter', [
      'selectSchool',
      'selectMajor',
      'selectSubject',
      'searchSchool',
      'searchMajor',
      'searchSubject',
      'resetFilters'
    ]),
    
    /**
     * @description 学校选择改变事件处理
     * @param {Object} school 选中的学校对象
     */
    onSchoolChange(school) {
      this.selectedSchool = school.value;
      this.selectedMajor = '';
      this.selectedSubject = '';
      
      // 通知Vuex更新选中的学校
      this.selectSchool(school.value);
      
      // 触发选择事件
      this.$emit('school-change', school.value);
      
      // 如果设置了自动应用，则直接触发筛选应用
      if (this.autoApply) {
        this.$emit('apply-filter', {
          school: this.selectedSchool,
          major: '',
          subject: ''
        });
      }
    },
    
    /**
     * @description 专业选择改变事件处理
     * @param {Object} major 选中的专业对象
     */
    onMajorChange(major) {
      this.selectedMajor = major.value;
      this.selectedSubject = '';
      
      // 通知Vuex更新选中的专业
      this.selectMajor(major.value);
      
      // 触发选择事件
      this.$emit('major-change', major.value);
      
      // 如果设置了自动应用，则直接触发筛选应用
      if (this.autoApply) {
        this.$emit('apply-filter', {
          school: this.selectedSchool,
          major: this.selectedMajor,
          subject: ''
        });
      }
    },
    
    /**
     * @description 考研科目选择改变事件处理
     * @param {Object} subject 选中的考研科目对象
     */
    onSubjectChange(subject) {
      this.selectedSubject = subject.value;
      
      // 通知Vuex更新选中的考研科目
      this.selectSubject(subject.value);
      
      // 触发选择事件
      this.$emit('subject-change', subject.value);
      
      // 如果设置了自动应用，则直接触发筛选应用
      if (this.autoApply) {
        this.$emit('apply-filter', {
          school: this.selectedSchool,
          major: this.selectedMajor,
          subject: this.selectedSubject
        });
      }
    },
    
    /**
     * @description 学校搜索事件处理
     * @param {String} keyword 搜索关键词
     */
    onSchoolSearch(keyword) {
      // 通知Vuex更新学校搜索关键词
      this.searchSchool(keyword);
    },
    
    /**
     * @description 专业搜索事件处理
     * @param {String} keyword 搜索关键词
     */
    onMajorSearch(keyword) {
      // 通知Vuex更新专业搜索关键词
      this.searchMajor(keyword);
    },
    
    /**
     * @description 考研科目搜索事件处理
     * @param {String} keyword 搜索关键词
     */
    onSubjectSearch(keyword) {
      // 通知Vuex更新考研科目搜索关键词
      this.searchSubject(keyword);
    },
    
    /**
     * @description 应用筛选条件
     */
    applyFilter() {
      // 触发筛选应用事件
      this.$emit('apply-filter', {
        school: this.selectedSchool,
        major: this.selectedMajor,
        subject: this.selectedSubject
      });
    },
    
    /**
     * @description 重置筛选条件
     */
    reset() {
      this.selectedSchool = '';
      this.selectedMajor = '';
      this.selectedSubject = '';
      
      // 通知Vuex重置筛选条件
      this.resetFilters();
      
      // 触发重置事件
      this.$emit('reset');
    },
    
    /**
     * @description 获取当前选中的筛选值
     * @returns {Object} 当前选中的筛选值对象
     */
    getSelectedValues() {
      return {
        school: this.selectedSchool,
        major: this.selectedMajor,
        subject: this.selectedSubject
      };
    }
  }
}
</script>

<style>
.cascade-container {
  width: 100%;
}

.filter-row {
  margin-bottom: 12px;
}

.filter-row:last-child {
  margin-bottom: 0;
}
</style> 