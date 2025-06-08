/**
 * baseInfo模块的actions
 * @module store/user/baseInfo/actions
 */

// 导入学校和专业搜索API
import {
    searchUndergraduateSchools,
    searchUndergraduateMajors,
    searchGraduateSchools,
    searchGraduateMajors
} from '../APIroute/Login_api/Login_api.js';

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
    },
    
    // ===================== 本科学校搜索相关 actions =====================
    
    /**
     * @description 搜索本科学校
     * @param {Object} context - Vuex上下文对象
     * @param {Object} payload - 包含keyword和loadMore的参数对象
     * @returns {Promise} - 返回Promise对象
     */
    async searchUndergraduateSchools({ commit, state }, { keyword, loadMore = false }) {
        console.log('搜索本科学校:', keyword, '加载更多:', loadMore);
        
        try {
            const searchData = state.undergraduateSchoolSearch;
            
            // 如果是加载更多，检查是否还有更多数据
            if (loadMore && !searchData.hasMore) {
                console.log('没有更多数据了');
                return { success: true, data: { hasMore: false } };
            }
            
            // 如果不是加载更多，重置页码和选项
            if (!loadMore) {
                commit('SET_UNDERGRADUATE_SCHOOL_SEARCH_KEYWORD', keyword);
                commit('RESET_UNDERGRADUATE_SCHOOL_SEARCH');
            }
            
            // 设置加载状态
            commit('SET_UNDERGRADUATE_SCHOOL_LOADING', true);
            
            const currentPage = loadMore ? searchData.currentPage + 1 : 1;
            
            const response = await searchUndergraduateSchools({
                keyword: keyword,
                page: currentPage,
                pageSize: searchData.pageSize
            });
            
            console.log('本科学校搜索API返回:', response);
            
            if (response.success && response.data) {
                const newOptions = response.data.items || [];
                const hasMore = response.data.hasMore !== false && 
                                newOptions.length >= searchData.pageSize;
                
                // 更新搜索结果
                commit('SET_UNDERGRADUATE_SCHOOL_OPTIONS', {
                    options: newOptions,
                    append: loadMore,
                    hasMore: hasMore,
                    currentPage: currentPage
                });
                
                console.log(`本科学校搜索完成: 关键词="${keyword}", 页码=${currentPage}, 结果数=${newOptions.length}, 还有更多=${hasMore}`);
                
                return { 
                    success: true, 
                    data: { 
                        options: newOptions,
                        hasMore: hasMore,
                        currentPage: currentPage
                    } 
                };
            } else {
                console.error('本科学校搜索失败:', response.error);
                return Promise.reject(response.error || { message: '搜索学校失败' });
            }
        } catch (error) {
            console.error('搜索本科学校出错:', error);
            return Promise.reject(error);
        } finally {
            commit('SET_UNDERGRADUATE_SCHOOL_LOADING', false);
        }
    },
    
    /**
     * @description 搜索本科专业
     * @param {Object} context - Vuex上下文对象
     * @param {Object} payload - 包含keyword和loadMore的参数对象
     * @returns {Promise} - 返回Promise对象
     */
    async searchUndergraduateMajors({ commit, state }, { keyword, loadMore = false }) {
        console.log('搜索本科专业:', keyword, '加载更多:', loadMore);
        
        try {
            const searchData = state.undergraduateMajorSearch;
            
            // 如果是加载更多，检查是否还有更多数据
            if (loadMore && !searchData.hasMore) {
                console.log('没有更多数据了');
                return { success: true, data: { hasMore: false } };
            }
            
            // 如果不是加载更多，重置页码和选项
            if (!loadMore) {
                commit('SET_UNDERGRADUATE_MAJOR_SEARCH_KEYWORD', keyword);
                commit('RESET_UNDERGRADUATE_MAJOR_SEARCH');
            }
            
            // 设置加载状态
            commit('SET_UNDERGRADUATE_MAJOR_LOADING', true);
            
            const currentPage = loadMore ? searchData.currentPage + 1 : 1;
            
            const response = await searchUndergraduateMajors({
                keyword: keyword,
                page: currentPage,
                pageSize: searchData.pageSize
            });
            
            console.log('本科专业搜索API返回:', response);
            
            if (response.success && response.data) {
                const newOptions = response.data.items || [];
                const hasMore = response.data.hasMore !== false && 
                                newOptions.length >= searchData.pageSize;
                
                // 更新搜索结果
                commit('SET_UNDERGRADUATE_MAJOR_OPTIONS', {
                    options: newOptions,
                    append: loadMore,
                    hasMore: hasMore,
                    currentPage: currentPage
                });
                
                console.log(`本科专业搜索完成: 关键词="${keyword}", 页码=${currentPage}, 结果数=${newOptions.length}, 还有更多=${hasMore}`);
                
                return { 
                    success: true, 
                    data: { 
                        options: newOptions,
                        hasMore: hasMore,
                        currentPage: currentPage
                    } 
                };
            } else {
                console.error('本科专业搜索失败:', response.error);
                return Promise.reject(response.error || { message: '搜索专业失败' });
            }
        } catch (error) {
            console.error('搜索本科专业出错:', error);
            return Promise.reject(error);
        } finally {
            commit('SET_UNDERGRADUATE_MAJOR_LOADING', false);
        }
    },
    
    /**
     * 选择本科学校
     * @param {Object} context - Vuex上下文对象
     * @param {Object} payload - 学校信息
     * @param {number} payload.id - 学校ID
     * @param {string} payload.name - 学校名称
     */
    selectUndergraduateSchool({ commit }, { id, name }) {
        commit('SET_UNDERGRADUATE_SELECTED_SCHOOL', { id, name });
    },
    
    /**
     * 选择本科专业
     * @param {Object} context - Vuex上下文对象
     * @param {Object} payload - 专业信息
     * @param {number} payload.id - 专业ID
     * @param {string} payload.name - 专业名称
     */
    selectUndergraduateMajor({ commit }, { id, name }) {
        commit('SET_UNDERGRADUATE_SELECTED_MAJOR', { id, name });
    },
    
    // ===================== 研究生学校搜索相关 actions =====================
    
    /**
     * 搜索研究生学校列表
     * @param {Object} context - Vuex上下文对象
     * @param {Object} payload - 请求参数
     * @param {string} payload.keyword - 搜索关键词
     * @param {boolean} [payload.loadMore=false] - 是否加载更多数据
     * @returns {Promise} 返回学校搜索结果
     */
    async searchGraduateSchools({ commit, state }, { keyword, loadMore = false }) {
        const userId = state.id;
        
        // 如果是新搜索，重置分页；如果是加载更多，使用当前页+1
        const currentPage = loadMore ? state.graduateSchoolSearch.currentPage + 1 : 1;
        
        // 设置加载状态
        commit('SET_GRADUATE_SCHOOL_PAGINATION', { isLoading: true });
        
        // 更新搜索关键词
        if (!loadMore) {
            commit('SET_GRADUATE_SCHOOL_SEARCH_KEYWORD', keyword);
        }
        
        const params = {
            userId: userId,
            keyword: keyword,
            currentPage: currentPage,
            pageSize: state.graduateSchoolSearch.pageSize
        };
        
        return new Promise((resolve, reject) => {
            searchGraduateSchools(params)
                .then(response => {
                    if (response && response.data) {
                        // 更新学校选项列表
                        commit('SET_GRADUATE_SCHOOL_OPTIONS', {
                            options: response.data,
                            isLoadMore: loadMore
                        });
                        
                        // 更新分页信息
                        commit('SET_GRADUATE_SCHOOL_PAGINATION', {
                            currentPage: currentPage,
                            hasMore: response.hasMore || false,
                            isLoading: false
                        });
                    }
                    resolve(response);
                })
                .catch(error => {
                    commit('SET_GRADUATE_SCHOOL_PAGINATION', { isLoading: false });
                    reject(error);
                });
        });
    },
    
    /**
     * @description 搜索研究生专业
     * @param {Object} context - Vuex上下文对象
     * @param {Object} payload - 包含keyword和loadMore的参数对象
     * @returns {Promise} - 返回Promise对象
     */
    async searchGraduateMajors({ commit, state }, { keyword, loadMore = false }) {
        console.log('搜索研究生专业:', keyword, '加载更多:', loadMore);
        
        try {
            const searchData = state.graduateMajorSearch;
            
            // 如果是加载更多，检查是否还有更多数据
            if (loadMore && !searchData.hasMore) {
                console.log('没有更多数据了');
                return { success: true, data: { hasMore: false } };
            }
            
            // 如果不是加载更多，重置页码和选项
            if (!loadMore) {
                commit('SET_GRADUATE_MAJOR_SEARCH_KEYWORD', keyword);
                // 重置搜索状态
                commit('SET_GRADUATE_MAJOR_OPTIONS', {
                    options: [],
                    append: false,
                    hasMore: true,
                    currentPage: 1
                });
            }
            
            // 设置加载状态
            commit('SET_GRADUATE_SCHOOL_PAGINATION', {
                currentPage: searchData.currentPage,
                hasMore: searchData.hasMore,
                isLoading: true
            });
            
            const currentPage = loadMore ? searchData.currentPage + 1 : 1;
            
            const response = await searchGraduateMajors({
                keyword: keyword,
                page: currentPage,
                pageSize: searchData.pageSize
            });
            
            console.log('研究生专业搜索API返回:', response);
            
            if (response.success && response.data) {
                const newOptions = response.data.items || [];
                const hasMore = response.data.hasMore !== false && 
                                newOptions.length >= searchData.pageSize;
                
                // 更新搜索结果
                commit('SET_GRADUATE_MAJOR_OPTIONS', {
                    options: newOptions,
                    append: loadMore,
                    hasMore: hasMore,
                    currentPage: currentPage
                });
                
                console.log(`研究生专业搜索完成: 关键词="${keyword}", 页码=${currentPage}, 结果数=${newOptions.length}, 还有更多=${hasMore}`);
                
                return { 
                    success: true, 
                    data: { 
                        options: newOptions,
                        hasMore: hasMore,
                        currentPage: currentPage
                    } 
                };
            } else {
                console.error('研究生专业搜索失败:', response.error);
                return Promise.reject(response.error || { message: '搜索专业失败' });
            }
        } catch (error) {
            console.error('搜索研究生专业出错:', error);
            return Promise.reject(error);
        } finally {
            // 结束加载状态
            commit('SET_GRADUATE_SCHOOL_PAGINATION', {
                currentPage: state.graduateMajorSearch.currentPage,
                hasMore: state.graduateMajorSearch.hasMore,
                isLoading: false
            });
        }
    },
    
    /**
     * 选择研究生学校
     * @param {Object} context - Vuex上下文对象
     * @param {Object} payload - 学校信息
     * @param {number} payload.id - 学校ID
     * @param {string} payload.name - 学校名称
     */
    selectGraduateSchool({ commit }, { id, name }) {
        commit('SET_GRADUATE_SELECTED_SCHOOL', { id, name });
        // 清空专业选择
        commit('SET_GRADUATE_SELECTED_MAJOR', { id: null, name: '' });
        commit('SET_GRADUATE_MAJOR_OPTIONS', []);
    },
    
    /**
     * 选择研究生专业
     * @param {Object} context - Vuex上下文对象
     * @param {Object} payload - 专业信息
     * @param {number} payload.id - 专业ID
     * @param {string} payload.name - 专业名称
     */
    selectGraduateMajor({ commit }, { id, name }) {
        commit('SET_GRADUATE_SELECTED_MAJOR', { id, name });
    }
}; 