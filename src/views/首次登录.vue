<template>
	<div class="首次登陆 center">
		<img class="bgImg" src="/图片资源/icon/icon1.png" />

		<div class="colLayout">
			<img class="icon3" src="/图片资源/icon/icon3.png" />
			<img class="icon4" src="/图片资源/icon/icon4.png" />
		</div>
	</div>
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore();
setTimeout(() => {
	if (store.state.token) {
		store.commit('setState', {
			key: '路由',
			value: '首页',
		});
	} else {
		store.commit('setState', {
			key: '路由',
			value: '登录',
		});
	}
}, 500);
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';

.首次登陆 {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
	> .colLayout {
		align-items: center;
		position: relative;
		bottom: 120rem;
		> .icon3 {
			margin-bottom: 50rem;
			width: 290rem;
			height: 50rem;
		}
		> .icon4 {
			width: 390rem;
			height: 50rem;
		}
	}
}
</style>
