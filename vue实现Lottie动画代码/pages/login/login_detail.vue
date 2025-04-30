<template>
  <view class="form-container">
    
          <!-- 表单内容 -->
    <view class="form-card">
      <view class="form-notice">
        <text class="notice-text">以下信息为选填项，您可以选择填写您想提供的信息</text>
      </view>

      <!-- Nickname -->
      <view class="form-row">
        <view class="label-container">
          <text class="form-label">昵称</text>
          <text class="optional-tag">(选填)</text>
        </view>
        <input class="form-input" type="text" v-model="formData.nickname" placeholder="请输入昵称" />
      </view>
      
      <!-- Gender -->
      <view class="form-row">
        <view class="label-container">
          <text class="form-label">性别</text>
          <text class="optional-tag">(选填)</text>
        </view>
        <view class="radio-group">
          <view class="radio-item-row">
            <view class="radio-option" @click="formData.gender = '男'">
              <radio :checked="formData.gender === '男'" color="#007AFF" />
              <text class="option-text">男</text>
            </view>
            <view class="radio-option" @click="formData.gender = '女'">
              <radio :checked="formData.gender === '女'" color="#007AFF" />
              <text class="option-text">女</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- Phone Number -->
      <view class="form-row">
        <view class="label-container">
          <text class="form-label">手机号</text>
          <text class="optional-tag">(选填)</text>
        </view>
        <input class="form-input" type="text" v-model="formData.phone" placeholder="请输入手机号" />
      </view>
      
      <!-- 普通学校和专业筛选框 - 仅学生显示 -->
      <block v-if="userRole === '学生'">
        <!-- School - 使用单输入筛选框 -->
        <view class="form-row">
          <view class="label-container">
            <text class="form-label">就读学校</text>
            <text class="optional-tag">(选填)</text>
          </view>
          <ChoiceSelected
            class="form-select"
            componentType="undergraduate"
            :choiceIndex="formData.schoolIndex"
            :choiceList="schoolList"
            defaultText="请选择学校"
            mode="search"
            searchPlaceholder="输入学校名称"
            @onChoiceClick="handleSchoolSelect"
            @search-input="handleSchoolSearch"
            ref="schoolDropdown"
          />
        </view>
        
        <!-- Major - 使用单输入筛选框 -->
        <view class="form-row">
          <view class="label-container">
            <text class="form-label">就读专业</text>
            <text class="optional-tag">(选填)</text>
          </view>
          <ChoiceSelected
            class="form-select"
            componentType="undergraduate"
            :choiceIndex="formData.majorIndex"
            :choiceList="majorList"
            defaultText="请选择专业"
            mode="search"
            searchPlaceholder="输入专业名称"
            @onChoiceClick="handleMajorSelect"
            @search-input="handleMajorSearch"
            ref="majorDropdown"
          />
        </view>
      </block>

      <!-- Grade -->
      <view class="form-row">
        <view class="label-container">
          <text class="form-label">年级</text>
          <text class="optional-tag">(选填)</text>
        </view>
        <ChoiceSelected
          class="form-select"
          :choiceIndex="formData.gradeIndex"
          :choiceList="gradeList"
          defaultText="请选择年级"
          mode="select"
          @onChoiceClick="handleGradeSelect"
        />
      </view>
      
      <!-- 目标学校和目标专业筛选框 - 学生和老师都显示，但标签有区别 -->
      <block>
          <!-- Target School -->
          <view class="form-row">
            <view class="label-container">
              <text class="form-label">{{ userRole === '学生' ? '目标学校' : '就读学校' }}</text>
              <text class="optional-tag">(选填)</text>
            </view>
            <ChoiceSelected
              class="form-select"
              componentType="graduateSchool"
              :choiceIndex="formData.targetSchoolIndex"
              :choiceList="targetSchoolList"
              :defaultText="userRole === '学生' ? '请选择目标学校' : '请选择学校'"
              mode="search"
              :searchPlaceholder="userRole === '学生' ? '输入目标学校名称' : '输入学校名称'"
              @onChoiceClick="handleTargetSchoolSelect"
              @search-input="handleTargetSchoolSearch"
              @linkage-change="handleSchoolChange"
              :enablePagination="true"
              :pageSize="10"
              ref="targetSchoolDropdown"
            />
          </view>
          
          <!-- Target Major -->
          <view class="form-row">
            <view class="label-container">
              <text class="form-label">{{ userRole === '学生' ? '目标专业' : '就读专业' }}</text>
              <text class="optional-tag">(选填)</text>
            </view>
            <ChoiceSelected
              class="form-select"
              componentType="graduateMajor"
              :choiceIndex="formData.targetMajorIndex"
              :choiceList="targetMajorList"
              :parentValue="formData.targetSchool"
              :isLinkage="true"
              :defaultText="formData.targetSchool ? (userRole === '学生' ? '请选择专业' : '请选择专业') : '请先选择学校'"
              mode="search"
              :searchPlaceholder="userRole === '学生' ? '输入目标专业名称' : '输入专业名称'"
              @onChoiceClick="handleTargetMajorSelect"
              @search-input="handleTargetMajorSearch"
              @reset-selection="resetMajorSelection"
              :enablePagination="true"
              :pageSize="10"
              ref="targetMajorDropdown"
            />
          </view>
      </block>
      <!-- 按钮区域 -->
      <view class="button-container">
        <button class="submit-btn" @click="submitForm">提交信息</button>
      </view>
    </view>

    
    <!-- 老师角色协议确认浮窗 -->
    <view class="modal-overlay" v-if="showAgreementModal" @click.stop="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-title">入驻协议</view>
        <view class="modal-body">
          <view class="agreement-text">
            <view class="agreement-item">就平台入驻涉及的权利和义务与您做出如下约定：</view>
            <view class="agreement-item">1、您知晓并同意，登署本协议即代表您依照本协议公布的规则履行义务并享有权利。</view>
            <view class="agreement-item">2、您同意，申请入驻平台认证老师后按照平台要求提供服务，包括并不限于向平台用户提供线上线下考研咨询及资料服务。</view>
            <view class="agreement-item">3、您同意，入驻平台认证学长通过后，进行线上服务时就服务标准内容进行回复，不得向用户索要用户私人联系方式包括(微信、手机号等)，平台会对站内聊天内容进行监控，若发现违规内容，平台有权进行处理，处理方式包括并不限于限制消息发送、删除消息等，若违规行为次数超过2次，平台有权对您的认证状态进行撤销。</view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="agree-btn" @click="confirmAgreement">我已悉知并同意</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ChoiceSelected from '../../components/combobox/combobox'
import store from '../../store'
import { Navigator } from '../../router/Router';
import GraduateStore from '../../components/combobox/graduate_school_major.js';
import createDataModule from '../../components/combobox/undergraduate.js';
import schoolData from '../../static/data/2886所大学.json';
import majorData from '../../static/data/本科专业.json';

export default {
  onPageScroll() {
    // 通知所有组件页面已滚动
    uni.$emit('page-scroll');
  },
  components: {
    ChoiceSelected,
  },
  onLoad() {
    this.loadUniversityData();
    this.initSchoolAndMajorSearch();
  },
  data() {
    return {
      formData: {
        nickname: '',
        gender: '男',
        phone: '',
        schoolIndex: -1,
        majorIndex: -1,
        targetSchoolIndex: -1,  // 目标学校索引
        targetMajorIndex: -1,   // 目标专业索引
        gradeIndex: -1,
        targetSchool: '',
        targetMajor: '', // 目标专业值
      },
      schoolList: [], // 普通学校列表
      majorList: [], // 普通专业列表
      targetSchoolList: [], // 目标学校列表（考研）
      targetMajorList: [], // 目标专业列表（考研）
      allGradeList: ['大一', '大二', '大三', '大四', '研一', '研二', '研三'],
      userRole: '学生',  // 默认值为学生
      showAgreementModal: false, // 控制协议浮窗显示
      pendingUserInfo: null, // 暂存待提交的用户信息
      // 分离筛选器状态
      graduateStore: null, // 研究生数据状态
      schoolStore: null, // 本科学校数据状态
      majorStore: null, // 本科专业数据状态
    };
  },
  computed: {
    /**
     * 根据用户角色筛选年级列表
     * @returns {Array} 筛选后的年级列表
     */
    gradeList() {
      if (this.userRole === '老师') {
        return this.allGradeList.filter(grade => grade.includes('研'));
      } else {
        return this.allGradeList.filter(grade => grade.includes('大'));
      }
    },
    /**
     * @description 获取过滤后的目标学校列表
     * @returns {Array} 过滤后的目标学校列表
     */
    filteredTargetSchoolList() {
      if (!this.graduateStore) return [];
      return GraduateStore.getters.filteredSchoolList(this.graduateStore);
    },
    
    /**
     * @description 获取过滤后的目标专业列表
     * @returns {Array} 过滤后的目标专业列表
     */
    filteredTargetMajorList() {
      if (!this.graduateStore) return [];
      return GraduateStore.getters.filteredMajorList(this.graduateStore);
    },

    /**
     * @description 获取过滤后的本科学校列表
     * @returns {Array} 过滤后的本科学校列表
     */
    filteredSchoolList() {
      if (!this.schoolStore) return [];
      return this.schoolStore.getters.filteredData(this.schoolStore.state);
    }
  },
  methods: {
    /**
     * @description 初始化学校和专业搜索引擎
     */
    initSchoolAndMajorSearch() {
      // 初始化本科学校数据状态
      this.schoolStore = createDataModule(schoolData);
      
      // 初始化本科专业数据状态
      this.majorStore = createDataModule(majorData);
      
      // 初始化搜索引擎
      this.schoolStore.actions.initSearch({
        commit: (mutation, payload) => {
          this.schoolStore.mutations[mutation](this.schoolStore.state, payload);
        }
      });
      
      this.majorStore.actions.initSearch({
        commit: (mutation, payload) => {
          this.majorStore.mutations[mutation](this.majorStore.state, payload);
        }
      });
      
      // 初始填充数据
      this.schoolList = this.schoolStore.getters.filteredData(this.schoolStore.state);
      this.majorList = this.majorStore.getters.filteredData(this.majorStore.state);
    },

    /**
     * @description 处理学校选择
     * @param {Number} index - 选择的索引
     * @param {String} school - 选择的学校名称
     */
    handleSchoolSelect(index, school) {
      this.formData.schoolIndex = index;
    },

    /**
     * @description 处理专业选择
     * @param {Number} index - 选择的索引
     * @param {String} major - 选择的专业名称
     */
    handleMajorSelect(index, major) {
      this.formData.majorIndex = index;
    },

    /**
     * @description 处理目标学校选择 - 级联选择的父项
     * @param {Number} index - 选择的索引
     * @param {String} school - 选择的学校名称
     */
    handleTargetSchoolSelect(index, school) {
      this.formData.targetSchoolIndex = index;
      this.formData.targetSchool = school;
      
      // 更新专业列表的依赖值
      GraduateStore.actions.selectSchool({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }, school);
      
      // 重置专业选择
      this.resetMajorSelection();
    },

    /**
     * @description 处理目标专业选择 - 级联选择的子项
     * @param {Number} index - 选择的索引
     * @param {String} major - 选择的专业名称
     */
    handleTargetMajorSelect(index, major) {
      this.formData.targetMajorIndex = index;
      this.formData.targetMajor = major;
    },

    /**
     * @description 处理年级选择
     * @param {Number} index - 选择的索引
     */
    handleGradeSelect(index) {
      this.formData.gradeIndex = index;
    },
    
    /**
     * @description 处理学校搜索输入 - 使用本科学校搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleSchoolSearch(keyword) {
      // 更新学校搜索关键词
      this.schoolStore.actions.updateFilterKeyword({
        commit: (mutation, payload) => {
          this.schoolStore.mutations[mutation](this.schoolStore.state, payload);
        }
      }, keyword);
      
      // 获取过滤结果
      this.schoolList = this.schoolStore.getters.filteredData(this.schoolStore.state);
      
      // 调试信息
      console.log(`学校搜索: "${keyword}", 结果数: ${this.schoolList.length}`);
    },
    
    /**
     * @description 处理专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleMajorSearch(keyword) {
      // 更新专业搜索关键词
      this.majorStore.actions.updateFilterKeyword({
        commit: (mutation, payload) => {
          this.majorStore.mutations[mutation](this.majorStore.state, payload);
        }
      }, keyword);
      
      // 获取过滤结果
      this.majorList = this.majorStore.getters.filteredData(this.majorStore.state);
      
      // 调试信息
      console.log(`专业搜索: "${keyword}", 结果数: ${this.majorList.length}`);
    },
    
    /**
     * @description 处理目标学校搜索输入 - 使用研究生学校搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleTargetSchoolSearch(keyword) {
      console.log('处理学校搜索:', keyword);
      
      // 特殊处理: 如果关键词为空，显示所有学校（但限制数量）
      if (!keyword || keyword.trim() === '') {
        const allSchools = Object.keys(this.graduateStore.schools).slice(0, 50);
        this.targetSchoolList = allSchools;
        console.log('关键词为空，显示前50所学校');
        return;
      }
      
      // 确保搜索引擎已初始化
      if (!this.graduateStore.schoolFuse) {
        console.warn('Fuse搜索引擎未初始化，强制重新初始化中...');
        // 强制重新初始化搜索引擎，确保搜索质量
        GraduateStore.actions.reinitializeSearch({
          commit: (mutation, payload) => {
            GraduateStore.mutations[mutation](this.graduateStore, payload);
          },
          state: this.graduateStore
        });
      }
      
      // 更新学校搜索关键词
      GraduateStore.mutations.setSchoolKeyword(this.graduateStore, keyword);
      
      // 手动获取过滤结果并更新列表
      const filteredSchools = GraduateStore.getters.filteredSchoolList(this.graduateStore);
      console.log('过滤后的学校列表:', filteredSchools);
      
      // 直接更新目标学校列表，不依赖watch
      this.targetSchoolList = filteredSchools;
      
      // 强制刷新组件
      this.$nextTick(() => {
        // 记录结果数量
        console.log(`最终显示学校数量: ${filteredSchools.length}`);
        
        // 确保下拉框组件刷新
        if (this.$refs.targetSchoolDropdown) {
          this.$refs.targetSchoolDropdown.$forceUpdate();
        }
      });
    },
    
    /**
     * @description 处理目标专业搜索输入 - 使用研究生专业搜索引擎
     * @param {String} keyword - 搜索关键词
     */
    handleTargetMajorSearch(keyword) {
      console.log('处理专业搜索:', keyword);
      
      // 确保当前有选中的学校
      if (!this.graduateStore.selectedSchool) {
        console.warn('未选择学校，专业搜索无效');
        return;
      }
      
      // 如果关键词为空，显示所有专业（但限制数量）
      if (!keyword || keyword.trim() === '') {
        const allMajors = this.graduateStore.schools[this.graduateStore.selectedSchool] || [];
        this.targetMajorList = allMajors.slice(0, 20); // 限制初始显示数量
        console.log('关键词为空，显示前20个专业');
        return;
      }
      
      // 确保专业搜索引擎已初始化
      if (!this.graduateStore.majorFuse) {
        console.warn('专业搜索引擎未初始化，重新初始化中...');
        // 重新初始化当前学校的专业搜索引擎
        GraduateStore.mutations.setSelectedSchool(this.graduateStore, this.graduateStore.selectedSchool);
      }
      
      // 更新专业搜索关键词
      GraduateStore.mutations.setMajorKeyword(this.graduateStore, keyword);
      
      // 手动获取过滤结果并更新列表
      const filteredMajors = GraduateStore.getters.filteredMajorList(this.graduateStore);
      console.log('过滤后的专业列表:', filteredMajors);
      
      // 直接更新目标专业列表，不依赖watch
      this.targetMajorList = filteredMajors;
      
      // 强制刷新组件
      this.$nextTick(() => {
        // 记录结果数量
        console.log(`最终显示专业数量: ${filteredMajors.length}`);
        
        // 确保下拉框组件刷新
        if (this.$refs.targetMajorDropdown) {
          this.$refs.targetMajorDropdown.$forceUpdate();
        }
      });
    },
    
    /**
     * @description 关闭所有下拉框
     */
    closeAllDropdowns() {
      const dropdowns = ['schoolDropdown', 'majorDropdown', 'targetSchoolDropdown', 'targetMajorDropdown'];
      dropdowns.forEach(dropdown => {
        if (this.$refs && this.$refs[dropdown]) {
          this.$refs[dropdown].closeDropdown && this.$refs[dropdown].closeDropdown();
        }
      });
    },
    
    /**
     * @description 获取当前用户角色
     * @returns {string} 用户角色
     */
    getUserRole() {
      try {
        // 优先从store获取
        if (store.state && store.state.user && store.state.user.baseInfo) {
          return store.state.user.baseInfo.userInfo.role;
        }
        
        // 从本地存储中获取备份
        const localRole = uni.getStorageSync('userRole');
        // 将存储的角色代码转换为显示名称
        if (localRole === 'teacher') {
          return '老师';
        } else if (localRole === 'student') {
          return '学生';
        } else {
          return '学生'; // 默认为学生角色
        }
      } catch (error) {
        console.error('获取用户角色出错:', error);
        return '学生'; // 默认返回学生角色
      }
    },

    /**
     * @description 加载大学数据
     */
    loadUniversityData() {
      try {
        // 初始化考研数据（目标学校和专业）
        this.initGraduateData(); 
        
        console.log('成功加载学校数据');
      } catch (error) {
        console.error('加载大学数据失败:', error);
        
        // 设置默认学校列表
        const defaultSchools = ["北京大学", "清华大学", "复旦大学"];
        
        // 设置普通学校列表（就读学校）
        this.schoolList = defaultSchools;
        
        // 设置目标学校列表（考研学校）
        this.targetSchoolList = defaultSchools;
        
        uni.showToast({
          title: '加载大学数据失败，使用默认列表',
          icon: 'none'
        });
      }
    },
    
    /**
     * @description 关闭协议确认浮窗
     */
    closeModal() {
      this.showAgreementModal = false;
      this.pendingUserInfo = null;
    },
    
    /**
     * @description 确认同意协议并提交信息
     */
    confirmAgreement() {
      if (this.pendingUserInfo) {
        // 使用导入的store实例更新用户信息
        store.commit('user/baseInfo/UPDATE_USER_INFO', this.pendingUserInfo);
        
        // 提示成功
        uni.showToast({
          title: '信息保存成功',
          icon: 'success'
        });
        
        // 关闭浮窗
        this.showAgreementModal = false;
        
        // 跳转到下一个页面
        setTimeout(() => {
          Navigator.toMine();
        }, 1500);
      }
    },
    
    /**
     * @description 提交表单信息
     */
    submitForm() {
      try {
        // 获取当前角色
        const currentRole = this.getUserRole();
        // 转换为角色代码用于存储
        const roleCode = currentRole === '老师' ? 'teacher' : 'student';
        
        // 构建用户信息对象
        const userInfo = {
          name: this.formData.nickname || '',
          gender: this.formData.gender || '',
          phoneNumber: this.formData.phone || '',
          role: roleCode, // 使用角色代码
          userInfo: {
            school: this.formData.schoolIndex >= 0 ? this.schoolList[this.formData.schoolIndex] : '',
            major: this.formData.majorIndex >= 0 ? this.majorList[this.formData.majorIndex] : '',
            studentGrade: (currentRole === '学生' && this.formData.gradeIndex >= 0) ? this.gradeList[this.formData.gradeIndex] : '',
            teacherGrade: (currentRole === '老师' && this.formData.gradeIndex >= 0) ? this.gradeList[this.formData.gradeIndex] : '',
          }
        };
        
        // 如果是学生角色，添加目标学校和目标专业
        if (currentRole === '学生') {
          // 使用保存的目标学校和专业值，而不是通过索引获取
          userInfo.userInfo.targetSchool = this.formData.targetSchool || '';
          userInfo.userInfo.targetMajor = this.formData.targetMajor || '';
        }
        
        // 如果是老师角色，显示协议确认浮窗
        if (currentRole === '老师') {
          this.pendingUserInfo = userInfo; // 暂存用户信息
          this.showAgreementModal = true; // 显示协议浮窗
          return; // 终止后续处理，等待用户确认
        }
        
        // 学生角色直接提交信息
        store.commit('user/baseInfo/UPDATE_USER_INFO', userInfo);
        
        // 提示成功
        uni.showToast({
          title: '信息保存成功',
          icon: 'success'
        });
        
        // 跳转到下一个页面
        setTimeout(() => {
          Navigator.toMine();
        }, 1500);
      } catch (error) {
        console.error('提交表单时出错:', error);
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    },

    /**
     * @description 验证表单内容 - 所有字段均为选填，无需验证
     * @returns {boolean} 验证是否通过
     */
    validateForm() {
      // 所有字段均为选填，直接返回true
      return true;
    },

    /**
     * @description 初始化考研数据
     */
    initGraduateData() {
      try {
        // 初始化研究生数据状态 - 使用深拷贝确保数据完整性
        this.graduateStore = JSON.parse(JSON.stringify(GraduateStore.state));
        
        // 确保数据结构完整
        if (!this.graduateStore.schools) {
          console.error('研究生学校数据不完整');
          throw new Error('学校数据结构不完整');
        }
        
        // 使用优化的搜索引擎配置初始化
        GraduateStore.mutations.initSchoolFuse(this.graduateStore);
        console.log('Fuse引擎初始化状态:', !!this.graduateStore.schoolFuse);
        
        // 验证搜索引擎配置
        if (this.graduateStore.schoolFuse) {
          console.log('Fuse配置验证:', {
            keys: this.graduateStore.schoolFuse._docs[0] ? Object.keys(this.graduateStore.schoolFuse._docs[0]) : '未知',
            ignoreLocation: this.graduateStore.schoolFuse.options.ignoreLocation,
            threshold: this.graduateStore.schoolFuse.options.threshold
          });
        } else {
          console.error('Fuse.js搜索引擎初始化失败');
        }
        
        // 设置目标学校列表初始值 - 仅用于目标学校下拉框
        const graduateSchools = Object.keys(this.graduateStore.schools).slice(0, 50); // 初始只显示前50所
        this.targetSchoolList = graduateSchools;
        
        console.log('初始化考研数据成功');
        return true;
      } catch (error) {
        console.error('初始化考研数据失败:', error);
        
        // 设置默认数据
        const defaultSchools = ["北京大学", "清华大学", "复旦大学"];
        this.targetSchoolList = defaultSchools;
        return false;
      }
    },
    
    /**
     * @description 处理学校变更事件
     * @param {String} school - 变更后的学校名称
     */
    handleSchoolChange(school) {
      console.log('学校变更事件:', school);
      
      if (!school) {
        // 学校被清空，重置专业选择
        this.resetMajorSelection();
        return;
      }
      
      // 在选择新学校后，立即更新专业搜索实例
      GraduateStore.actions.selectSchool({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }, school);
      
      // 更新目标专业列表
      if (this.graduateStore.schools[school]) {
        this.targetMajorList = this.graduateStore.schools[school].slice(0, 30); // 初始显示前30个专业
        console.log(`已加载 ${school} 的专业列表，共 ${this.targetMajorList.length} 个`);
      } else {
        this.resetMajorSelection();
        console.warn(`${school} 没有关联的专业数据`);
      }
    },
    
    /**
     * @description 重置专业选择
     */
    resetMajorSelection() {
      this.formData.targetMajorIndex = -1;
      this.formData.targetMajor = '';
    }
  },
  created() {
    // 初始化用户角色
    this.userRole = this.getUserRole();
    console.log('当前用户角色:', this.userRole);
  },
  // 监听页面显示时更新角色
  onShow() {
    const newRole = this.getUserRole();
    // 如果角色发生变化，重置年级选择
    if (this.userRole !== newRole) {
      this.userRole = newRole;
      this.formData.gradeIndex = -1; // 重置年级选择
    }
    
    // 每次显示页面时强制重新初始化搜索引擎，确保搜索功能正常工作
    if (this.graduateStore) {
      // 使用强制重新初始化搜索方法
      GraduateStore.actions.reinitializeSearch({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        },
        state: this.graduateStore
      });
      
      console.log('Fuse引擎强制重新初始化完成，状态:', !!this.graduateStore.schoolFuse);
      
      // 验证搜索引擎配置
      if (this.graduateStore.schoolFuse) {
        console.log('重新初始化后的Fuse配置:', {
          threshold: this.graduateStore.schoolFuse.options.threshold,
          ignoreLocation: this.graduateStore.schoolFuse.options.ignoreLocation,
          items: this.graduateStore.schoolFuse._docs.length
        });
      }
    }
    
    // 重新初始化本科学校和专业搜索引擎
    if (this.schoolStore && this.majorStore) {
      this.initSchoolAndMajorSearch();
    }
  },
  watch: {
    // 不再需要监听filteredSchoolList计算属性
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  padding: 30rpx;
}

.form-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.form-notice {
  background-color: #f8f8f8;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.notice-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.label-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15rpx;
}

.form-row {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.optional-tag {
  font-size: 24rpx;
  color: #999;
  margin-left: 10rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #e0e0e0;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.radio-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.radio-option {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 30px;
  margin-left: 30px;
}

.option-text {
  margin-left: 8px;
  font-size: 28rpx;
  color: #333;
}

.form-select {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8rpx;
  box-sizing: border-box;
}

.button-container {
  margin-top: 50rpx;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  background-color: #007AFF;
  color: #fff;
  font-size: 32rpx;
  border-radius: 45rpx;
}

/* 协议浮窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  width: 80%;
  max-height: 70vh;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-title {
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  padding: 30rpx 0;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.modal-body {
  padding: 30rpx;
  flex: 1;
  overflow-y: auto;
}

.agreement-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.agreement-item {
  margin-bottom: 20rpx;
}

.modal-footer {
  padding: 20rpx 30rpx 40rpx;
  border-top: 1px solid #f0f0f0;
}

.agree-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #007AFF;
  color: #fff;
  font-size: 30rpx;
  border-radius: 40rpx;
  border: none;
}
</style>