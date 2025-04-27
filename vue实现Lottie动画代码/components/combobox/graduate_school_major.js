import schoolData from '../../store/data/school_graduate_changed.json'

export default {
  state: {
    schools: schoolData,        // 原始学校+专业数据
    schoolKeyword: '',          // 搜索学校的关键词
    selectedSchool: '',         // 选择的学校名
    majorKeyword: ''            // 搜索专业的关键词
  },
  getters: {
    // 学校列表（根据学校关键词筛选，顺序模糊匹配）
    filteredSchoolList(state) {
      if (!state.schoolKeyword) {
        return Object.keys(state.schools);
      }
      
      try {
        // 转义特殊字符
        const escapedKeyword = state.schoolKeyword.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // 构建顺序模糊匹配模式：每个字符之间可以有任意字符
        const pattern = escapedKeyword.split('').join('.*');
        const reg = new RegExp(pattern, 'i'); // 忽略大小写
        
        return Object.keys(state.schools).filter(name => reg.test(name));
      } catch (error) {
        console.error('学校筛选出错:', error);
        // 出错时回退到简单匹配
        return Object.keys(state.schools).filter(name => 
          name.toLowerCase().includes(state.schoolKeyword.toLowerCase())
        );
      }
    },
    
    // 当前学校下的专业（根据专业关键词筛选，顺序模糊匹配）
    filteredMajorList(state) {
      if (!state.selectedSchool) {
        return [];
      }
      
      const majors = state.schools[state.selectedSchool] || [];
      
      if (!state.majorKeyword) {
        return majors;
      }
      
      try {
        // 转义特殊字符
        const escapedKeyword = state.majorKeyword.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // 构建顺序模糊匹配模式：每个字符之间可以有任意字符
        const pattern = escapedKeyword.split('').join('.*');
        const reg = new RegExp(pattern, 'i'); // 忽略大小写
        
        return majors.filter(major => reg.test(major));
      } catch (error) {
        console.error('专业筛选出错:', error);
        // 出错时回退到简单匹配
        return majors.filter(major => 
          major.toLowerCase().includes(state.majorKeyword.toLowerCase())
        );
      }
    }
  },
  mutations: {
    setSchoolKeyword(state, keyword) {
      state.schoolKeyword = keyword;
    },
    setSelectedSchool(state, schoolName) {
      state.selectedSchool = schoolName;
      state.majorKeyword = ''; // 切换学校时，清空专业搜索
    },
    setMajorKeyword(state, keyword) {
      state.majorKeyword = keyword;
    }
  },
  actions: {
    updateSchoolKeyword({ commit }, keyword) {
      commit('setSchoolKeyword', keyword);
    },
    updateSelectedSchool({ commit }, schoolName) {
      commit('setSelectedSchool', schoolName);
    },
    updateMajorKeyword({ commit }, keyword) {
      commit('setMajorKeyword', keyword);
    }
  }
}
