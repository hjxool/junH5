<template>
	<div class="header rowLayout">
		<div class="左边 rowLayout" @click="返回事件()">
			<img class="icon" src="/图片资源/icon/icon2.png" />
		</div>

		<div class="title">
			<slot name="title"></slot>
		</div>

		<div class="右边">
			<slot name="事件"></slot>
		</div>
	</div>
</template>

<script setup>
const { 返回事件 } = defineProps(['返回事件']);
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
.header {
	justify-content: center;
	// padding: 30rem 0 20rem 0;
	height: 100%;
	position: relative;
	> .左边 {
		position: absolute;
		left: 50rem;
		width: 60rem;
		height: 60rem;
		> .icon {
			width: 20rem;
			height: 32rem;
		}
	}
	> .title {
		font-family: Microsoft YaHei;
		font-weight: 400;
		font-size: 30rem;
		color: #fff;
	}
	> .右边 {
		position: absolute;
		right: 30rem;
	}
}
</style>
