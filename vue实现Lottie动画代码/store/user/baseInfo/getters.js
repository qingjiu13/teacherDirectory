/**
 * baseInfo模块的getters
 * @module store/user/baseInfo/getters
 */

export default {
    /**
     * @description 获取用户ID
     * @param {Object} state - 当前状态
     * @returns {string} 用户ID
     */
    userId: (state) => state.id,
    
    /**
     * @description 获取用户头像
     * @param {Object} state - 当前状态
     * @returns {string} 用户头像URL
     */
    avatar: (state) => state.avatar,
    
    /**
     * @description 获取用户名称
     * @param {Object} state - 当前状态
     * @returns {string} 用户名称
     */
    name: (state) => state.name,
    
    /**
     * @description 获取用户角色
     * @param {Object} state - 当前状态
     * @returns {string} 用户角色
     */
    userRole: (state) => state.userInfo.role,
    
    /**
     * @description 判断用户是否为教师
     * @param {Object} state - 当前状态
     * @returns {boolean} 是否为教师
     */
    isTeacher: (state) => state.userInfo.role === '老师',
    
    /**
     * @description 获取用户性别
     * @param {Object} state - 当前状态
     * @returns {string} 用户性别
     */
    gender: (state) => state.gender,
    
    /**
     * @description 获取用户自我介绍
     * @param {Object} state - 当前状态
     * @returns {string} 用户自我介绍
     */
    selfIntroduction: (state) => state.selfIntroduction,
    
    /**
     * @description 获取用户微信号
     * @param {Object} state - 当前状态
     * @returns {string} 用户微信号
     */
    wechatNumber: (state) => state.wechatNumber,
    
    /**
     * @description 获取用户手机号
     * @param {Object} state - 当前状态
     * @returns {string} 用户手机号
     */
    phoneNumber: (state) => state.phoneNumber,
    
    /**
     * @description 获取用户认证状态
     * @param {Object} state - 当前状态
     * @returns {number} 认证状态(0:未认证,1:已认证)
     */
    certificate: (state) => state.userInfo.certificate,
    
    /**
     * @description 获取用户学校
     * @param {Object} state - 当前状态
     * @returns {string} 用户学校
     */
    school: (state) => state.userInfo.school,
    
    /**
     * @description 获取用户专业
     * @param {Object} state - 当前状态
     * @returns {string} 用户专业
     */
    major: (state) => state.userInfo.major,
    
    /**
     * @description 获取完整用户信息（适用于表单展示）
     * @param {Object} state - 当前状态
     * @returns {Object} 完整用户信息对象
     */
    profile: (state) => {
        return {
            id: state.id,
            avatar: state.avatar,
            name: state.name,
            gender: state.gender,
            selfIntroduction: state.selfIntroduction,
            wechatNumber: state.wechatNumber,
            phoneNumber: state.phoneNumber,
            password: state.password,
            userInfo: {
                role: state.userInfo.role,
                certificate: state.userInfo.certificate,
                school: state.userInfo.school,
                major: state.userInfo.major,
                targetSchool: state.userInfo.targetSchool,
                targetMajor: state.userInfo.targetMajor,
                studentGrade: state.userInfo.studentGrade,
                teacherGrade: state.userInfo.teacherGrade,

            }
        };
    }
}; 