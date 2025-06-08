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
        console.log('updateRole mutation执行, 参数:', role);
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
        console.log('角色更新完成, 新角色:', state.userInfo.role);
    },
    
    /**
     * 设置用户完整信息
     * @param {Object} state - 当前状态
     * @param {Object} userData - 服务器返回的用户信息
     */
    SET_USER_INFO(state, userData) {
        console.log('SET_USER_INFO mutation执行, 入参:', userData);
        console.log('更新前state:', {
            id: state.id,
            name: state.name,
            avatar: state.avatar
        });
        
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
        
        console.log('更新后state:', {
            id: state.id,
            name: state.name,
            avatar: state.avatar,
            role: state.userInfo.role
        });
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
        console.log('UPDATE_USER_INFO mutation执行, 入参:', userInfo);
        
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
        
        console.log('更新后state:', {
            id: state.id,
            name: state.name,
            avatar: state.avatar
        });
    },
    
    /**
     * 更新用户个人档案（UPDATE_USER_INFO的别名，用于modify.vue页面）
     * @param {Object} state - 当前状态
     * @param {Object} profileData - 用户个人档案数据
     */
    UPDATE_USER_PROFILE(state, profileData) {
        console.log('UPDATE_USER_PROFILE mutation执行, 入参:', profileData);
        
        // 直接调用UPDATE_USER_INFO mutation，保持逻辑一致
        this.commit('user/baseInfo/UPDATE_USER_INFO', profileData);
        
        // 发送事件通知更新成功
        uni.$emit('userProfileUpdated', {
            timestamp: Date.now(),
            data: profileData
        });
    },
    
    /**
     * 清除用户信息（用于登出）
     * @param {Object} state - 当前状态
     */
    CLEAR_USER_INFO(state) {
        console.log('CLEAR_USER_INFO mutation执行');
        
        // 重置所有用户信息为默认值
        state.id = '';
        state.avatar = '';
        state.name = '';
        state.gender = '';
        state.selfIntroduction = '';
        state.wechatNumber = '';
        state.phoneNumber = '';
        state.password = '';
        state.isLogin = 0;
        state.isRegistered = 0;
        state.campusAmbassador = 0;
        state.userInfo = {
            certificate: 0,
            role: '学生',
            school: '',
            major: '',
            targetSchool: '',
            targetMajor: '',
            studentGrade: '',
            teacherGrade: ''
        };
        
        // 清除本地存储
        uni.removeStorageSync('userBaseInfo');
        uni.removeStorageSync('userRole');
        console.log('用户信息已清除');
    },
    
    /**
     * 设置用户登录状态
     * @param {Object} state - 当前状态
     * @param {number} isLogin - 登录状态 0-未登录 1-已登录
     */
    SET_LOGIN_STATUS(state, isLogin) {
        state.isLogin = isLogin;
        console.log('登录状态已更新为:', isLogin);
    },
    
    /**
     * 设置用户注册状态
     * @param {Object} state - 当前状态
     * @param {number} isRegistered - 注册状态 0-未注册 1-已注册
     */
    SET_REGISTER_STATUS(state, isRegistered) {
        state.isRegistered = isRegistered;
        console.log('注册状态已更新为:', isRegistered);
    },
    
    /**
     * @description 更新用户扩展信息
     * @param {Object} state - 状态对象
     * @param {Object} userInfoData - 用户扩展信息对象
     */
    UPDATE_USER_INFO_DATA(state, userInfoData) {
        console.log('UPDATE_USER_INFO_DATA mutation执行, 入参:', userInfoData);
        
        // 合并扩展信息到现有的userInfo对象
        const updatedUserInfo = {
            ...state.userInfo,
            ...userInfoData
        };
        
        // 确保ID字段正确设置
        if (userInfoData.schoolId !== undefined) updatedUserInfo.schoolId = userInfoData.schoolId;
        if (userInfoData.majorId !== undefined) updatedUserInfo.majorId = userInfoData.majorId;
        if (userInfoData.targetSchoolId !== undefined) updatedUserInfo.targetSchoolId = userInfoData.targetSchoolId;
        if (userInfoData.targetMajorId !== undefined) updatedUserInfo.targetMajorId = userInfoData.targetMajorId;
        
        // 更新状态
        state.userInfo = updatedUserInfo;
        
        // 保存到本地存储
        try {
            uni.setStorageSync('userInfoData', JSON.stringify(updatedUserInfo));
            console.log('用户扩展信息已保存到本地存储');
        } catch (error) {
            console.error('保存用户扩展信息到本地存储失败:', error);
        }
        
        console.log('更新后的userInfo:', state.userInfo);
    },
    
    // ===================== 本科学校搜索相关 mutations =====================
    
    /**
     * 设置本科学校搜索关键词
     * @param {Object} state - Vuex状态对象
     * @param {string} keyword - 搜索关键词
     */
    SET_UNDERGRADUATE_SCHOOL_SEARCH_KEYWORD(state, keyword) {
        state.undergraduateSchoolSearch.searchKeyword = keyword;
    },
    
    /**
     * @description 设置本科学校搜索选项列表
     * @param {Object} state - 状态对象
     * @param {Object} payload - 包含选项列表和分页信息的对象
     */
    SET_UNDERGRADUATE_SCHOOL_OPTIONS(state, payload) {
        console.log('SET_UNDERGRADUATE_SCHOOL_OPTIONS mutation执行:', payload);
        
        if (typeof payload === 'object' && payload.options) {
            // 新的分页方式
            const { options, append = false, hasMore = true, currentPage = 1 } = payload;
            
            if (append) {
                // 追加新数据
                state.undergraduateSchoolSearch.options = [
                    ...state.undergraduateSchoolSearch.options,
                    ...options
                ];
            } else {
                // 替换数据
                state.undergraduateSchoolSearch.options = options;
            }
            
            state.undergraduateSchoolSearch.hasMore = hasMore;
            state.undergraduateSchoolSearch.currentPage = currentPage;
        } else {
            // 兼容旧的方式
            state.undergraduateSchoolSearch.options = Array.isArray(payload) ? payload : [];
        }
    },
    
    /**
     * @description 重置本科学校搜索状态
     * @param {Object} state - 状态对象
     */
    RESET_UNDERGRADUATE_SCHOOL_SEARCH(state) {
        state.undergraduateSchoolSearch.options = [];
        state.undergraduateSchoolSearch.currentPage = 1;
        state.undergraduateSchoolSearch.hasMore = true;
    },
    
    /**
     * @description 设置本科学校搜索加载状态
     * @param {Object} state - 状态对象
     * @param {Boolean} isLoading - 是否正在加载
     */
    SET_UNDERGRADUATE_SCHOOL_LOADING(state, isLoading) {
        console.log('SET_UNDERGRADUATE_SCHOOL_LOADING mutation执行:', isLoading);
        state.undergraduateSchoolSearch.isLoading = !!isLoading;
    },
    
    /**
     * 设置选中的本科学校
     * @param {Object} state - Vuex状态对象
     * @param {Object} school - 学校信息
     * @param {number} school.id - 学校ID
     * @param {string} school.name - 学校名称
     */
    SET_UNDERGRADUATE_SELECTED_SCHOOL(state, { id, name }) {
        state.undergraduateSchoolSearch.selectedSchoolId = id;
        state.undergraduateSchoolSearch.selectedSchool = name;
        // 同时更新用户信息
        state.userInfo.school = name;
    },
    
    // ===================== 本科专业搜索相关 mutations =====================
    
    /**
     * 设置本科专业搜索关键词
     * @param {Object} state - Vuex状态对象
     * @param {string} keyword - 搜索关键词
     */
    SET_UNDERGRADUATE_MAJOR_SEARCH_KEYWORD(state, keyword) {
        state.undergraduateMajorSearch.searchKeyword = keyword;
    },
    
    /**
     * @description 设置本科专业搜索选项列表
     * @param {Object} state - 状态对象
     * @param {Object} payload - 包含选项列表和分页信息的对象
     */
    SET_UNDERGRADUATE_MAJOR_OPTIONS(state, payload) {
        console.log('SET_UNDERGRADUATE_MAJOR_OPTIONS mutation执行:', payload);
        
        if (typeof payload === 'object' && payload.options) {
            // 新的分页方式
            const { options, append = false, hasMore = true, currentPage = 1 } = payload;
            
            if (append) {
                // 追加新数据
                state.undergraduateMajorSearch.options = [
                    ...state.undergraduateMajorSearch.options,
                    ...options
                ];
            } else {
                // 替换数据
                state.undergraduateMajorSearch.options = options;
            }
            
            state.undergraduateMajorSearch.hasMore = hasMore;
            state.undergraduateMajorSearch.currentPage = currentPage;
        } else {
            // 兼容旧的方式
            state.undergraduateMajorSearch.options = Array.isArray(payload) ? payload : [];
        }
    },
    
    /**
     * @description 重置本科专业搜索状态
     * @param {Object} state - 状态对象
     */
    RESET_UNDERGRADUATE_MAJOR_SEARCH(state) {
        state.undergraduateMajorSearch.options = [];
        state.undergraduateMajorSearch.currentPage = 1;
        state.undergraduateMajorSearch.hasMore = true;
    },
    
    /**
     * @description 设置本科专业搜索加载状态
     * @param {Object} state - 状态对象
     * @param {Boolean} isLoading - 是否正在加载
     */
    SET_UNDERGRADUATE_MAJOR_LOADING(state, isLoading) {
        console.log('SET_UNDERGRADUATE_MAJOR_LOADING mutation执行:', isLoading);
        state.undergraduateMajorSearch.isLoading = !!isLoading;
    },
    
    /**
     * 设置选中的本科专业
     * @param {Object} state - Vuex状态对象
     * @param {Object} major - 专业信息
     * @param {number} major.id - 专业ID
     * @param {string} major.name - 专业名称
     */
    SET_UNDERGRADUATE_SELECTED_MAJOR(state, { id, name }) {
        state.undergraduateMajorSearch.selectedMajorId = id;
        state.undergraduateMajorSearch.selectedMajor = name;
        // 同时更新用户信息
        state.userInfo.major = name;
    },
    
    // ===================== 研究生学校搜索相关 mutations =====================
    
    /**
     * 设置研究生学校搜索关键词
     * @param {Object} state - Vuex状态对象
     * @param {string} keyword - 搜索关键词
     */
    SET_GRADUATE_SCHOOL_SEARCH_KEYWORD(state, keyword) {
        state.graduateSchoolSearch.searchKeyword = keyword;
    },
    
    /**
     * 设置研究生学校选项列表
     * @param {Object} state - Vuex状态对象
     * @param {Array} options - 学校选项列表 [{id, name}]
     * @param {boolean} isLoadMore - 是否为加载更多
     */
    SET_GRADUATE_SCHOOL_OPTIONS(state, { options, isLoadMore = false }) {
        if (isLoadMore) {
            state.graduateSchoolSearch.options = [...state.graduateSchoolSearch.options, ...options];
        } else {
            state.graduateSchoolSearch.options = options;
        }
    },
    
    /**
     * 设置研究生学校分页信息
     * @param {Object} state - Vuex状态对象
     * @param {Object} pagination - 分页信息
     * @param {number} pagination.currentPage - 当前页码
     * @param {boolean} pagination.hasMore - 是否还有更多数据
     * @param {boolean} pagination.isLoading - 是否正在加载
     */
    SET_GRADUATE_SCHOOL_PAGINATION(state, { currentPage, hasMore, isLoading }) {
        if (currentPage !== undefined) state.graduateSchoolSearch.currentPage = currentPage;
        if (hasMore !== undefined) state.graduateSchoolSearch.hasMore = hasMore;
        if (isLoading !== undefined) state.graduateSchoolSearch.isLoading = isLoading;
    },
    
    /**
     * 设置选中的研究生学校
     * @param {Object} state - Vuex状态对象
     * @param {Object} school - 学校信息
     * @param {number} school.id - 学校ID
     * @param {string} school.name - 学校名称
     */
    SET_GRADUATE_SELECTED_SCHOOL(state, { id, name }) {
        state.graduateSchoolSearch.selectedSchoolId = id;
        state.graduateSchoolSearch.selectedSchool = name;
        // 同时更新用户信息
        state.userInfo.targetSchool = name;
    },
    
    // ===================== 研究生专业搜索相关 mutations =====================
    
    /**
     * 设置研究生专业搜索关键词
     * @param {Object} state - Vuex状态对象
     * @param {string} keyword - 搜索关键词
     */
    SET_GRADUATE_MAJOR_SEARCH_KEYWORD(state, keyword) {
        state.graduateMajorSearch.searchKeyword = keyword;
    },
    
    /**
     * @description 设置研究生专业搜索选项列表
     * @param {Object} state - 状态对象
     * @param {Object} payload - 包含选项列表和分页信息的对象
     */
    SET_GRADUATE_MAJOR_OPTIONS(state, payload) {
        console.log('SET_GRADUATE_MAJOR_OPTIONS mutation执行:', payload);
        
        if (typeof payload === 'object' && payload.options) {
            // 新的分页方式
            const { options, append = false, hasMore = true, currentPage = 1 } = payload;
            
            if (append) {
                // 追加新数据
                state.graduateMajorSearch.options = [
                    ...state.graduateMajorSearch.options,
                    ...options
                ];
            } else {
                // 替换数据
                state.graduateMajorSearch.options = options;
            }
            
            state.graduateMajorSearch.hasMore = hasMore;
            state.graduateMajorSearch.currentPage = currentPage;
        } else {
            // 兼容旧的方式
            state.graduateMajorSearch.options = Array.isArray(payload) ? payload : [];
        }
    },
    
    /**
     * 设置选中的研究生专业
     * @param {Object} state - Vuex状态对象
     * @param {Object} major - 专业信息
     * @param {number} major.id - 专业ID
     * @param {string} major.name - 专业名称
     */
    SET_GRADUATE_SELECTED_MAJOR(state, { id, name }) {
        state.graduateMajorSearch.selectedMajorId = id;
        state.graduateMajorSearch.selectedMajor = name;
        // 同时更新用户信息
        state.userInfo.targetMajor = name;
    }
}; 