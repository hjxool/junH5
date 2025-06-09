<template>
	<div class="搜索 noShrink rowLayout">
		<var-icon class="noShrink" name="magnify" :size="30" color="#D9AEB8" />

		<input class="flexGrow" v-model="搜索" @keydown.enter="emit('搜索事件', 搜索)" type="text" />

		<var-button class="按钮 noShrink" @click="emit('搜索事件', 搜索)" type="info">搜索</var-button>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';

// 属性
const emit = defineEmits(['搜索事件']);
const { 搜索值 } = defineProps(['搜索值']);
const 搜索 = ref('');

watch(
	() => 搜索值,
	(value) => {
		console.log(333333333333, value);
		搜索.value = value;
	}
);
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';

.搜索 {
	width: 100%;
	font-size: 24rem;
	padding: 8rem 8rem 8rem 20rem;
	background: #fff;
	border-radius: 40rem;
	> input {
		background: transparent;
		outline: 0;
		border: none;
		color: #262b2f;
	}
	> .按钮 {
		background: #504648;
		border-radius: 40rem;
		height: 60rem;
	}
}
</style>
