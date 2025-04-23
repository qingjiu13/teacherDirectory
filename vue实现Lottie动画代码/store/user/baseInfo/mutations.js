/**
 * baseInfo模块的mutations
 * @module store/user/baseInfo/mutations
 */

export default {
    /**
     * 更新用户角色
     * @param {Object} state - 当前状态
     * @param {string} role - 新的用户角色（学生或老师）
     */
    updateRole(state, role) {
        // 更新显示的角色名称
        state.userInfo.role = role === 'teacher' ? '老师' : '学生';
        
        // 保存到本地存储以便持久化
        uni.setStorageSync('userBaseInfo', JSON.stringify({
            id: state.id,
            avatar: state.avatar,
            name: state.name,
            gender: state.gender,
            selfIntroduction: state.selfIntroduction,
            wechatNumber: state.wechatNumber,
            phoneNumber: state.phoneNumber,
            role: role // 保存角色代码
        }));
        
        // 同步更新角色到本地存储
        uni.setStorageSync('userRole', role);
    },
    
    /**
     * 设置用户完整信息
     * @param {Object} state - 当前状态
     * @param {Object} userData - 服务器返回的用户信息
     */
    SET_USER_INFO(state, userData) {
        // 更新基本信息
        state.id = userData.id || '';
        state.avatar = userData.avatar || '';
        state.name = userData.nickname || userData.name || '';
        state.gender = userData.gender || '';
        state.selfIntroduction = userData.introduction || userData.selfIntroduction || '';
        state.wechatNumber = userData.wechat || userData.wechatNumber || '';
        state.phoneNumber = userData.phone || userData.phoneNumber || '';
        state.password = userData.password || '';
        
        // 获取角色代码
        const roleCode = userData.role || 'student';
        
        // 更新用户扩展信息
        if (userData.userInfo) {
            state.userInfo = {
                ...state.userInfo,
                ...userData.userInfo
            };
            
            // 确保角色显示值与角色代码一致
            if (!userData.userInfo.role || userData.userInfo.role === roleCode) {
                state.userInfo.role = roleCode === 'teacher' ? '老师' : '学生';
            }
        } else {
            // 如果没有提供 userInfo，仍然更新角色显示值
            state.userInfo.role = roleCode === 'teacher' ? '老师' : '学生';
        }
        
        // 保存到本地存储以便持久化
        uni.setStorageSync('userBaseInfo', JSON.stringify({
            id: state.id,
            avatar: state.avatar,
            name: state.name,
            gender: state.gender,
            selfIntroduction: state.selfIntroduction,
            wechatNumber: state.wechatNumber,
            phoneNumber: state.phoneNumber,
            role: roleCode
        }));
        
        // 同步更新角色到本地存储
        uni.setStorageSync('userRole', roleCode);
    },
    
    /**
     * 更新用户个人信息
     * @param {Object} state - 当前状态
     * @param {Object} userInfo - 用户个人信息对象
     * @param {string} userInfo.avatar - 用户头像
     * @param {string} userInfo.name - 用户姓名
     * @param {string} userInfo.gender - 用户性别
     * @param {string} userInfo.selfIntroduction - 用户自我介绍
     * @param {string} userInfo.wechatNumber - 用户微信号
     * @param {string} userInfo.phoneNumber - 用户手机号
     * @param {string} userInfo.password - 用户密码
     */
    UPDATE_USER_INFO(state, userInfo) {
        const { 
            avatar, 
            name, 
            nickname,
            gender, 
            selfIntroduction,
            introduction, 
            wechatNumber,
            wechat,
            phoneNumber,
            phone,
            password,
            role
        } = userInfo;
        
        // 只更新提供的字段（支持不同字段名）
        if (avatar !== undefined) state.avatar = avatar;
        if (name !== undefined) state.name = name;
        if (nickname !== undefined) state.name = nickname;
        if (gender !== undefined) state.gender = gender;
        if (selfIntroduction !== undefined) state.selfIntroduction = selfIntroduction;
        if (introduction !== undefined) state.selfIntroduction = introduction;
        if (wechatNumber !== undefined) state.wechatNumber = wechatNumber;
        if (wechat !== undefined) state.wechatNumber = wechat;
        if (phoneNumber !== undefined) state.phoneNumber = phoneNumber;
        if (phone !== undefined) state.phoneNumber = phone;
        if (password !== undefined) state.password = password;
        
        // 处理角色更新
        if (role !== undefined) {
            // 更新角色显示值
            state.userInfo.role = role === 'teacher' ? '老师' : '学生';
            // 保存角色代码到本地存储
            uni.setStorageSync('userRole', role);
        }
        
        // 保存到本地存储以便持久化
        uni.setStorageSync('userBaseInfo', JSON.stringify({
            id: state.id,
            avatar: state.avatar,
            name: state.name,
            gender: state.gender,
            selfIntroduction: state.selfIntroduction,
            wechatNumber: state.wechatNumber,
            phoneNumber: state.phoneNumber,
            role: uni.getStorageSync('userRole') || 'student'
        }));
    },
    
    /**
     * 清除用户信息（用于登出）
     * @param {Object} state - 当前状态
     */
    CLEAR_USER_INFO(state) {
        // 重置所有用户信息为默认值
        state.id = '';
        state.avatar = '';
        state.name = '';
        state.gender = '';
        state.selfIntroduction = '';
        state.wechatNumber = '';
        state.phoneNumber = '';
        state.password = '';
        
        // 保持角色不变，只清除其他信息
        const currentRole = state.userInfo.role;
        state.userInfo = {
            certificate: 0,
            role: currentRole, // 保留当前角色
            school: '',
            major: '',
            targetSchool: '',
            targetMajor: '',
            studentGrade: '',
            teacherGrade: '',
            teacherScore: 0,
        };
    },
}; 