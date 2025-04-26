<template>
  <view class="form-container">
    <!-- 表单内容 -->
    <view class="form-card">
      <!-- Nickname -->
      <view class="form-row">
        <text class="form-label">昵称</text>
        <input class="form-input" type="text" v-model="formData.nickname" placeholder="请输入昵称" />
      </view>
      
      <!-- Gender -->
      <view class="form-row">
        <text class="form-label">性别</text>
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
        <text class="form-label">手机号</text>
        <input class="form-input" type="text" v-model="formData.phone" placeholder="请输入手机号" />
      </view>
      
      <!-- School -->
      <view class="form-row">
        <text class="form-label">就读学校</text>
        <ChoiceSelected
          class="form-select"
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
      
      <!-- Major -->
      <view class="form-row">
        <text class="form-label">就读专业</text>
        <ChoiceSelected
          class="form-select"
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


      <!-- Grade -->
      <view class="form-row">
        <text class="form-label">年级</text>
        <ChoiceSelected
          class="form-select"
          :choiceIndex="formData.gradeIndex"
          :choiceList="gradeList"
          defaultText="请选择年级"
          mode="select"
          @onChoiceClick="handleGradeSelect"
        />
      </view>
      
      <!-- 学生特有字段：目标学校和目标专业 -->
      <block v-if="userRole === '学生'">
          <!-- Target School - 仅学生显示 -->
          <view class="form-row">
            <text class="form-label">目标学校</text>
            <ChoiceSelected
              class="form-select"
              componentType="graduateSchool"
              :choiceIndex="formData.targetSchoolIndex"
              :choiceList="targetSchoolList"
              defaultText="请选择目标学校"
              mode="search"
              searchPlaceholder="输入目标学校名称"
              @onChoiceClick="handleTargetSchoolSelect"
              @search-input="handleTargetSchoolSearch"
              @linkage-change="handleSchoolChange"
              :enablePagination="true"
              :pageSize="10"
              ref="targetSchoolDropdown"
            />
          </view>
          
          <!-- Target Major - 仅学生显示 -->
          <view class="form-row">
            <text class="form-label">目标专业</text>
            <ChoiceSelected
              class="form-select"
              componentType="graduateMajor"
              :choiceIndex="formData.targetMajorIndex"
              :choiceList="targetMajorList"
              :parentValue="formData.targetSchool"
              :isLinkage="true"
              :defaultText="formData.targetSchool ? '请选择专业' : '请先选择学校'"
              mode="search"
              searchPlaceholder="输入目标专业名称"
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

export default {
  components: {
    ChoiceSelected,
  },
  onLoad() {
    this.loadUniversityData();
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
        targetMajor: '', // 添加目标专业字段
      },
      schoolList: [], // 普通学校列表
      majorList: [], // 普通专业列表
      targetSchoolList: [], // 目标学校列表（考研）
      targetMajorList: [], // 目标专业列表（考研）
      // 存储原始完整的学校和专业列表，用于搜索恢复
      originalSchoolList: [],
      originalMajorList: [
        '计算机科学',
        '电子工程',
        '机械工程',
        '经济学',
        '法学',
      ],
      allGradeList: ['大一', '大二', '大三', '大四', '研一', '研二', '研三'],
      userRole: '学生',  // 默认值为学生
      showAgreementModal: false, // 控制协议浮窗显示
      pendingUserInfo: null, // 暂存待提交的用户信息
      graduateStore: {
        schools: {},
        schoolKeyword: '',
        selectedSchool: '',
        majorKeyword: ''
      }
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
      return GraduateStore.getters.filteredSchoolList(this.graduateStore);
    },
    
    /**
     * @description 获取过滤后的目标专业列表
     * @returns {Array} 过滤后的目标专业列表
     */
    filteredTargetMajorList() {
      return GraduateStore.getters.filteredMajorList(this.graduateStore);
    }
  },
  methods: {
    handleSchoolSelect(index) {
      this.formData.schoolIndex = index;
    },
    handleMajorSelect(index) {
      this.formData.majorIndex = index;
    },
    handleTargetSchoolSelect(index, school) {
      this.formData.targetSchoolIndex = index;
      this.formData.targetSchool = school;
      
      // 更新专业列表的依赖值
      GraduateStore.actions.updateSelectedSchool({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }, school);
      
      // 重置专业选择
      this.resetMajorSelection();
    },
    handleTargetMajorSelect(index, major) {
      this.formData.targetMajorIndex = index;
      this.formData.targetMajor = major;
    },
    handleGradeSelect(index) {
      this.formData.gradeIndex = index;
    },
    
    /**
     * @description 处理学校搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleSchoolSearch(keyword) {
      // 创建一个临时的state对象，用于复用GraduateStore的筛选逻辑
      const tempState = {
        schools: {},
        schoolKeyword: keyword,
        selectedSchool: '',
        majorKeyword: ''
      };
      
      // 将originalSchoolList转换为符合schools结构的对象
      this.originalSchoolList.forEach(school => {
        tempState.schools[school] = [];
      });
      
      // 使用GraduateStore的筛选逻辑
      if (keyword === '') {
        this.schoolList = [...this.originalSchoolList];
      } else {
        this.schoolList = GraduateStore.getters.filteredSchoolList(tempState);
      }
    },
    
    /**
     * @description 处理专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleMajorSearch(keyword) {
      // 创建一个临时的state对象，用于复用GraduateStore的筛选逻辑
      const tempState = {
        schools: { 'tempSchool': this.originalMajorList },
        schoolKeyword: '',
        selectedSchool: 'tempSchool',
        majorKeyword: keyword
      };
      
      // 使用GraduateStore的筛选逻辑
      if (keyword === '') {
        this.majorList = [...this.originalMajorList];
      } else {
        this.majorList = GraduateStore.getters.filteredMajorList(tempState);
      }
    },
    
    /**
     * @description 处理目标学校搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleTargetSchoolSearch(keyword) {
      // 更新学校搜索关键词
      GraduateStore.actions.updateSchoolKeyword({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }, keyword);
    },
    
    /**
     * @description 处理目标专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleTargetMajorSearch(keyword) {
      // 更新专业搜索关键词
      GraduateStore.actions.updateMajorKeyword({
        commit: (mutation, payload) => {
          GraduateStore.mutations[mutation](this.graduateStore, payload);
        }
      }, keyword);
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
     * 获取当前用户角色
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
     * 加载大学数据
     */
    loadUniversityData() {
      try {
        // 初始化考研数据（目标学校和专业）
        this.initGraduateData(); 
        
        // 普通学校列表（就读学校）- 使用相同的数据源
        if (!this.originalSchoolList || this.originalSchoolList.length === 0) {
          this.schoolList = [...this.targetSchoolList];
          this.originalSchoolList = [...this.targetSchoolList];
        }
        
        console.log('成功加载学校数据，普通学校:', this.schoolList.length, '所，目标学校:', this.targetSchoolList.length, '所');
      } catch (error) {
        console.error('加载大学数据失败:', error);
        
        // 设置默认学校列表
        const defaultSchools = ["北京大学", "清华大学", "复旦大学"];
        
        // 设置普通学校列表（就读学校）
        this.schoolList = defaultSchools;
        this.originalSchoolList = [...defaultSchools];
        
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
      // 验证表单内容
      if (!this.validateForm()) {
        return;
      }
      
      try {
        // 获取当前角色
        const currentRole = this.getUserRole();
        // 转换为角色代码用于存储
        const roleCode = currentRole === '老师' ? 'teacher' : 'student';
        
        // 构建用户信息对象
        const userInfo = {
          name: this.formData.nickname,
          gender: this.formData.gender,
          phoneNumber: this.formData.phone,
          role: roleCode, // 使用角色代码
          userInfo: {
            school: this.schoolList[this.formData.schoolIndex] || '',
            major: this.majorList[this.formData.majorIndex] || '',
            studentGrade: currentRole === '学生' ? this.gradeList[this.formData.gradeIndex] || '' : '',
            teacherGrade: currentRole === '老师' ? this.gradeList[this.formData.gradeIndex] || '' : '',
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
     * 验证表单内容
     * @returns {boolean} 验证是否通过
     */
    validateForm() {
      if (!this.formData.nickname) {
        uni.showToast({
          title: '请输入昵称',
          icon: 'none'
        });
        return false;
      }
      if (!this.formData.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return false;
      }
      if (this.formData.schoolIndex === -1) {
        uni.showToast({
          title: '请选择学校',
          icon: 'none'
        });
        return false;
      }
      if (this.formData.majorIndex === -1) {
        uni.showToast({
          title: '请选择专业',
          icon: 'none'
        });
        return false;
      }
      
      // 学生角色时验证目标学校和目标专业
      if (this.userRole === '学生') {
        if (this.formData.targetSchoolIndex === -1) {
          uni.showToast({
            title: '请选择目标学校',
            icon: 'none'
          });
          return false;
        }
        if (this.formData.targetMajorIndex === -1) {
          uni.showToast({
            title: '请选择目标专业',
            icon: 'none'
          });
          return false;
        }
      }
      
      if (this.formData.gradeIndex === -1) {
        uni.showToast({
          title: '请选择年级',
          icon: 'none'
        });
        return false;
      }
      return true;
    },
    /**
     * @description 初始化考研数据
     */
    initGraduateData() {
      try {
        // 从GraduateStore初始化数据
        this.graduateStore = JSON.parse(JSON.stringify(GraduateStore.state));
        
        // 设置目标学校列表 - 仅用于目标学校下拉框
        const graduateSchools = Object.keys(this.graduateStore.schools);
        this.targetSchoolList = graduateSchools;
        
        console.log('初始化考研数据成功，学校数量:', graduateSchools.length);
        return graduateSchools;
      } catch (error) {
        console.error('初始化考研数据失败:', error);
        
        // 设置默认数据
        const defaultSchools = ["北京大学", "清华大学", "复旦大学"];
        this.targetSchoolList = defaultSchools;
        return defaultSchools;
      }
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
  },
  watch: {
    // 监听过滤后的学校列表变化
    filteredTargetSchoolList: {
      handler(newVal) {
        this.targetSchoolList = newVal;
      },
      immediate: true
    },
    
    // 监听过滤后的专业列表变化
    filteredTargetMajorList: {
      handler(newVal) {
        this.targetMajorList = newVal;
      },
      immediate: true
    }
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

.role-indicator {
  padding: 20rpx 0;
  margin-bottom: 30rpx;
  border-bottom: 1px solid #f0f0f0;
}

.role-text {
  font-size: 30rpx;
  color: #007AFF;
  font-weight: bold;
}

.form-row {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
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