<template>
	<div class="页面">
		<div class="背景图">
			<img class="bgImg" src="/图片资源/di.png" />
		</div>

		<div class="header">
			<slot name="header"></slot>
		</div>

		<div class="commonPageBody">
			<slot name="body"></slot>
		</div>
	</div>
</template>

<script setup></script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
.页面 {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	overflow: hidden;
	z-index: 10;
	padding-top: 130rem;
	> .背景图 {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 608rem;
	}
	> .header {
		position: absolute;
		left: 0;
		top: 70rem;
		width: 100%;
	}
	> .commonPageBody {
		background: #ececec;
		border-radius: 60rem 60rem 0 0;
		height: 100%;
		overflow: hidden;
		position: relative;
		display: grid;
	}
}
</style>
