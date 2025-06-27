/**
 * match模块的状态
 * @module store/user/match/state
 */

/**
 * 服务类型定义
 * @typedef {Object} ServiceType
 * @property {string} typename - 服务类型名称
 * @property {number} [coursenum] - 课程节数（仅课程类型）
 * @property {Object} [fulllength] - 课程总时长（仅课程类型）
 * @property {string} fulllength.hours - 小时数
 * @property {string} fulllength.minutes - 分钟数
 * @property {number} [studentnum] - 课程学生人数（仅一对多课程类型）
 */

/**
 * 服务信息定义
 * @typedef {Object} ServiceInfo
 * @property {string} id - 服务ID
 * @property {string} name - 服务名称
 * @property {ServiceType} type - 服务类型
 * @property {string} price - 服务价格
 * @property {string} description - 服务描述
 * @property {string[]} images - 服务图片数组
 */

/**
 * 根据服务类型名称获取对应的类型配置
 * @param {string} typename - 服务类型名称
 * @returns {ServiceType} 服务类型配置对象
 */
const getServiceTypeByName = (typename) => {
    const baseType = { typename };
    
    switch(typename) {
        case '一对一课程':
            return {
                ...baseType,
                courseNum: 12,
                hours: '120小时',
                minutes: '30分钟'
                
            };
        case '一对多课程':
            return {
                ...baseType,
                courseNum: 12,
                hours: '120小时',
                minutes: '30分钟',
                studentNum: 4
            };
        case '学习资料':
            return baseType;
        default:
            return baseType;
    }
};

export default {
    /**
     * 搜索关键词 - 用于老师匹配搜索
     * @type {string}
     * @description 存储用户在搜索框中输入的关键词，用于过滤匹配的老师列表
     */
    searchKey: "",
    
    // 非专业课列表筛选（不需要分页）
    nonProfessionalList: {
        math: {
            selected: '', // 选中的数学类型
            selectedId: null // 选中的数学类型ID
        },
        english: {
            selected: '', // 选中的英语类型
            selectedId: null // 选中的英语类型ID
        },
        politics: {
            selected: '', // 选中的政治类型
            selectedId: null // 选中的政治类型ID
        },
        other: {
            selected: '', // 选中的其他类型
            selectedId: null // 选中的其他类型ID
        }
    },
    
    // 排序方式筛选（不需要分页）
    sortMode: {
        selected: '', // 选中的排序方式
        selectedId: null, // 选中的排序方式ID
        options: [] // 排序选项列表 [{id, name}]
    },
    
    // 匹配列表
    matchList: [],
    currentPage: 1,
    pageSize: 10,
    hasMore: false, // 是否还有更多数据可加载
    isLoading: false
};