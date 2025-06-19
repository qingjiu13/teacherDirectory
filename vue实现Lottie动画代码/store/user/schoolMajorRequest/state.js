/**
 * 学校专业模块的状态
 * @module store/user/schoolMajorRequest/state
 */

export default {
    
    // 本科学校搜索相关状态（用于登录详情页面）
    undergraduateSchoolSearch: {
        selectedSchool: '', // 当前选中的学校名称
        selectedSchoolId: null, // 当前选中的学校ID
        searchKeyword: '', // 搜索关键词
        options: [], // 当前显示的学校选项列表 [{id, name}]
        currentPage: 1, // 当前页码
        pageSize: 20, // 每页数量
        hasMore: true, // 是否还有更多数据
        isLoading: false // 是否正在加载
    },
    
    // 本科专业搜索相关状态
    undergraduateMajorSearch: {
        selectedMajor: '', // 当前选中的专业名称
        selectedMajorId: null, // 当前选中的专业ID
        searchKeyword: '', // 搜索关键词
        options: [], // 当前显示的专业选项列表 [{id, name}]
        currentPage: 1, // 当前页码
        pageSize: 20, // 每页数量
        hasMore: true, // 是否还有更多数据
        isLoading: false // 是否正在加载
    },
    
    // 研究生学校搜索相关状态（目标学校）
    graduateSchoolSearch: {
        selectedSchool: '', // 当前选中的学校名称
        selectedSchoolId: null, // 当前选中的学校ID
        searchKeyword: '', // 搜索关键词
        options: [], // 当前显示的学校选项列表 [{id, name}]
        currentPage: 1, // 当前页码
        pageSize: 20, // 每页数量
        hasMore: true, // 是否还有更多数据
        isLoading: false // 是否正在加载
    },
    
    // 研究生专业搜索相关状态（目标专业）
    graduateMajorSearch: {
        selectedMajor: '', // 当前选中的专业名称
        selectedMajorId: null, // 当前选中的专业ID
        searchKeyword: '', // 搜索关键词
        options: [], // 当前显示的专业选项列表 [{id, name}]
        currentPage: 1, // 当前页码
        pageSize: 20, // 每页数量
        hasMore: true, // 是否还有更多数据
        isLoading: false // 是否正在加载
    }
}