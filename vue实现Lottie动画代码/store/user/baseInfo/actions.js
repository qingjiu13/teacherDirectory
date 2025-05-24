/**
 * baseInfo模块的actions
 * @module store/user/baseInfo/actions
 */

// 直接导入API
const { getUserInfo, updateUserInfo, updateRole } = {
    // 这里可以替换为真实API实现
    getUserInfo: () => Promise.resolve({ 
        success: true, 
        data: {
            id: '1566454',
            avatar: '/static/image/defaultAvatar/teacher-man.png',
            name: '张三',
            gender: '男',
            selfIntroduction: '我是一个热爱学习的人',
            wechatNumber: '1234567890',
            phoneNumber: '1234567890',
            password: '123456',
            isRegistered: 0 ,
            userInfo: {
                certificate: 0,
                role: '学生',
                school: '天津大学',
                major: '计算机科学与技术',
                targetSchool: '清华大学',
                targetMajor: '计算机科学与技术',
                studentGrade: '大三',
                teacherGrade: '研一',
            }
        } 
    }),
    updateUserInfo: (userInfo) => Promise.resolve({ success: true, data: { userInfo } }),
    updateRole: () => Promise.resolve({ success: true })
};

export default {
    /**
     * @description 获取用户信息
     * @param {Object} context - Vuex上下文对象
     * @returns {Promise} - 返回Promise对象
     */
    async getUserInfo({ commit, state }) {
        console.log('getUserInfo action开始执行, 当前state:', {
            id: state.id,
            name: state.name
        });
        
        try {
            // 如果本地已有数据且不是空的，则直接返回
            if (state.name && state.name !== '') {
                console.log('本地已有数据，直接返回state');
                return {
                    id: state.id,
                    avatar: state.avatar,
                    name: state.name,
                    gender: state.gender,
                    selfIntroduction: state.selfIntroduction,
                    wechatNumber: state.wechatNumber,
                    phoneNumber: state.phoneNumber,
                    userInfo: state.userInfo
                };
            }
            
            console.log('本地无数据，请求API');
            const response = await getUserInfo();
            console.log('API返回结果:', response);
            
            if (response.success) {
                // 将返回的用户信息提交到mutations处理
                commit('SET_USER_INFO', response.data);
                console.log('提交SET_USER_INFO后，state变为:', {
                    id: state.id,
                    name: state.name
                });
                
                return response.data;
            } else {
                console.error('API返回失败:', response.error);
                return Promise.reject(response.error || { message: '获取用户信息失败' });
            }
        } catch (error) {
            console.error('获取用户信息失败', error);
            return Promise.reject(error);
        }
    },
    
    /**
     * @description 更新用户信息
     * @param {Object} context - Vuex上下文对象
     * @param {Object} userInfo - 用户信息
     * @returns {Promise} - 返回Promise对象
     */
    async updateUserInfo({ commit }, userInfo) {
        try {
            const response = await updateUserInfo(userInfo);
            
            if (response.success) {
                // 更新用户信息
                commit('UPDATE_USER_INFO', userInfo);
                
                return { success: true };
            } else {
                return Promise.reject(response.error || { message: '更新用户信息失败' });
            }
        } catch (error) {
            console.error('更新用户信息失败', error);
            return Promise.reject(error);
        }
    },
    
    /**
     * @description 更新用户扩展信息
     * @param {Object} context - Vuex上下文对象
     * @param {Object} userInfoData - 用户扩展信息
     * @returns {Promise} - 返回Promise对象
     */
    async updateUserInfoData({ commit }, userInfoData) {
        try {
            const response = await updateUserInfo({ userInfo: userInfoData });
            
            if (response.success) {
                // 更新用户扩展信息
                commit('UPDATE_USER_INFO_DATA', userInfoData);
                
                return { success: true };
            } else {
                return Promise.reject(response.error || { message: '更新用户扩展信息失败' });
            }
        } catch (error) {
            console.error('更新用户扩展信息失败', error);
            return Promise.reject(error);
        }
    },
    
    /**
     * @description 更新用户角色
     * @param {Object} context - Vuex上下文对象
     * @param {string} role - 用户角色
     * @returns {Promise} - 返回Promise对象
     */
    async updateRole({ commit, state }, role) {
        console.log('updateRole action开始执行, 角色:', role, '当前role:', state.userInfo.role);
        
        try {
            // 调用API更新角色
            const response = await updateRole(role);
            
            if (response.success) {
                // 提交角色更新到mutations
                commit('updateRole', role);
                console.log('角色更新成功，新角色:', state.userInfo.role);
                
                // 保存到本地存储
                uni.setStorageSync('userRole', role);
                
                return { success: true, role };
            } else {
                return Promise.reject(response.error || { message: '更新用户角色失败' });
            }
        } catch (error) {
            console.error('更新用户角色失败:', error);
            
            // 即使API调用失败，也尝试在本地更新
            try {
                commit('updateRole', role);
                uni.setStorageSync('userRole', role);
            } catch (e) {
                console.error('本地更新角色失败', e);
            }
            
            return Promise.reject(error);
        }
    },
    
    /**
     * @description 用户登出
     * @param {Object} context - Vuex上下文对象
     * @returns {Promise} - 返回Promise对象
     */
    async logout({ commit }) {
        try {
            // 清除用户信息
            commit('CLEAR_USER_INFO');
            
            // 清除本地存储中的认证信息
            uni.removeStorageSync('userId');
            uni.removeStorageSync('token');
            uni.removeStorageSync('userInfo');
            uni.removeStorageSync('user-token');
            uni.removeStorageSync('userBaseInfo');
            uni.removeStorageSync('userInfoData');
            uni.removeStorageSync('userRole');
            
            return { success: true, message: '退出登录成功' };
        } catch (error) {
            console.error('退出登录失败:', error);
            return Promise.reject({ message: '退出登录失败' });
        }
    }
}; 