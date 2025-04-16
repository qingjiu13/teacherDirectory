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
        state.userInfo.role = role;
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
    updateUserInfo(state, userInfo) {
        const { 
            avatar, 
            name, 
            gender, 
            selfIntroduction, 
            wechatNumber, 
            phoneNumber, 
            password 
        } = userInfo;
        
        // 只更新提供的字段
        if (avatar !== undefined) state.avatar = avatar;
        if (name !== undefined) state.name = name;
        if (gender !== undefined) state.gender = gender;
        if (selfIntroduction !== undefined) state.selfIntroduction = selfIntroduction;
        if (wechatNumber !== undefined) state.wechatNumber = wechatNumber;
        if (phoneNumber !== undefined) state.phoneNumber = phoneNumber;
        if (password !== undefined) state.password = password;
    },
}; 