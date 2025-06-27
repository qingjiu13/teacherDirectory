import { useGlobalStore } from '@/store/global.js';
import { apiRequest } from '@/store/user/JWT';

/**
 * @description 获取API前缀
 * @returns {string} API基础URL
 */
const getApiPrefix = () => {
    const globalStore = useGlobalStore()
    return globalStore.apiBaseUrl
}

/**
 * @description 提交用户信息数据
 * @param {Object} params - 提交参数
 * @param {string} params.userRole - 用户角色（'老师' 或 '学生'）
 * @param {Object} params.userInfo - 用户信息对象
 * @param {boolean} params.isSkip - 是否跳过（默认false）
 * @returns {Promise} API请求Promise
 */
export const submitUserInfo = async ({ userRole, userInfo, isSkip = false }) => {
  try {
    const apiPrefix = getApiPrefix();
    
    // 根据用户角色确定接口路径和数据格式
    let apiPath = '';
    let submitData = {};
    
    if (userRole === '老师') {
      apiPath = '/yanshilu/teacher/save';
      
      if (isSkip) {
        // 跳过时所有字段传null
        submitData = {
          schoolId: null,
          professionalId: null,
          gradeType: null
        };
      } else {
        // 提交时按表单数据传输
        submitData = {
          schoolId: userInfo.targetSchoolId || null,
          professionalId: userInfo.targetMajorId || null,
          gradeType: userInfo.gradeType || null
        };
      }
    } else if (userRole === '学生') {
      apiPath = '/yanshilu/student/save';
      
      if (isSkip) {
        // 跳过时所有字段传null
        submitData = {
          targetSchoolId: null,
          targetProfessionalId: null,
          currentSchoolId: null,
          currentProfessionalId: null,
          gradeType: null
        };
      } else {
        // 提交时按表单数据传输
        submitData = {
          targetSchoolId: userInfo.targetSchoolId || null,
          targetProfessionalId: userInfo.targetMajorId || null,
          currentSchoolId: userInfo.schoolId || null,
          currentProfessionalId: userInfo.majorId || null,
          gradeType: userInfo.gradeType || null
        };
      }
    } else {
      throw new Error('无效的用户角色');
    }
    
    // 发起API请求
    const response = await apiRequest(`${apiPrefix}${apiPath}`,'POST',submitData);
    
    // 检查响应状态
    if (response.data.code === 200) {
      return {
        success: true,
        message: response.data.msg,
        data: response.data
      };
    } else {
      return {
        success: false,
        message: response.data.msg || '提交失败',
        data: response.data
      };
    }
    
  } catch (error) {
    console.error('提交用户信息失败:', error);
    return {
      success: false,
      message: error.message || '网络请求失败',
      error: error
    };
  }
};

