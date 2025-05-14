<template name="ChoiceSelected">
    <!-- 自定义下拉选择框 start-->
    <view class="selected-all" @click.stop @touchmove="handlePageScroll">
        <view :class="isShowChoice ? 'drop-down-box-selected' : 'drop-down-box'" @click="btnShowHideClick" ref="dropdownTrigger">
            <!-- 统一的内容容器 -->
            <view class="input-content-wrapper">
                <!-- 纯下拉选择模式 -->
                <text v-if="mode === 'select'" :class="[choiceIndex === -1 ? 'input-placeholder' : 'input-placeholder-selected']" >{{displayContent}}</text>
                
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
                <image class="dropdown-icon" :class="{'dropdown-icon-rotate': isShowChoice}" src="/static/image/arrow/arrow_down.svg" mode="widthFix"></image>
            </view>
        </view>
        <!-- 弹框内容 -->
        <view class="dialog-view" :class="{active: isShowChoice}" v-if="isShowChoice" :style="{
            top: dropdownTop + 'px',
            left: dropdownLeft + 'px',
            width: dropdownWidth + 'px'
        }" @click.stop>
            <scroll-view 
                scroll-y="true" 
                class="dialog-scroll" 
                @scrolltolower="onScrollToBottom" 
                ref="scrollView">
                <view v-if="pagedChoiceList.length > 0">
                    <text class="dialog-title" :class="{'dialog-title-selected': choiceIndex == findOriginalIndex(item)}"
                        v-for="(item, index) in pagedChoiceList" :key="index" @click="btnChoiceClick(index)">
                        {{typeof item === 'string' ? item : item.choiceItemContent}}
                    </text>
                </view>
                <view v-else class="empty-result">
                    <text class="empty-result-text">无匹配数据</text>
                </view>
                
                <!-- 加载更多提示 -->
                <view v-if="isLoadingMore" class="loading-more">
                    <text class="loading-text">加载中...</text>
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
        components: {
        },
        data() {
            return {
                isShowChoice: false,
                dropdownTop: 0,
                dropdownLeft: 0,
                dropdownWidth: 0,
                displayContent: this.defaultText, // 使用传入的默认文本
                searchKeyword: this.defaultSearchValue || '', // 初始化搜索关键词，优先使用defaultSearchValue
                searchTimer: null, // 防抖定时器
                isFocused: false, // 是否处于聚焦状态
                lastSelectedValue: null, // 上次选中的值，用于检测变化
                
                // 分页相关
                pageSize: 10, // 每页显示数量
                currentPage: 1, // 当前页码
                isLoadingMore: false, // 是否正在加载更多
                hasMoreItems: true, // 是否还有更多数据
                
                // 滚动监听
                pageScrollListener: null // 页面滚动监听器
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
            },
            // 新增属性：组件类型，用于区分不同数据模式
            componentType: {
                type: String,
                default: 'default', // 'default' | 'undergraduate' | 'graduateSchool' | 'graduateMajor'
                validator: (value) => ['default', 'undergraduate', 'graduateSchool', 'graduateMajor'].includes(value)
            },
            // 新增属性：父级选择的值，用于联动模式
            parentValue: {
                type: [String, Object, Number],
                default: null
            },
            // 新增属性：是否属于联动模式
            isLinkage: {
                type: Boolean,
                default: false
            },
            // 新增属性：是否自动关闭其他下拉框
            autoCloseOthers: {
                type: Boolean,
                default: true
            },
            // 新增属性：是否启用分页加载功能
            enablePagination: {
                type: Boolean,
                default: true
            },
            // 新增属性：默认搜索值，当有值时直接显示但保持搜索功能
            defaultSearchValue: {
                type: String,
                default: ''
            }
        },
        created() {
            // 将当前实例添加到实例数组，便于全局管理
            dropdownInstances.push(this);
            
            // 注册全局触摸开始事件用于检测滚动
            uni.$on('page-scroll', this.handlePageScroll);
        },
        beforeUnmount() {
            // 解绑全局事件
            uni.$off('page-scroll', this.handlePageScroll);
            
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
             * @description 获取当前页的选项列表
             * @returns {Array} 分页后的选项列表
             */
            pagedChoiceList() {
                if (!this.enablePagination) {
                    return this.choiceList;
                }
                
                const startIndex = 0;
                const endIndex = this.currentPage * this.pageSize;
                
                return this.choiceList.slice(startIndex, endIndex);
            }
        },
        watch: {
            choiceIndex(newVal) {
                // 当choiceIndex变化时更新显示内容
                if (newVal >= 0 && newVal < this.choiceList.length) {
                    const selectedItem = this.choiceList[newVal];
                    this.displayContent = typeof selectedItem === 'string' ? selectedItem : selectedItem.choiceItemContent;
                    
                    // 保存上次选中的值
                    this.lastSelectedValue = selectedItem;
                    
                    // 在搜索模式下，设置搜索关键词为选中项
                    if (this.mode === 'search') {
                        this.searchKeyword = typeof selectedItem === 'string' ? selectedItem : selectedItem.choiceItemContent;
                    }
                    
                    // 如果是联动模式的父级组件，触发联动事件
                    if (this.componentType === 'graduateSchool') {
                        this.$emit('linkage-change', selectedItem);
                    }
                } else {
                    this.displayContent = this.defaultText;
                    this.lastSelectedValue = null;
                    if (this.mode === 'search') {
                        this.searchKeyword = this.defaultSearchValue || '';
                    }
                    
                    // 如果是联动模式的父级组件，触发联动事件（清空）
                    if (this.componentType === 'graduateSchool') {
                        this.$emit('linkage-change', null);
                    }
                }
            },
            defaultText(newVal) {
                // 如果当前没有选择任何选项，更新默认文本
                if (this.choiceIndex < 0 || this.choiceIndex >= this.choiceList.length) {
                    this.displayContent = newVal;
                }
            },
            // 监听父级选择变化，适用于联动模式
            parentValue(newVal) {
                if (this.isLinkage && this.componentType === 'graduateMajor') {
                    // 父级值变化，清空当前选择
                    this.searchKeyword = this.defaultSearchValue || '';
                    this.displayContent = this.defaultText;
                    this.$emit('reset-selection');
                }
            },
            // 监听选项列表变化，重新计算显示内容
            choiceList() {
                // 如果选项列表变化，且当前有选中项，更新显示内容
                this.updateDisplayContent();
            },
            // 监听搜索关键词变化，重置分页
            searchKeyword() {
                this.resetPagination();
            },
            // 监听defaultSearchValue变化
            defaultSearchValue(newVal) {
                // 仅当没有选中项或搜索关键词为空时更新搜索关键词
                if ((this.choiceIndex < 0 || this.choiceIndex >= this.choiceList.length) && !this.searchKeyword) {
                    this.searchKeyword = newVal || '';
                    
                    // 如果有新的默认值，并且当前下拉列表已打开，则触发一次搜索
                    if (newVal && this.isShowChoice) {
                        this.onSearchInput({});
                    }
                }
            }
        },
        methods: {
            /**
             * @description 处理页面滚动事件
             * 当页面滚动时关闭下拉框
             */
            handlePageScroll() {
                if (this.isShowChoice) {
                    this.closeDropdown();
                }
            },
            
            /**
             * @description 重置分页状态
             */
            resetPagination() {
                this.currentPage = 1;
                this.isLoadingMore = false;
                this.hasMoreItems = this.choiceList.length > this.pageSize;
            },
            
            /**
             * @description 加载更多数据
             */
            loadMore() {
                if (!this.hasMoreItems || this.isLoadingMore) return;
                
                this.isLoadingMore = true;
                
                // 模拟异步加载更多数据
                setTimeout(() => {
                    this.currentPage++;
                    this.isLoadingMore = false;
                    
                    // 更新是否还有更多数据的状态
                    this.hasMoreItems = this.choiceList.length > this.currentPage * this.pageSize;
                }, 300);
            },
            
            /**
             * @description 处理滚动到底部事件
             */
            onScrollToBottom() {
                if (this.enablePagination) {
                    this.loadMore();
                }
            },
            
            /**
             * @description 查找选项在原始列表中的索引
             * @param {*} item - 选项项
             * @returns {Number} 原始索引位置
             */
            findOriginalIndex(item) {
                if (typeof item === 'string') {
                    return this.choiceList.findIndex(originalItem => 
                        typeof originalItem === 'string' && originalItem === item
                    );
                } else if (item && item.choiceItemId) {
                    return this.choiceList.findIndex(originalItem => 
                        originalItem && originalItem.choiceItemId && originalItem.choiceItemId === item.choiceItemId
                    );
                }
                return -1;
            },
            
            /**
             * @description 更新显示内容，在选项列表变化时调用
             */
            updateDisplayContent() {
                if (this.choiceIndex >= 0 && this.choiceIndex < this.choiceList.length) {
                    const selectedItem = this.choiceList[this.choiceIndex];
                    this.displayContent = typeof selectedItem === 'string' ? selectedItem : selectedItem.choiceItemContent;
                } else {
                    this.displayContent = this.defaultText;
                }
            },
            
            /**
             * @description 处理选项点击事件，关闭下拉框并触发选择事件
             * @param {Number} position - 选中项的索引位置
             */
            btnChoiceClick: function(position) {
                var _this = this;
                _this.isShowChoice = false;
                
                const selectedItem = _this.pagedChoiceList[position];
                
                // 在搜索模式下，我们需要找出在原始列表中的实际位置
                if (_this.mode === 'search' && _this.searchKeyword) {
                    if (typeof selectedItem === 'string') {
                        // 字符串项，直接查找原始列表中的匹配项
                        const originalIndex = _this.choiceList.findIndex(item => 
                            typeof item === 'string' && item === selectedItem
                        );
                        if (originalIndex !== -1) {
                            _this.$emit("onChoiceClick", originalIndex, selectedItem);
                            return;
                        }
                    } else if (selectedItem && selectedItem.choiceItemId) {
                        // 对象项，通过ID查找
                        const originalIndex = _this.choiceList.findIndex(item => 
                            item && item.choiceItemId && item.choiceItemId === selectedItem.choiceItemId
                        );
                        if (originalIndex !== -1) {
                            _this.$emit("onChoiceClick", originalIndex, selectedItem);
                            return;
                        }
                    }
                }
                
                // 对于普通模式或未找到匹配项，使用当前位置
                _this.$emit("onChoiceClick", position, selectedItem);
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
                    // 关闭其他所有下拉框（如果启用了自动关闭）
                    if (this.autoCloseOthers) {
                        this.closeOtherDropdowns();
                    }
                    
                    // 重置分页状态
                    this.resetPagination();
                    
                    // 使用uni.createSelectorQuery获取触发按钮的位置和尺寸
                    const query = uni.createSelectorQuery().in(this);
                    query.select('.drop-down-box, .drop-down-box-selected').boundingClientRect(data => {
                        if (data) {
                            _this.dropdownTop = data.top + data.height;
                            _this.dropdownLeft = data.left;
                            _this.dropdownWidth = data.width;
                            _this.isShowChoice = true;
                            
                            // 如果有默认搜索值并且当前没有搜索关键词，则立即触发一次搜索
                            if (_this.defaultSearchValue && !_this.searchKeyword) {
                                _this.searchKeyword = _this.defaultSearchValue;
                                _this.onSearchInput(event);
                            }
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
                    console.log('发送搜索请求:', _this.searchKeyword);
                    
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
                
                // 使用KeyboardWatcher的openWhenReady方法
                if (!this.isShowChoice && this.$refs.keyboardWatcher) {
                    this.$refs.keyboardWatcher.openWhenReady(this);
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
            },
            
            /**
             * @description 重置组件状态
             * @public 供外部调用
             */
            reset() {
                this.searchKeyword = this.defaultSearchValue || '';
                this.displayContent = this.defaultText;
                this.isShowChoice = false;
                this.lastSelectedValue = null;
                this.resetPagination();
                this.$emit('reset-selection');
            },
            
            /**
             * @description 获取当前选中的值
             * @returns {*} 当前选中的值
             * @public 供外部调用
             */
            getSelectedValue() {
                if (this.choiceIndex >= 0 && this.choiceIndex < this.choiceList.length) {
                    return this.choiceList[this.choiceIndex];
                }
                return null;
            },
            
            /**
             * @description 公开方法，供KeyboardWatcher调用以打开下拉框
             * @public
             */
            openDropdown() {
                // 使用现有的按钮点击方法，但创建一个合成事件对象
                const syntheticEvent = {
                    stopPropagation: () => {}
                };
                this.btnShowHideClick(syntheticEvent);
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
        height: 70rpx;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }
    
    /* 统一的文本样式 */
    .input-text {
        font-family: PingFang SC;
        flex: 1;
        font-size: 28rpx;
        color: rgba(0, 0, 0, 1);
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
        color: rgba(0, 0, 0, 0.5);
        height: 50rpx;
        line-height: 50rpx;
        padding-left: 20rpx;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
        margin-top: 10rpx;
    }
    .input-placeholder-selected {
        flex: 1;
        font-size: 28rpx;
        color: rgba(0, 0, 0, 1);
        height: 50rpx;
        line-height: 50rpx;
        padding-left: 20rpx;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
        margin-top: 10rpx;
    }

    .drop-down-box-selected {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 70rpx;
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
        height: 70rpx;
        width: 100%;
        border-radius: 10rpx;
        box-sizing: border-box;
        padding: 0 10rpx;
    }

    .selected-all {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        background-color: rgba(255, 255, 255, 1);
        border: 2rpx solid rgba(151, 151, 151, 1);
        border-radius: 8rpx;
    }
    
    /* 箭头容器 */
    .arrow-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 5rpx;
        width: 30rpx;
        height: 10rpx;
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
    
    /* 加载更多样式 */
    .loading-more {
        display: flex;
        justify-content: center;
        padding: 10rpx 0;
        background-color: #f8f8f8;
    }
    
    .loading-text {
        color: #999;
        font-size: 24rpx;
    }

    /* start */
</style>
 