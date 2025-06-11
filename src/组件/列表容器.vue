<template>
	<div class="colLayout">
		<div class="flexGrow">
			<div class="scroll" @scroll="scroll">
				<div v-for="(item, index) in 列表" class="行间距">
					<slot name="item" :列表项="item" :索引="index"></slot>
				</div>
			</div>
		</div>

		<div class="noShrink">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script setup>
// 属性
const { 列表, 滚动事件 } = defineProps(['列表', '滚动事件']);

// 方法
let scroll = function () {};
if (滚动事件) {
	scroll = 滚动事件;
}
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';

.colLayout {
	height: 100%;
	overflow: hidden;
	> .flexGrow {
		overflow: hidden;
		padding: 20rem;
		padding-right: 0;
		display: grid;
		> .scroll {
			position: relative;
			overflow: auto;
			padding-right: 20rem;
			> .行间距 + .行间距 {
				margin-top: 16rem;
			}
		}
	}
}
</style>
