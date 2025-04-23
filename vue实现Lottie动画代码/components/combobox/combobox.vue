<template name="ChoiceSelected">
    <!-- 自定义下拉选择框 start-->
    <view class="selected-all" @click.stop>
        <view :class="isShowChoice ? 'drop-down-box-selected' : 'drop-down-box'" @click="btnShowHideClick" ref="dropdownTrigger">
            <!-- 统一的内容容器 -->
            <view class="input-content-wrapper">
                <!-- 纯下拉选择模式 -->
                <text v-if="mode === 'select'" :class="[choiceIndex === -1 ? 'input-placeholder' : 'input-text']">{{displayContent}}</text>
                
                <!-- 搜索筛选模式 -->
                <input 
                    v-else
                    type="text" 
                    class="input-text" 
                    v-model="searchKeyword" 
                    :placeholder="searchPlaceholder" 
                    @input="onSearchInput" 
                    @focus="onInputFocus"/>
            </view>
            
            <!-- 统一的箭头图标 -->
            <view class="arrow-container">
                <image class="dropdown-icon" :class="{'dropdown-icon-rotate': isShowChoice}" src="../../static/image/arrow/arrow_down.svg" mode="widthFix"></image>
            </view>
        </view>
        <!-- 弹框内容 -->
        <view class="dialog-view" :class="{active: isShowChoice}" v-if="isShowChoice" :style="{
            top: dropdownTop + 'px',
            left: dropdownLeft + 'px',
            width: dropdownWidth + 'px'
        }" @click.stop>
            <scroll-view scroll-y="true" class="dialog-scroll">
                <view v-if="filteredChoiceList.length > 0">
                    <text class="dialog-title" :class="{'dialog-title-selected': choiceIndex == index}"
                        v-for="(item, index) in filteredChoiceList" :key="index" @click="btnChoiceClick(index)">
                        {{typeof item === 'string' ? item : item.choiceItemContent}}
                    </text>
                </view>
                <view v-else class="empty-result">
                    <text class="empty-result-text">无匹配数据</text>
                </view>
            </scroll-view>
        </view>
    </view>
    <!-- 自定义下拉选择框 end -->
</template>

<script>
    let dropdownInstances = [];
    
    export default {
        name: "ChoiceSelected",
        data() {
            return {
                isShowChoice: false,
                dropdownTop: 0,
                dropdownLeft: 0,
                dropdownWidth: 0,
                displayContent: this.defaultText, // 使用传入的默认文本
                searchKeyword: '', // 搜索关键词
                searchTimer: null, // 防抖定时器
                filteredList: [], // 过滤后的列表
                isFocused: false // 是否处于聚焦状态
            };
        },
        props: {
            choiceIndex: {
                type: Number,
                default: -1 // 默认-1表示未选择
            },
            choiceList: {
                type: Array,
                default: () => []
            },
            defaultText: {
                type: String,
                default: '请选择'
            },
            mode: {
                type: String,
                default: 'select', // 'select' | 'search'
                validator: (value) => ['select', 'search'].includes(value)
            },
            debounce: {
                type: Number,
                default: 300
            },
            searchPlaceholder: {
                type: String,
                default: '请输入关键词'
            }
        },
        created() {
            // 将当前实例添加到实例数组，便于全局管理
            dropdownInstances.push(this);
        },
        beforeDestroy() {
            // 移除当前实例
            const index = dropdownInstances.indexOf(this);
            if (index > -1) {
                dropdownInstances.splice(index, 1);
            }
            // 清除防抖定时器
            if (this.searchTimer) {
                clearTimeout(this.searchTimer);
            }
        },
        computed: {
            /**
             * @description 根据搜索关键词过滤选项列表
             * @returns {Array} 过滤后的选项列表
             */
            filteredChoiceList() {
                if (!this.searchKeyword || this.mode === 'select') {
                    return this.choiceList;
                }
                
                const keyword = this.searchKeyword.toLowerCase();
                
                // 根据关键词过滤选项
                return this.choiceList.filter(item => {
                    if (typeof item === 'string') {
                        // 字符串类型选项
                        return item.toLowerCase().includes(keyword);
                    } else if (item && item.choiceItemContent) {
                        // 对象类型选项
                        return item.choiceItemContent.toLowerCase().includes(keyword);
                    }
                    return false; // 对于其他类型的项，排除
                });
            }
        },
        watch: {
            choiceIndex(newVal) {
                // 当choiceIndex变化时更新显示内容
                if (newVal >= 0 && newVal < this.choiceList.length) {
                    const selectedItem = this.choiceList[newVal];
                    this.displayContent = typeof selectedItem === 'string' ? selectedItem : selectedItem.choiceItemContent;
                    
                    // 在搜索模式下，设置搜索关键词为选中项
                    if (this.mode === 'search') {
                        this.searchKeyword = typeof selectedItem === 'string' ? selectedItem : selectedItem.choiceItemContent;
                    }
                } else {
                    this.displayContent = this.defaultText;
                    if (this.mode === 'search') {
                        this.searchKeyword = '';
                    }
                }
            },
            defaultText(newVal) {
                // 如果当前没有选择任何选项，更新默认文本
                if (this.choiceIndex < 0 || this.choiceIndex >= this.choiceList.length) {
                    this.displayContent = newVal;
                }
            }
        },
        methods: {
            /**
             * @description 处理选项点击事件，关闭下拉框并触发选择事件
             * @param {Number} position - 选中项的索引位置
             */
            btnChoiceClick: function(position) {
                var _this = this;
                _this.isShowChoice = false;
                
                // 在搜索模式下，我们需要找出在原始列表中的实际位置
                if (_this.mode === 'search' && _this.searchKeyword) {
                    const selectedItem = _this.filteredChoiceList[position];
                    
                    if (typeof selectedItem === 'string') {
                        // 字符串项，直接查找原始列表中的匹配项
                        const originalIndex = _this.choiceList.findIndex(item => 
                            typeof item === 'string' && item === selectedItem
                        );
                        if (originalIndex !== -1) {
                            _this.$emit("onChoiceClick", originalIndex);
                            return;
                        }
                    } else if (selectedItem && selectedItem.choiceItemId) {
                        // 对象项，通过ID查找
                        const originalIndex = _this.choiceList.findIndex(item => 
                            item && item.choiceItemId && item.choiceItemId === selectedItem.choiceItemId
                        );
                        if (originalIndex !== -1) {
                            _this.$emit("onChoiceClick", originalIndex);
                            return;
                        }
                    }
                }
                
                // 对于普通模式或未找到匹配项
                _this.$emit("onChoiceClick", position);
            },
            
            /**
             * @description 切换下拉框的显示与隐藏状态
             * @param {Event} event - 点击事件对象
             */
            btnShowHideClick: function(event) {
                // 阻止事件冒泡
                event.stopPropagation();
                
                var _this = this;
                if (_this.isShowChoice) {
                    _this.isShowChoice = false;
                } else {
                    // 关闭其他所有下拉框
                    this.closeOtherDropdowns();
                    
                    // 使用uni.createSelectorQuery获取触发按钮的位置和尺寸
                    const query = uni.createSelectorQuery().in(this);
                    query.select('.drop-down-box, .drop-down-box-selected').boundingClientRect(data => {
                        if (data) {
                            _this.dropdownTop = data.top + data.height;
                            _this.dropdownLeft = data.left;
                            _this.dropdownWidth = data.width;
                            _this.isShowChoice = true;
                        }
                    }).exec();
                }
            },
            
            /**
             * @description 关闭其他下拉框，只保留当前实例的下拉框
             */
            closeOtherDropdowns() {
                dropdownInstances.forEach(instance => {
                    if (instance !== this && instance.isShowChoice) {
                        instance.isShowChoice = false;
                    }
                });
            },
            
            /**
             * @description 处理搜索输入事件，带防抖
             * @param {Event} event - 输入事件对象
             */
            onSearchInput(event) {
                const _this = this;
                
                // 清除之前的定时器
                if (_this.searchTimer) {
                    clearTimeout(_this.searchTimer);
                }
                
                // 设置防抖定时器
                _this.searchTimer = setTimeout(() => {
                    // 触发搜索输入事件
                    _this.$emit('search-input', _this.searchKeyword);
                    
                    // 确保下拉框处于打开状态
                    if (!_this.isShowChoice) {
                        _this.btnShowHideClick(event);
                    }
                }, _this.debounce);
            },
            
            /**
             * @description 处理输入框聚焦事件
             * @param {Event} event - 聚焦事件对象
             */
            onInputFocus(event) {
                this.isFocused = true;
                // 如果下拉框未显示，阻止下拉框被关闭
                event.stopPropagation();
                
                // 如果下拉框未显示，则显示
                if (!this.isShowChoice) {
                    this.btnShowHideClick(event);
                }
            },
            
            /**
             * @description 关闭当前下拉框
             * @public 供外部调用
             */
            closeDropdown() {
                if (this.isShowChoice) {
                    this.isShowChoice = false;
                }
            }
        }
    }
</script>

<style>
    /* end */
    .dialog-title-selected {
        color: white;
        font-size: 28rpx;
        padding-left: 20rpx;
        padding-top: 8rpx;
        padding-bottom: 8rpx;
        padding-right: 15rpx;
        background-color: #55ffff;
    }

    .dialog-title {
        color: black;
        font-size: 28rpx;
        padding-left: 20rpx;
        padding-top: 8rpx;
        padding-bottom: 8rpx;
        padding-right: 15rpx;
        background-color: white;
    }
    
    .dialog-scroll {
        width: 100%;
        max-height: 300rpx; /* 限制滚动区域的最大高度 */
        -webkit-overflow-scrolling: touch; /* 提升iOS滚动体验 */
    }

    .dialog-view {
        display: flex;
        flex-direction: column;
        border: 2rpx solid #F0AD4E;
        box-sizing: border-box;
        position: fixed;
        z-index: 9999;
        background-color: #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-height: 400rpx; /* 限制整个下拉框的最大高度 */
        transform-origin: top center;
        opacity: 0;
        transform: scaleY(0);
        transition: all 0.2s ease;
        overflow: hidden; /* 确保内容不会溢出 */
        border-radius: 0 0 10rpx 10rpx; /* 增加底部圆角 */
    }
    
    .dialog-view.active {
        opacity: 1;
        transform: scaleY(1);
    }

    .dropdown-icon {
        width: 26rpx;
        height: 26rpx;
        margin-left: 5rpx;
        margin-right: 10rpx;
        transition: transform 0.3s ease;
        flex-shrink: 0;
    }
    
    .dropdown-icon-rotate {
        transform: rotate(180deg);
    }

    /* 统一的内容容器 */
    .input-content-wrapper {
        flex: 1;
        height: 60rpx;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }
    
    /* 统一的文本样式 */
    .input-text {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        height: 50rpx;
        line-height: 50rpx;
        padding-left: 20rpx;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
    }
    
    .input-placeholder {
        flex: 1;
        font-size: 28rpx;
        color: #999;
        height: 50rpx;
        line-height: 50rpx;
        padding-left: 20rpx;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
    }

    .drop-down-box-selected {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 60rpx;
        width: 100%;
        border: 2rpx solid #F0AD4E;
        box-sizing: border-box;
        padding: 0 10rpx;
        border-radius: 10rpx;
    }

    .drop-down-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 60rpx;
        width: 100%;
        border: 2rpx solid gray;
        border-radius: 10rpx;
        box-sizing: border-box;
        padding: 0 10rpx;
    }

    .selected-all {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
    }
    
    /* 箭头容器 */
    .arrow-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 5rpx;
        width: 30rpx;
        height: 60rpx;
        flex-shrink: 0;
        z-index: 2;
    }
    
    .empty-result {
        display: flex;
        justify-content: center;
        padding: 20rpx 0;
    }
    
    .empty-result-text {
        color: #999;
        font-size: 28rpx;
    }

    /* start */
</style>
 