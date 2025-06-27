// store/global.js
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    apiBaseUrl: 'http://v8e5bd5f.natappfree.cc', // 你的全局请求前缀
    // apiBaseUrl: 'http://47.109.207.44:8088', // 你的全局请求前缀
  }),
})
