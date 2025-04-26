/**
 * Vuex调试工具
 * 帮助诊断Vuex注入和状态问题
 * 仅支持Vue 3
 */

/**
 * 安装调试插件
 * @param {Object} store - Vuex store实例
 */
export const installDebugPlugin = (store) => {
  // 添加订阅插件
  store.subscribeAction({
    before: (action, state) => {
      console.log(`即将执行action: ${action.type}，参数:`, action.payload);
    },
    after: (action, state) => {
      console.log(`action: ${action.type} 执行完成`);
    }
  });
  
  // 添加调试方法到全局对象
  if (typeof window !== 'undefined') {
    window.debugVuex = {
      // 检查store是否可用
      checkStore: () => {
        const result = {
          storeExists: !!store,
          modules: store ? Object.keys(store._modules?.root?.children || {}) : [],
          modulesNamespaceMap: store ? Object.keys(store._modulesNamespaceMap || {}) : [],
          state: store ? JSON.parse(JSON.stringify(store.state)) : null
        };
        console.log('Vuex Store 状态:', result);
        return result;
      },
      
      // 检查特定模块是否存在
      checkModule: (modulePath) => {
        const exists = !!store?._modulesNamespaceMap[`${modulePath}/`];
        console.log(`模块 ${modulePath} ${exists ? '存在' : '不存在'}`);
        return exists;
      },
      
      // 检查特定state是否存在
      getState: (path) => {
        try {
          const parts = path.split('.');
          let current = store.state;
          for (const part of parts) {
            current = current[part];
            if (current === undefined) {
              console.warn(`路径 ${path} 在 ${part} 处中断`);
              return undefined;
            }
          }
          console.log(`状态 ${path}:`, current);
          return current;
        } catch (error) {
          console.error(`获取状态 ${path} 时出错:`, error);
          return undefined;
        }
      }
    };
    
    console.log('Vuex调试工具已安装，可以使用 debugVuex 对象进行调试');
  }
};

/**
 * 为Vue 3应用安装Vuex调试工具
 * @param {Object} app - Vue 3应用实例
 * @param {Object} store - Vuex store实例
 */
export const installDebugForVue3 = (app, store) => {
  if (!app || !store) {
    console.error('应用或store不可用，无法安装调试工具');
    return;
  }
  
  // 使用provide提供store（增强依赖注入）
  app.provide('store', store);
  
  // 添加调试钩子
  app.mixin({
    created() {
      // 在根组件中检查store可用性
      if (!this.$parent) {
        console.log('根组件创建，Vue 3环境');
        
        // 获取store (Vue 3中通过全局属性获取)
        const storeRef = this.$store || app.config.globalProperties.$store;
        
        if (!storeRef) {
          console.error('$store在根组件中未定义 (Vue 3)');
        } else {
          console.log('$store在根组件中可用 (Vue 3)');
          
          // 检查基本模块
          try {
            console.log('检查Vuex模块...');
            const userModuleExists = store._modulesNamespaceMap['user/'];
            console.log('user模块存在:', !!userModuleExists);
            
            const baseInfoModuleExists = store._modulesNamespaceMap['user/baseInfo/'];
            console.log('user/baseInfo模块存在:', !!baseInfoModuleExists);
          } catch (error) {
            console.error('检查模块时出错:', error);
          }
        }
      }
    }
  });
  
  console.log('Vue 3调试混入已安装');
}; 