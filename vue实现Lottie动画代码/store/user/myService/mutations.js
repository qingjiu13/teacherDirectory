/**
 * myService模块的mutations
 * @module store/user/myService/mutations
 */

export default {
    /**
     * 设置用户服务列表
     * @param {Object} state - 当前模块的状态
     * @param {Array} services - 服务数组
     */
    SET_USER_SERVICES(state, services) {
        state.service = services;
    },
    
    /**
     * 用户修改服务信息
     * @param {Object} state - 当前模块的状态
     * @param {Object} payload - 包含服务ID和更新信息的对象
     * @param {string} payload.id - 要更新的服务ID
     * @param {Object} payload.updatedInfo - 用户修改后的服务信息
     */
    UPDATE_SERVICE_BY_USER(state, { id, updatedInfo }) {
        const serviceIndex = state.service.findIndex(service => service.id === id);
        if (serviceIndex !== -1) {
            // 合并原有信息和更新的信息
            state.service[serviceIndex] = {
                ...state.service[serviceIndex],
                ...updatedInfo,
                updateTime: new Date().toISOString().split('T')[0] // 添加更新时间
            };
        }
    },
    
    /**
     * 添加新服务
     * @param {Object} state - 当前模块的状态
     * @param {Object} serviceData - 新服务数据
     */
    ADD_SERVICE(state, serviceData) {
        // 确保服务有创建和更新时间
        const now = new Date().toISOString().split('T')[0];
        const newService = {
            ...serviceData,
            createTime: serviceData.createTime || now,
            updateTime: serviceData.updateTime || now,
            status: serviceData.status || 'active'
        };
        
        // 添加到服务列表的最前面，使最新的服务优先显示
        state.service.unshift(newService);
    },
    
    /**
     * 删除服务
     * @param {Object} state - 当前模块的状态
     * @param {String} serviceId - 要删除的服务ID
     */
    DELETE_SERVICE(state, serviceId) {
        state.service = state.service.filter(service => service.id !== serviceId);
    },
    
    /**
     * 设置当前正在编辑的服务
     * @param {Object} state - 当前模块的状态
     * @param {Object|null} service - 服务对象或null
     */
    SET_CURRENT_EDITING_SERVICE(state, service) {
        state.currentEditingService = service;
    },
    
    /**
     * 设置服务过滤条件
     * @param {Object} state - 当前模块的状态
     * @param {Object} filter - 过滤条件
     */
    SET_SERVICE_FILTER(state, filter) {
        state.filter = {
            ...state.filter,
            ...filter
        };
    },
    
    /**
     * 添加服务封面图片
     * @param {Object} state - 当前模块的状态
     * @param {Object} payload - 包含服务ID和图片URL的对象
     * @param {String} payload.id - 要更新的服务ID
     * @param {String} payload.imageUrl - 图片URL
     */
    ADD_SERVICE_COVER_IMAGE(state, { id, imageUrl }) {
        const serviceIndex = state.service.findIndex(service => service.id === id);
        if (serviceIndex !== -1) {
            const service = state.service[serviceIndex];
            
            // 初始化图片数组（如果不存在）
            const imageUrls = service.imageUrls || [];
            
            // 更新服务数据
            state.service[serviceIndex] = {
                ...service,
                image: imageUrl, // 主封面图片
                imageUrls: [...imageUrls, imageUrl], // 所有图片列表
                updateTime: new Date().toISOString().split('T')[0]
            };
        }
    },
    
    /**
     * 删除服务封面图片
     * @param {Object} state - 当前模块的状态
     * @param {Object} payload - 包含服务ID和图片索引的对象
     * @param {String} payload.id - 要更新的服务ID
     * @param {Number} payload.index - 要删除的图片索引
     */
    DELETE_SERVICE_COVER_IMAGE(state, { id, index }) {
        const serviceIndex = state.service.findIndex(service => service.id === id);
        if (serviceIndex !== -1) {
            const service = state.service[serviceIndex];
            
            // 确保图片数组存在
            if (service.imageUrls && service.imageUrls.length > index) {
                // 创建新的图片数组，排除要删除的图片
                const newImageUrls = [...service.imageUrls];
                newImageUrls.splice(index, 1);
                
                // 更新服务数据
                state.service[serviceIndex] = {
                    ...service,
                    // 如果主封面被删除，则使用第一张图片或空字符串
                    image: newImageUrls.length > 0 ? newImageUrls[0] : '',
                    imageUrls: newImageUrls,
                    updateTime: new Date().toISOString().split('T')[0]
                };
            }
        }
    },
    
    /**
     * 设置服务附件链接
     * @param {Object} state - 当前模块的状态
     * @param {Object} payload - 包含服务ID和附件链接的对象
     * @param {String} payload.id - 要更新的服务ID
     * @param {String} payload.fileLink - 附件链接
     */
    SET_SERVICE_FILE_LINK(state, { id, fileLink }) {
        const serviceIndex = state.service.findIndex(service => service.id === id);
        if (serviceIndex !== -1) {
            // 更新服务附件链接
            state.service[serviceIndex] = {
                ...state.service[serviceIndex],
                fileLink,
                updateTime: new Date().toISOString().split('T')[0]
            };
        }
    }
}; 