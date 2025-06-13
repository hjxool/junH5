<template>
	<div v-show="show" class="body">
		<div class="bgImg"></div>

		<img class="icon noShrink" src="/图片资源/icon/icon27.png" />

		<div id="文字容器" class="flexGrow rowLayout" :style="{ height: `${文字.height}px` }">
			<div id="滚屏文字" :style="{ left: `${left}px`, fontSize: `${文字.size}rem`, color: 文字.color }">{{ 文字.content }}</div>
		</div>

		<img class="icon noShrink" @click="show = false" src="/图片资源/icon/icon28.png" />
	</div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

// 属性
const Store = useStore();
const show = ref(false);
const 文字 = ref({
	width: 0,
	height: 0,
	content: '',
	size: 16,
	color: '#fff',
	loop: false,
});
let speed;
const left = ref(0);
let timer;
const 参数 = {
	最大速度: 10, // 单位px
	影响因子: 0.01, // 值越大弹幕长度对速度的影响越大
};

watch(show, (value) => {
	if (value && 文字.value.loop) {
		// 放到事件队列中执行 等渲染节点后计算
		setTimeout(() => {
			let dom = document.getElementById('滚屏文字');
			文字.value.width = dom.offsetWidth;
			文字.value.height = dom.offsetHeight;
			let 容器长度 = document.getElementById('文字容器').clientWidth;
			left.value = 容器长度;

			speed = 参数.最大速度 / (1 + 文字.value.width * 参数.影响因子);
			speed = Math.round(speed * 10) / 10;
			timer = setInterval(() => {
				left.value -= speed;
				if (left.value <= -文字.value.width) {
					// 重置
					setTimeout(() => {
						left.value = 容器长度;
					}, 500);
				}
			}, 30);
		}, 200);
	} else {
		clearInterval(timer);
	}
});

const websocket消息 = computed(() => Store.state.websocket消息);
watch(
	() => websocket消息.value,
	(value) => {
		if (value?.type == '暂定') {
			show.value = true;
			文字.value.content = value.text;
			文字.value.size = value.textSize;
			文字.value.color = value.textColor;
			文字.value.loop = value.isLoop;
		}
	}
);
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
.body {
	position: fixed;
	z-index: 900;
	left: 0%;
	top: 0%;
	width: 100%;
	padding: 30rem 0;
	display: flex;
	> .bgImg {
		background: #630a1a;
		opacity: 0.8;
	}
	> .icon {
		width: 32rem;
		height: 32rem;
		margin: 0 30rem;
		align-self: center;
	}
	> .flexGrow {
		overflow: hidden;
		position: relative;
	}
}
#滚屏文字 {
	font-size: 30rem;
	color: #fff;
	white-space: nowrap;
	position: absolute;
}
</style>
