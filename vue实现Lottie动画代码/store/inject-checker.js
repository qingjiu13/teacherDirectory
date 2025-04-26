/**
 * 用于确保Vuex store被正确注入到Vue实例
 * 仅支持Vue 3
 */
import { getCurrentInstance, inject } from 'vue'

/**
 * 检查store是否可用的方法
 * @param {Object} store - Vuex store实例
 * @returns {boolean} 返回store是否可用
 */
export const checkStoreAvailability = (store) => {
  if (!store) {
    console.error('store参数未提供');
    return false;
  }
  
  // 检查user模块是否注册
  try {
    const userState = store.state.user;
    if (!userState) {
      console.error('user模块不存在');
      return false;
    }
    
    // 检查baseInfo子模块
    if (!userState.baseInfo) {
      console.error('user/baseInfo模块不存在');
      return false;
    }
    
    console.log('Vuex store正常可用');
    return true;
  } catch (error) {
    console.error('检查Vuex模块时出错:', error);
    return false;
  }
};

/**
 * 为组件注入$store安全访问方法的混入 (Vue 3版本)
 */
export const injectStoreSafety = {
  beforeCreate() {
    // 创建安全访问对象
    this.$safeStore = createSafeStoreAccess();
  }
};

/**
 * 创建安全访问store的方法
 * 仅支持Vue 3
 * @returns {Object} 安全访问方法对象
 */
function createSafeStoreAccess() {
  return {
    // 安全获取state
    state: (path) => {
      try {
        // 获取store (Vue 3方式)
        const store = getStoreFromComponent();
        if (!store) return null;
        
        const parts = path.split('.');
        let current = store.state;
        
        for (const part of parts) {
          if (!current || typeof current !== 'object') return null;
          current = current[part];
        }
        
        return current;
      } catch (error) {
        console.error(`安全获取state路径 ${path} 时出错:`, error);
        return null;
      }
    },
    
    // 安全调用getter
    getter: (name) => {
      try {
        const store = getStoreFromComponent();
        return store && store.getters[name];
      } catch (error) {
        console.error(`安全获取getter ${name} 时出错:`, error);
        return null;
      }
    },
    
    // 安全dispatch
    dispatch: (type, payload) => {
      try {
        const store = getStoreFromComponent();
        if (!store) {
          console.warn(`store不可用，dispatch ${type} 被跳过`);
          return Promise.resolve(null);
        }
        return store.dispatch(type, payload);
      } catch (error) {
        console.error(`安全调用dispatch ${type} 时出错:`, error);
        return Promise.reject(error);
      }
    },
    
    // 安全commit
    commit: (type, payload) => {
      try {
        const store = getStoreFromComponent();
        if (!store) {
          console.warn(`store不可用，commit ${type} 被跳过`);
          return;
        }
        store.commit(type, payload);
      } catch (error) {
        console.error(`安全调用commit ${type} 时出错:`, error);
      }
    }
  };
}

/**
 * 从组件实例获取store
 * 仅支持Vue 3
 * @returns {Object|null} Vuex store或null
 */
function getStoreFromComponent() {
  // Vue 3方式 - 使用getCurrentInstance或inject
  const instance = getCurrentInstance();
  
  // 尝试从当前实例获取
  if (instance && instance.proxy && instance.proxy.$store) {
    return instance.proxy.$store;
  }
  
  // 尝试使用inject获取
  try {
    const storeFromInject = inject('store', null);
    if (storeFromInject) {
      return storeFromInject;
    }
  } catch (e) {
    // inject可能不在setup上下文中被调用
    console.debug('注入store失败:', e);
  }
  
  // 尝试从app实例中获取
  try {
    const app = getApp();
    if (app && app.$vm && app.$vm.$store) {
      return app.$vm.$store;
    }
  } catch (e) {
    console.warn('无法从app获取store:', e);
  }
  
  // 尝试从uni全局对象获取
  if (typeof uni !== 'undefined' && uni.$store) {
    return uni.$store;
  }
  
  // 所有方法都失败
  console.warn('无法获取store实例');
  return null;
} 