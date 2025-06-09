<template>
	<div>
		<commonPage v-if="!跳转页">
			<template #header>
				<headStyle :返回事件="backTo">
					<template #title>军营唱吧</template>
					<template #事件>
						<div class="rowLayout">
							<var-icon name="home" size="40rem" color="#fff" @click="backTo" />
						</div>
					</template>
				</headStyle>
			</template>

			<template #body>
				<div class="导航页">
					<div
						class="选项"
						v-for="item in 菜单列表"
						@click="跳转(item.name)"
						:style="{
							'--img1': `url(${item.img1})`,
							'--img2': `url(${item.img2})`,
						}"
					></div>
				</div>
			</template>
		</commonPage>

		<SongList v-if="跳转页 == '嘹亮军歌'" :跳转="跳转" :跳转页="'嘹亮军歌'" />
		<SongList v-if="跳转页 == '歌星点歌'" :跳转="跳转" :跳转页="'歌星点歌'" />
		<SongList v-if="跳转页 == '歌名点歌'" :跳转="跳转" :跳转页="'歌名点歌'" />
		<SongList v-if="跳转页 == '排行点歌'" :跳转="跳转" :跳转页="'排行点歌'" />
		<SongList v-if="跳转页 == '流行金曲'" :跳转="跳转" :跳转页="'流行金曲'" />
		<SongList v-if="跳转页 == '经典歌曲'" :跳转="跳转" :跳转页="'经典歌曲'" />
		<SongList v-if="跳转页 == '戏曲荟萃'" :跳转="跳转" :跳转页="'戏曲荟萃'" />
		<SongList v-if="跳转页 == '个人歌库'" :跳转="跳转" :跳转页="'个人歌库'" />
	</div>
</template>

<script setup>
import commonPage from '@/组件/通用页面.vue';
import headStyle from '@/组件/头部样式.vue';
import SongList from './点歌列表.vue';
import { 获取类型 } from '@/Api/唱吧.js';

import { useStore } from 'vuex';
import { ref } from 'vue';

// 属性
const Store = useStore();
const 菜单列表 = ref([
	{ name: '嘹亮军歌', img1: '/图片资源/icon/icon7.png', img2: '/图片资源/icon/icon7-1.png' },
	{ name: '歌星点歌', img1: '/图片资源/icon/icon8.png', img2: '/图片资源/icon/icon8-1.png' },
	{ name: '歌名点歌', img1: '/图片资源/icon/icon9.png', img2: '/图片资源/icon/icon9-1.png' },
	{ name: '排行点歌', img1: '/图片资源/icon/icon10.png', img2: '/图片资源/icon/icon10-1.png' },
	{ name: '流行金曲', img1: '/图片资源/icon/icon11.png', img2: '/图片资源/icon/icon11-1.png' },
	{ name: '经典歌曲', img1: '/图片资源/icon/icon12.png', img2: '/图片资源/icon/icon12-1.png' },
	{ name: '戏曲荟萃', img1: '/图片资源/icon/icon13.png', img2: '/图片资源/icon/icon13-1.png' },
	{ name: '个人歌库', img1: '/图片资源/icon/icon14.png', img2: '/图片资源/icon/icon14-1.png' },
]);
const 跳转页 = ref('');

获取类型('songTypes');
获取类型('singerTypes');

// 方法
function 跳转(name) {
	跳转页.value = name;
}
function backTo() {
	Store.commit('setState', {
		key: '路由',
		value: '首页',
	});
}
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';

.导航页 {
	overflow: scroll;
	display: grid;
	padding: 38rem;
	grid-template-columns: repeat(2, 311rem);
	grid-auto-rows: 175rem;
	gap: 24rem;
	.选项 {
		background-size: 100%;
		background-image: var(--img1);
		transition: background-image 0.3s;
		&:hover {
			background-image: var(--img2);
		}
	}
}
</style>
