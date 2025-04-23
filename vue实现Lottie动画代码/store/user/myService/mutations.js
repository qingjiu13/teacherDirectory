/**
 * myService模块的mutations
 * @module store/user/myService/mutations
 */

export default {
    /**
     * 用户修改服务信息
     * @param {Object} state - 当前模块的状态
     * @param {Object} payload - 包含服务ID和更新信息的对象
     * @param {string} payload.id - 要更新的服务ID
     * @param {Object} payload.updatedInfo - 用户修改后的服务信息
     */
    UPDATE_SERVICE_BY_USER(state, { id, updatedInfo }) {
        const serviceIndex = state.serviceList.findIndex(service => service.id === id);
        if (serviceIndex !== -1) {
            // 合并原有信息和更新的信息
            state.serviceList[serviceIndex] = {
                ...state.serviceList[serviceIndex],
                ...updatedInfo
            };
        }
    }
}; 