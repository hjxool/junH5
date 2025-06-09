<template>
	<div class="flexGrow" style="overflow-x: hidden">
		<var-index-bar duration="300" @change="跳转首字母($event)" :sticky="false" highlight-color="rgb(244, 64, 52)">
			<div v-for="item in 列表" :key="item.首字母">
				<var-index-anchor class="首字母" :index="item.首字母">{{ item.首字母 }}</var-index-anchor>

				<var-cell v-for="item2 in item.list">
					<div class="歌手 rowLayout">
						<div class="icon"></div>
						<span class="name">{{ item2.name }}</span>
					</div>
				</var-cell>
			</div>
		</var-index-bar>
	</div>
</template>

<script setup>
import { ref } from 'vue';

// 属性
const { 歌手列表 } = defineProps(['歌手列表']);
const 列表 = ref([]);
初始化();

// 方法
function 初始化() {
	for (let i = 0; i < 26; i++) {
		let list = [{ name: i + 1 }];
		列表.value.push({
			首字母: String.fromCharCode(65 + i),
			list,
		});
	}
}
function 跳转首字母(value) {
	console.log(value);
}
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
:deep(.var-index-bar__anchor-item) {
	color: #35393d;
	font-size: 24rem;
	padding: 16rem 10rem;
}
:deep(.var-index-bar__anchor-item--active) {
	color: rgb(244, 64, 52);
	font-size: 30rem;
}
:deep(.首字母) {
	font-size: 28rem;
	color: #7f7577;
	padding-left: 50rem;
	background: #ececec;
}
:deep(.var-index-bar__anchor-list) {
	top: 55%;
}

.歌手 {
	padding: 20rem;
	background: #fff;
	> .icon {
		width: 100rem;
		height: 100rem;
		border-radius: 50%;
		margin-right: 30rem;
		background: red;
	}
	> .name {
		color: #35393d;
		font-size: 26rem;
	}
}
</style>
