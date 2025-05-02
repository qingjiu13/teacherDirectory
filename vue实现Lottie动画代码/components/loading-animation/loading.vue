<template>
	<view v-show="visible" class="loading-overlay">
		<c-lottie
			ref="lottieRef"
			:src="src"
			width="300rpx"
			height="300rpx"
			:loop="true"
			autoplay
		></c-lottie>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLottieReady } from './useLottieReady.js'

const props = defineProps({
	src: {
		type: String,
		default: 'https://lottie.host/1f64310d-d1a9-44c9-ac77-3c29ae849559/c3yfKGAzCm.json'
	}
})

/**
 * 内部可见性状态
 * @type {import('vue').Ref<boolean>}
 */
const visible = ref(false)

/**
 * Lottie组件引用
 * @type {import('vue').Ref<any>}
 */
const lottieRef = ref(null)

/**
 * 使用Lottie准备状态钩子
 */
const { isReady } = useLottieReady(lottieRef)

/**
 * 显示加载动画
 */
const show = () => {
	visible.value = true
}

/**
 * 隐藏加载动画
 */
const hide = () => {
	visible.value = false
}

/**
 * 组件挂载时确保Lottie组件正确初始化
 */
onMounted(() => {
	console.log('加载动画组件已挂载')
})

// 暴露方法给父组件
defineExpose({
	show,
	hide,
	isReady
})
</script>

<style scoped lang="scss">
.loading-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
}
</style>
