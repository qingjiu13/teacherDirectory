import schoolList from '../../store/data/2886所大学.json'

export default {
  state: {
    schools: schoolList,
    filterKeyword: ''
  },
  getters: {
    filteredSchools(state) {
      if (!state.filterKeyword) {
        return state.schools;
      }
      const keywordChars = state.filterKeyword.split('');
      return state.schools.filter(name => {
        return keywordChars.every(char => name.includes(char));
      });
    }
  },
  mutations: {
    setFilterKeyword(state, keyword) {
      state.filterKeyword = keyword;
    }
  },
  actions: {
    updateFilterKeyword({ commit }, keyword) {
      commit('setFilterKeyword', keyword);
    }
  }
}
