<template>
  <view class="cascade-selector-container" :style="{ width: width }">
    <choice-selected
      ref="comboboxRef"
      :defaultText="placeholder"
      :choiceIndex="selectedIndex"
      :choiceList="formattedOptions"
      :mode="searchable ? 'search' : 'select'"
      :searchPlaceholder="searchPlaceholder"
      @onChoiceClick="selectOption"
      @search-input="onSearch"
      :disabled="disabled"
    />
  </view>
</template>

<script>
import choiceSelected from '../combobox/combobox.vue'

/**
 * 级联选择组件
 * @description 用于实现级联选择的通用组件，基于combobox
 */
export default {
  name: 'CascadeSelector',
  components: {
    choiceSelected
  },
  props: {
    /**
     * 选项列表
     * @type {Array}
     * @default []
     */
    options: {
      type: Array,
      default: () => []
    },
    
    /**
     * 是否禁用
     * @type {Boolean}
     * @default false
     */
    disabled: {
      type: Boolean,
      default: false
    },
    
    /**
     * 占位文本
     * @type {String}
     * @default '请选择'
     */
    placeholder: {
      type: String,
      default: '请选择'
    },
    
    /**
     * 选中的值
     * @type {String|Number}
     * @default ''
     */
    value: {
      type: [String, Number],
      default: ''
    },
    
    /**
     * 是否支持搜索
     * @type {Boolean}
     * @default false
     */
    searchable: {
      type: Boolean,
      default: false
    },
    
    /**
     * 搜索框占位文本
     * @type {String}
     * @default '搜索'
     */
    searchPlaceholder: {
      type: String,
      default: '搜索'
    },
    
    /**
     * 下拉框宽度
     * @type {String}
     * @default '100%'
     */
    width: {
      type: String,
      default: '100%'
    }
  },
  
  data() {
    return {
      selectedIndex: -1,
      searchKeyword: ''
    }
  },
  
  computed: {
    /**
     * 格式化选项，将options转换为combobox需要的格式
     * @returns {Array} 格式化后的选项列表
     */
    formattedOptions() {
      return this.options.map(item => ({
        choiceItemId: item.value,
        choiceItemContent: item.label,
        choiceItemValue: item.value
      }));
    }
  },
  
  watch: {
    /**
     * 监听value变化，更新选中索引
     */
    value: {
      handler(newVal) {
        if (newVal) {
          const index = this.options.findIndex(item => item.value === newVal);
          this.selectedIndex = index;
        } else {
          this.selectedIndex = -1;
        }
      },
      immediate: true
    }
  },
  
  created() {
    // 创建时根据传入的value设置初始选中状态
    if (this.value) {
      const index = this.options.findIndex(item => item.value === this.value);
      this.selectedIndex = index;
    }
  },
  
  methods: {
    /**
     * 选择选项
     * @param {Number} index 选项索引
     */
    selectOption(index) {
      this.selectedIndex = index;
      const item = this.options[index];
      
      // 向父组件发送选择事件
      if (item) {
        this.$emit('input', item.value);
        this.$emit('change', item);
      }
    },
    
    /**
     * 搜索事件处理
     * @param {String} keyword 搜索关键词
     */
    onSearch(keyword) {
      this.searchKeyword = keyword;
      this.$emit('search', keyword);
    },
    
    /**
     * 关闭下拉框
     */
    closeDropdown() {
      // 使用ref获取组件实例
      if (this.$refs.comboboxRef && this.$refs.comboboxRef.closeDropdown) {
        this.$refs.comboboxRef.closeDropdown();
      }
    }
  }
}
</script>

<style>
.cascade-selector-container {
  position: relative;
  z-index: 100;
  font-size: 14px;
}
</style> 