<template>
	<commonPage>
		<template #header>
			<headStyle :返回事件="backTo">
				<template #title>{{ 跳转页 }}</template>
				<template #事件>
					<div class="rowLayout">
						<var-icon name="home" size="40rem" color="#fff" @click="backTo" />
					</div>
				</template>
			</headStyle>
		</template>

		<template #body>
			<div class="body colLayout">
				<var-tabs v-if="导航栏.options.length" class="noShrink" v-model:active="导航栏.选中" color="transparent" inactive-color="#7D8996">
					<var-tab v-for="item in 导航栏.options" :name="item">{{ item }}</var-tab>
				</var-tabs>

				<Search class="noShrink" :搜索事件="backTo" style="width: 90%; align-self: center; margin-top: 20rem" />

				<List :列表="列表">
					<template #item="{ 列表项, 索引 }">
						<div class="item">
							<img class="封面" :src="列表项.封面" />

							<div class="colLayout" style="justify-content: space-between">
								<div class="书名">{{ 列表项.书名 }}</div>
								<div class="简介">{{ 列表项.简介 }}</div>

								<div class="button center">打开</div>
							</div>
						</div>
					</template>
				</List>
			</div>
		</template>
	</commonPage>
</template>

<script setup>
import commonPage from '@/组件/通用页面.vue';
import headStyle from '@/组件/头部样式.vue';
import Search from '@/组件/搜索框.vue';
import List from '@/组件/列表容器.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';

// 属性
const Store = useStore();
const { 跳转页 } = defineProps(['跳转页']);
const 导航栏 = ref({
	选中: '',
	options: [],
});
const 列表 = ref([
	{ 书名: '习近平关于全面深化改革论 述擒编', 简介: '简介：习近平关于全面深化改革 论述擒编', 封面: '' },
	{ 书名: '习近平关于全面深化改革论 述擒编', 简介: '简介：习近平关于全面深化改革 论述擒编', 封面: '' },
	{ 书名: '习近平关于全面深化改革论 述擒编', 简介: '简介：习近平关于全面深化改革 论述擒编', 封面: '' },
	{ 书名: '习近平关于全面深化改革论 述擒编', 简介: '简介：习近平关于全面深化改革 论述擒编', 封面: '' },
]);
初始化();

// 方法
function backTo() {
	// Store.commit('setState', {
	// 	key: '路由',
	// 	value: '首页',
	// });
	if(跳转页 == '宣传教学') {
		Store.commit('setState', {
		   key: '路由',
		   value: '首页',
	    });
	} else {
		Store.commit('setState', {
		    key: '路由',
		    value: '文化活动',
	    });
	}
}
function 初始化() {
	switch (跳转页) {
		case '宣传教学':
			导航栏.value.options = ['全部', '学习讲话', '学习视频', '学习文集'];
			导航栏.value.选中 = '全部';
			break;
		case '图书杂志':
			导航栏.value.options = ['全部', '精神领袖', '中外名著', '国学经典'];
			导航栏.value.选中 = '全部';
			break;
		case '有声读物':
			导航栏.value.options = ['全部', '中外名著', '戏曲音乐', '相声小品'];
			导航栏.value.选中 = '全部';
			break;
	}
}
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
:deep(.var-tabs__indicator-inner) {
	background: #e11934;
}
:deep(.var-tabs--layout-horizontal-indicator-inner) {
	width: 40%;
}
:deep(.var-tab--active) {
	color: #35393d;
	font-size: 30rem;
}
.body {
	overflow: hidden;
	.item {
		height: 320rem;
		padding: 30rem;
		border-radius: 10rem;
		background: #fff;
		display: flex;
		> .封面 {
			height: 100%;
			width: 200rem;
			margin-right: 30rem;
		}
		.书名 {
			font-size: 26rem;
			color: #35393d;
			padding-left: 10rem;
		}
		.简介 {
			font-size: 22rem;
			color: #7d8996;
			padding-left: 10rem;
		}
		.button {
			width: 140rem;
			height: 60rem;
			color: #fff;
			background: #f22f55;
			border-radius: 40rem;
			font-size: 24rem;
		}
	}
}
</style>
