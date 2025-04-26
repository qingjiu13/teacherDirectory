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
            :choiceIndex="formData.targetSchoolIndex"
            :choiceList="schoolList"
            defaultText="请选择目标学校"
            mode="search"
            searchPlaceholder="输入目标学校名称"
            @onChoiceClick="handleTargetSchoolSelect"
            @search-input="handleTargetSchoolSearch"
            ref="targetSchoolDropdown"
          />
        </view>
        
        <!-- Target Major - 仅学生显示 -->
        <view class="form-row">
          <text class="form-label">目标专业</text>
          <ChoiceSelected
            class="form-select"
            :choiceIndex="formData.targetMajorIndex"
            :choiceList="majorList"
            defaultText="请选择目标专业"
            mode="search"
            searchPlaceholder="输入目标专业名称"
            @onChoiceClick="handleTargetMajorSelect"
            @search-input="handleTargetMajorSearch"
            ref="targetMajorDropdown"
          />
        </view>
      </block>
      

      
      <!-- 按钮区域 -->
      <view class="button-container">
        <button class="submit-btn" @click="submitForm">提交信息</button>
      </view>
    </view>
  </view>
</template>

<script>
import ChoiceSelected from '../../components/combobox/combobox'
import store from '../../store'
import { Navigator } from '../../router/Router';
import universityData from '../../store/data/2886所大学.json'

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
        gradeIndex: -1
      },
      schoolList: [],
      majorList: [
        '计算机科学',
        '电子工程',
        '机械工程',
        '经济学',
        '法学',
      ],
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
      userRole: ''  // 默认空值
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
    }
  },
  methods: {
    handleSchoolSelect(index) {
      this.formData.schoolIndex = index;
    },
    handleMajorSelect(index) {
      this.formData.majorIndex = index;
    },
    handleTargetSchoolSelect(index) {
      this.formData.targetSchoolIndex = index;
    },
    handleTargetMajorSelect(index) {
      this.formData.targetMajorIndex = index;
    },
    handleGradeSelect(index) {
      this.formData.gradeIndex = index;
    },
    
    /**
     * @description 处理学校搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleSchoolSearch(keyword) {
      if (keyword === '') {
        // 如果关键词为空，恢复原始列表
        this.schoolList = [...this.originalSchoolList];
        return;
      }
      
      // 根据关键词过滤学校列表
      this.schoolList = this.originalSchoolList.filter(
        school => school.toLowerCase().includes(keyword.toLowerCase())
      );
    },
    
    /**
     * @description 处理专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleMajorSearch(keyword) {
      if (keyword === '') {
        // 如果关键词为空，恢复原始列表
        this.majorList = [...this.originalMajorList];
        return;
      }
      
      // 根据关键词过滤专业列表
      this.majorList = this.originalMajorList.filter(
        major => major.toLowerCase().includes(keyword.toLowerCase())
      );
    },
    
    /**
     * @description 处理目标学校搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleTargetSchoolSearch(keyword) {
      if (keyword === '') {
        // 如果关键词为空，恢复原始列表
        this.schoolList = [...this.originalSchoolList];
        return;
      }
      
      // 根据关键词过滤学校列表
      this.schoolList = this.originalSchoolList.filter(
        school => school.toLowerCase().includes(keyword.toLowerCase())
      );
    },
    
    /**
     * @description 处理目标专业搜索输入
     * @param {String} keyword - 搜索关键词
     */
    handleTargetMajorSearch(keyword) {
      if (keyword === '') {
        // 如果关键词为空，恢复原始列表
        this.majorList = [...this.originalMajorList];
        return;
      }
      
      // 根据关键词过滤专业列表
      this.majorList = this.originalMajorList.filter(
        major => major.toLowerCase().includes(keyword.toLowerCase())
      );
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
					// 直接使用大学数据字符串数组，不再创建对象
					this.schoolList = universityData;
					// 保存一份原始数据用于搜索后恢复
					this.originalSchoolList = [...universityData];
					console.log('成功加载', this.schoolList.length, '所大学数据');
				} catch (error) {
					console.error('加载大学数据失败:', error);
					// 设置一个默认的学校列表，以防加载失败
					this.schoolList = ["北京大学", "清华大学", "复旦大学"];
					this.originalSchoolList = ["北京大学", "清华大学", "复旦大学"];
					this.showToast('加载大学数据失败，使用默认列表');
				}
			},
    /**
     * 提交表单信息
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
          userInfo.userInfo.targetSchool = this.schoolList[this.formData.targetSchoolIndex] || '';
          userInfo.userInfo.targetMajor = this.majorList[this.formData.targetMajorIndex] || '';
        }
        
        // 使用导入的store实例更新用户信息
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
</style>