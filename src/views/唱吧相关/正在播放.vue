<template>
	<div class="容器 rowLayout">
		<div class="textEllipsis flexGrow" style="margin-right: 20rem">{{ 当前播放.name }}</div>

		<img class="button" @click="$emit('跳转视频')" src="/图片资源/icon/icon16.png" />
		<img v-show="正在播放" class="button" @click="播放()" src="/图片资源/icon/icon17.png" />
		<div v-show="!正在播放" class="button center" @click="播放()" style="background: #fff8f9">
			<img class="icon" src="/图片资源/icon7.png" />
		</div>
		<img class="button" @click="切换下一首()" src="/图片资源/icon/icon18.png" />
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { 发送指令 } from '@/Api/唱吧.js';

// 属性
const { 当前播放 } = defineProps(['当前播放']);
const emit = defineEmits(['刷新']);
const 正在播放 = ref(true);

// 方法
function 播放() {
	正在播放.value = !正在播放.value;
	发送指令(当前播放.id, 正在播放.value ? '播放' : '暂停');
}
async function 切换下一首() {
	await 发送指令(当前播放.id, '切换');
	emit('刷新');
}
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
.容器 {
	height: 120rem;
	padding: 0 30rem;
	background: #f22f55;
	color: #fff;
	font-size: 26rem;
	width: 100%;
	.button {
		background: #fdd9e0;
		border-radius: 50%;
		width: 60rem;
		height: 60rem;
		& + .button {
			margin-left: 40rem;
		}
		> .icon {
			width: 20rem;
			height: 26rem;
			position: relative;
			left: 2rem;
		}
	}
}
</style>
