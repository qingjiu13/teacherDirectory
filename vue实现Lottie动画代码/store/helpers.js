/**
 * Vuex辅助函数工具，用于简化模块的使用
 * @module store/helpers
 */
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { computed } from 'vue'
import { useStore } from 'vuex'

/**
 * 创建指定命名空间的映射函数 (选项式API)
 * @param {string} namespace - 模块的命名空间
 * @returns {Object} 返回映射函数对象
 */
export const createNamespacedHelpers = namespace => {
  return {
    mapState: states => mapState(namespace, states),
    mapGetters: getters => mapGetters(namespace, getters),
    mapActions: actions => mapActions(namespace, actions),
    mapMutations: mutations => mapMutations(namespace, mutations)
  }
}

/**
 * 创建组合式API的辅助函数 (setup函数中使用)
 * @param {string} namespace - 模块的命名空间
 * @returns {Object} 返回组合式API辅助函数
 */
export const createComposableHelpers = namespace => {
  /**
   * 在组合式API中使用Vuex State
   * @param {Array|Object} states - 需要映射的state名称数组或对象
   * @returns {Object} 包含响应式state的对象
   */
  const useState = (states) => {
    const store = useStore()
    
    if (Array.isArray(states)) {
      return states.reduce((prev, stateName) => {
        prev[stateName] = computed(() => store.state[namespace][stateName])
        return prev
      }, {})
    }
    
    return Object.keys(states).reduce((prev, key) => {
      const stateName = states[key]
      prev[key] = computed(() => store.state[namespace][stateName])
      return prev
    }, {})
  }
  
  /**
   * 在组合式API中使用Vuex Getters
   * @param {Array|Object} getters - 需要映射的getter名称数组或对象
   * @returns {Object} 包含响应式getter的对象
   */
  const useGetters = (getters) => {
    const store = useStore()
    
    if (Array.isArray(getters)) {
      return getters.reduce((prev, getterName) => {
        const fullGetterName = `${namespace}/${getterName}`
        prev[getterName] = computed(() => store.getters[fullGetterName])
        return prev
      }, {})
    }
    
    return Object.keys(getters).reduce((prev, key) => {
      const getterName = getters[key]
      const fullGetterName = `${namespace}/${getterName}`
      prev[key] = computed(() => store.getters[fullGetterName])
      return prev
    }, {})
  }
  
  /**
   * 在组合式API中使用Vuex Actions
   * @param {Array|Object} actions - 需要映射的action名称数组或对象
   * @returns {Object} 包含actions方法的对象
   */
  const useActions = (actions) => {
    const store = useStore()
    
    if (Array.isArray(actions)) {
      return actions.reduce((prev, actionName) => {
        const fullActionName = `${namespace}/${actionName}`
        prev[actionName] = payload => store.dispatch(fullActionName, payload)
        return prev
      }, {})
    }
    
    return Object.keys(actions).reduce((prev, key) => {
      const actionName = actions[key]
      const fullActionName = `${namespace}/${actionName}`
      prev[key] = payload => store.dispatch(fullActionName, payload)
      return prev
    }, {})
  }
  
  /**
   * 在组合式API中使用Vuex Mutations
   * @param {Array|Object} mutations - 需要映射的mutation名称数组或对象
   * @returns {Object} 包含mutations方法的对象
   */
  const useMutations = (mutations) => {
    const store = useStore()
    
    if (Array.isArray(mutations)) {
      return mutations.reduce((prev, mutationName) => {
        const fullMutationName = `${namespace}/${mutationName}`
        prev[mutationName] = payload => store.commit(fullMutationName, payload)
        return prev
      }, {})
    }
    
    return Object.keys(mutations).reduce((prev, key) => {
      const mutationName = mutations[key]
      const fullMutationName = `${namespace}/${mutationName}`
      prev[key] = payload => store.commit(fullMutationName, payload)
      return prev
    }, {})
  }
  
  return { useState, useGetters, useActions, useMutations }
}

/**
 * 用户模块辅助函数 (选项式API)
 */
export const userModule = createNamespacedHelpers('user')

/**
 * 用户基本信息模块辅助函数 (选项式API)
 */
export const userBaseInfoModule = createNamespacedHelpers('user/baseInfo')

/**
 * 聊天模块辅助函数 (选项式API)
 */
export const chatModule = createNamespacedHelpers('user/chat')

/**
 * AI聊天模块辅助函数 (选项式API)
 */
export const aiChatModule = createNamespacedHelpers('user/ai-chat')

/**
 * 用户模块组合式API辅助函数 (setup函数中使用)
 */
export const useUserModule = createComposableHelpers('user')

/**
 * 用户基本信息模块组合式API辅助函数 (setup函数中使用)
 */
export const useUserBaseInfoModule = createComposableHelpers('user/baseInfo')

/**
 * 聊天模块组合式API辅助函数 (setup函数中使用)
 */
export const useChatModule = createComposableHelpers('user/chat')

/**
 * AI聊天模块组合式API辅助函数 (setup函数中使用)
 */
export const useAiChatModule = createComposableHelpers('user/ai-chat') 