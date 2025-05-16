/**
 * myService模块的getters
 * @module store/user/myService/getters
 */

export default {
    /**
     * 获取所有服务
     * @param {Object} state - 当前模块的状态
     * @returns {Array} 服务数组
     */
    getAllServices: state => state.service,
    
    /**
     * 按ID获取服务
     * @param {Object} state - 当前模块的状态
     * @returns {Function} 返回一个函数，该函数接受服务ID并返回对应的服务对象
     */
    getServiceById: state => id => state.service.find(service => service.id === id),
    
    /**
     * 按类型获取服务
     * @param {Object} state - 当前模块的状态
     * @returns {Function} 返回一个函数，该函数接受服务类型名称并返回该类型的所有服务
     */
    getServicesByType: state => typeName => state.service.filter(service => service.type.typename === typeName),
    
    /**
     * 获取服务总数
     * @param {Object} state - 当前模块的状态
     * @returns {Number} 服务总数
     */
    getServiceCount: state => state.service.length,
    
    /**
     * 获取服务价格区间
     * @param {Object} state - 当前模块的状态
     * @returns {Object} 包含最低价和最高价的对象
     */
    getPriceRange: state => {
        const prices = state.service.map(service => {
            // 提取价格中的数字部分
            const priceNum = parseInt(service.price.replace(/[^0-9]/g, ''));
            return isNaN(priceNum) ? 0 : priceNum;
        });
        
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    },
    
    /**
     * 获取当前正在编辑的服务
     * @param {Object} state - 当前模块的状态
     * @returns {Object|null} 当前正在编辑的服务或null
     */
    getCurrentEditingService: state => state.currentEditingService,
    
    /**
     * 获取可用的服务类型列表
     * @param {Object} state - 当前模块的状态
     * @returns {Array} 服务类型列表
     */
    getServiceTypes: state => state.serviceTypes,
    
    /**
     * 获取按创建时间排序的服务列表
     * @param {Object} state - 当前模块的状态
     * @returns {Array} 按创建时间排序的服务数组
     */
    getServicesSortedByCreateTime: state => {
        return [...state.service].sort((a, b) => {
            return new Date(b.createTime) - new Date(a.createTime);
        });
    },
    
    /**
     * 获取按更新时间排序的服务列表
     * @param {Object} state - 当前模块的状态
     * @returns {Array} 按更新时间排序的服务数组
     */
    getServicesSortedByUpdateTime: state => {
        return [...state.service].sort((a, b) => {
            return new Date(b.updateTime) - new Date(a.updateTime);
        });
    },
    
    /**
     * 获取按价格排序的服务列表
     * @param {Object} state - 当前模块的状态
     * @param {Boolean} ascending - 是否升序排列
     * @returns {Array} 按价格排序的服务数组
     */
    getServicesSortedByPrice: state => ascending => {
        return [...state.service].sort((a, b) => {
            const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
            const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
            return ascending ? priceA - priceB : priceB - priceA;
        });
    },
    
    /**
     * 获取按当前过滤条件筛选的服务列表
     * @param {Object} state - 当前模块的状态
     * @returns {Array} 筛选后的服务数组
     */
    getFilteredServices: state => {
        return state.service.filter(service => {
            // 类型筛选
            if (state.filter.type && service.type.typename !== state.filter.type) {
                return false;
            }
            
            // 价格范围筛选
            const priceNum = parseInt(service.price.replace(/[^0-9]/g, ''));
            if (priceNum < state.filter.priceRange.min || priceNum > state.filter.priceRange.max) {
                return false;
            }
            
            // 关键词搜索
            if (state.filter.keyword) {
                const keyword = state.filter.keyword.toLowerCase();
                const name = (service.name || '').toLowerCase();
                const description = (service.description || '').toLowerCase();
                
                if (!name.includes(keyword) && !description.includes(keyword)) {
                    return false;
                }
            }
            
            return true;
        });
    },
    
    /**
     * 获取按状态分组的服务统计
     * @param {Object} state - 当前模块的状态
     * @returns {Object} 包含各状态服务数量的对象
     */
    getServiceStatusStats: state => {
        const stats = {
            active: 0,
            inactive: 0,
            draft: 0
        };
        
        state.service.forEach(service => {
            const status = service.status || 'active';
            if (stats[status] !== undefined) {
                stats[status]++;
            }
        });
        
        return stats;
    },
    
    /**
     * 获取按类型分组的服务列表
     * @param {Object} state - 当前模块的状态
     * @returns {Object} 按类型分组的服务对象
     */
    getServicesGroupedByType: state => {
        const result = {};
        
        state.service.forEach(service => {
            const typename = service.type.typename;
            if (!result[typename]) {
                result[typename] = [];
            }
            result[typename].push(service);
        });
        
        return result;
    }
}; 