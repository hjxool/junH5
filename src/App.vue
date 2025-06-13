<template>
	<div style="width: 100%; height: 100dvh" class="pl">
		<TransitionGroup name="list">
			<FirstLoad v-if="路由 === '首次登录'" />
			<Login v-else-if="路由 === '登录'" />
			<mainPage v-else-if="路由 === '首页'" />
			<ArmyStyle v-else-if="路由 === '风采展示'" />
			<satelliteTV v-else-if="路由 === '卫星电视'" />
			<infoConsulting v-else-if="路由 === '信息资讯'" />
			<armyCeremony v-else-if="路由 === '影视节目'" />
			<filmType v-else-if="路由 === '影视类型'" />
			<QuestionnaireEvaluation v-else-if="路由 === '问卷测评'" />
			<SingCamp v-else-if="路由 === '卡拉OK'" />
			<Books v-else-if="路由 === '宣传教学'" :跳转页="'宣传教学'" />
			<Books v-else-if="路由 === '图书杂志'" :跳转页="'图书杂志'" />
			<Books v-else-if="路由 === '有声读物'" :跳转页="'有声读物'" />
			<dataChapter v-else-if="路由 === '资料章节'" />
			<cultureActivity v-else-if="路由 === '文化活动'" />
			<empty v-else />

			<ScrollBar />
		</TransitionGroup>
	</div>
</template>

<script setup>
import empty from '@/views/空.vue';
import ArmyStyle from '@/views/风采展示.vue';
import satelliteTV from '@/views/卫星电视.vue';
import infoConsulting from '@/views/信息资讯.vue';
import armyCeremony from '@/views/影视节目.vue';
import filmType from '@/views/影视类型.vue';
import QuestionnaireEvaluation from '@/views/问卷测评.vue';
import mainPage from '@/views/首页.vue';
import FirstLoad from '@/views/首次登录.vue';
import Login from '@/views/登录.vue';
import SingCamp from '@/views/唱吧相关/唱吧.vue';
import Books from '@/views/学习+图书+有声.vue';
import cultureActivity from '@/views/文化活动.vue';
import dataChapter from '@/views/资料章节.vue';
import ScrollBar from '@/组件/滚动显示消息.vue';

import { computed } from 'vue';
import { 获取地址栏参数 } from '@/Api/获取地址栏参数.js';
import { rem } from '@/Api/根节点字体大小.js';
import { useStore } from 'vuex';

const store = useStore();
const 路由 = computed(() => store.state.路由);

store.commit('setState', {
	key: '路由',
	value: '首次登录',
});

rem();
window.onresize = () => {
	rem();
};

获取地址栏参数();
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(100px);
}
</style>
