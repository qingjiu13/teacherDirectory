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
    // 学校列表筛选（支持分页）
    schoolList: {
        selectedSchool: '', // 当前选中的学校名称
        selectedSchoolId: null, // 当前选中的学校ID
        searchKeyword: '', // 搜索关键词
        options: [], // 当前显示的学校选项列表 [{id, name}]
        currentPage: 1, // 当前页码
        pageSize: 20, // 每页数量
        hasMore: true, // 是否还有更多数据
        isLoading: false // 是否正在加载
    },
    
    // 专业课列表筛选
    professionalList: {
        selectedMajor: '', // 当前选中的专业名称
        selectedMajorId: null, // 当前选中的专业ID
        searchKeyword: '', // 搜索关键词
        options: [], // 当前显示的专业选项列表 [{id, name}]
        currentPage: 1, // 当前页码
        pageSize: 99999, // 每页数量（设置为大值一次性获取所有数据）
        hasMore: false, // 是否还有更多数据（由于一次性获取所有，默认false）
        isLoading: false // 是否正在加载
    },
    
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
    matchList: [
        // {
        //     id: 'teacher001',
        //     name: '张老师',
        //     avatar: '/static/image/defaultAvatar/teacher-man.png',
        //     gender: 'male',
        //     selfIntroduction: '清华大学计算机专业硕士，5年教学经验，天赋一个i和v结构图一杠iv后经过长途费i故欲语版本i故不i贵ui贵ui广告过后忽而和任何功夫俄国黄热给被人骨灰盒肉，5年教学经验，天赋一个i和v结构图一杠iv后经过长途费i故欲语版本i故不i贵ui贵ui广告过后忽而和任何功夫俄国黄热给被人骨灰盒肉，5年教学经验，天赋一个i和v结构图一杠iv后经过长途费i故欲语版本i故不i贵ui贵ui广告过后忽而和任何功夫俄国黄热给被人骨灰盒肉，5年教学经验，天赋一个i和v结构图一杠iv后经过长途费i故欲语版本i故不i贵ui贵ui广告过后忽而和任何功夫俄国黄热给被人骨灰盒肉，5年教学经验，天赋一个i和v结构图一杠iv后经过长途费i故欲语版本i故不i贵ui贵ui广告过后忽而和任何功夫俄国黄热给被人骨灰盒肉',
        //     certificate: 1,
        //     campusAmbassador: 1, // 是否为校园大使
        //     school: '清华大学',
        //     major: '计算机科学与技术',
        //     hourPrice: 100.00, // 每小时价格
        //     service:[
        //         /** @type {ServiceInfo} */
        //         {
        //             id: 'service001',
        //             name: '考研规划咨询',
        //             type: getServiceTypeByName('一对一课程'),
        //             price: '200元',
        //             description: '提供考研全程规划指导不会不会给vui不会vu一部韩剧韩剧u一般会的给v保监局预估i保护局故意不回就搞不好健康环保',
        //             images: ['/static/image/defaultAvatar/teacher-man.png'],
        //         },
        //         /** @type {ServiceInfo} */
        //         {
        //             id: 'service002',
        //             name: '一对多课程',
        //             type: getServiceTypeByName('一对多课程'),
        //             price: '300元',
        //             description: '计算机专业课一对一辅导',
        //             images: ['/static/image/defaultAvatar/teacher-man.png'],
        //         }
        //     ]
        // },
        // {
        //     id: 'teacher002',
        //     name: '李老师',
        //     avatar: '/static/image/defaultAvatar/teacher-man.png',
        //     gender: 'female',
        //     selfIntroduction: '北京大学经济学博士，3年教学经验',
        //     certificate: 1,
        //     campusAmbassador: 1, // 是否为校园大使
        //     school: '北京大学',
        //     major: '经济学',
        //     hourPrice: 120.00, // 每小时价格
        //     service:[
        //         /** @type {ServiceInfo} */
        //         {
        //             id: 'service003',
        //             name: '经济学基础课程',
        //             type: getServiceTypeByName('学习资料'),
        //             price: '150元',
        //             description: '经济学基础理论讲解',
        //             images: ['/static/image/defaultAvatar/teacher-man.png'],
        //         }
        //     ]
        // }
    ],
    currentPage: 1,
    pageSize: 10,
    hasMore: false, // 是否还有更多数据可加载
    isLoading: false
};