/**
 * 用户基本信息模块的模拟数据
 * @module store/user/baseInfo/mock-data
 */

// 模拟用户ID
export const MOCK_USER_ID = '123456';

/**
 * 模拟用户数据
 * @type {Array<Object>}
 */
export const mockUsers = [
  {
    id: '123456',
    username: 'zhangsan',
    password: '123456',
    avatar: '/static/image/tab-bar/default_avatar.png',
    nickname: '张三',
    name: '张三',
    gender: '男',
    introduction: '我是一个热爱学习的学生',
    selfIntroduction: '我是一个热爱学习的学生',
    wechat: 'zhangsan123',
    wechatNumber: 'zhangsan123',
    phone: '13800138000',
    phoneNumber: '13800138000',
    role: 'student',
    userInfo: {
      certificate: 1, // 是否认证，0为未认证，1为已认证
      role: '学生', // 学生或老师
      school: '北京大学', // 学校
      major: '计算机科学', // 专业
      targetSchool: '清华大学', // 目标学校
      targetMajor: '软件工程', // 目标专业
      studentGrade: '大三', // 学生年级
      teacherGrade: '', // 老师年级
      teacherScore: 0, // 老师考研成绩
    }
  },
  {
    id: '654321',
    username: 'lisi',
    password: '654321',
    avatar: '/static/image/tab-bar/default_avatar.png',
    nickname: '李四',
    name: '李四',
    gender: '女',
    introduction: '我是一个有经验的考研辅导老师',
    selfIntroduction: '我是一个有经验的考研辅导老师',
    wechat: 'lisi456',
    wechatNumber: 'lisi456',
    phone: '13900139000',
    phoneNumber: '13900139000',
    role: 'teacher',
    userInfo: {
      certificate: 1,
      role: '老师',
      school: '清华大学',
      major: '软件工程',
      targetSchool: '',
      targetMajor: '',
      studentGrade: '',
      teacherGrade: '研一',
      teacherScore: 380,
    }
  }
];

/**
 * 模拟默认用户信息（用于在没有登录时显示）
 * @type {Object}
 */
export const DEFAULT_USER_INFO = {
  id: '',
  avatar: '/static/image/tab-bar/default_avatar.png',
  nickname: '游客',
  name: '游客',
  gender: '',
  introduction: '',
  selfIntroduction: '',
  wechat: '',
  wechatNumber: '',
  phone: '',
  phoneNumber: '',
  role: 'student',
  userInfo: {
    certificate: 0,
    role: '学生',
    school: '',
    major: '',
    targetSchool: '',
    targetMajor: '',
    studentGrade: '',
    teacherGrade: '',
    teacherScore: 0,
  }
};

/**
 * 生成模拟API响应格式
 * @param {boolean} success - 是否成功
 * @param {Object} data - 返回数据
 * @param {Object} error - 错误信息，当success为false时使用
 * @returns {Object} 标准API响应格式
 */
export const mockApiResponse = (success, data, error = null) => {
  if (success) {
    return {
      success: true,
      data: data
    };
  } else {
    return {
      success: false,
      error: error || {
        message: '请求失败'
      }
    };
  }
};

/**
 * 模拟延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); 