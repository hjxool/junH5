<template>
	<div class="page" @mousedown="是否显示清除 = false">
		<div v-if="!显示内容 || 显示内容 == '用户登录'" class="样式1 colLayout">
			<img class="icon5" src="/图片资源/icon/icon5.png" />

			<div v-show="!显示内容" class="选项框 center">
				<img class="bgImg" src="/图片资源/icon/icon6.png" />

				<div v-for="item in 选项" :class="['button', 'center', item.class]" @click="跳转(item.label)">{{ item.label }}</div>
			</div>

			<div v-show="显示内容 == '用户登录'" class="登录 colLayout">
				<img class="bgImg" src="/图片资源/icon/icon6.png" />

				<span class="label">账号</span>
				<div class="input rowLayout">
					<input v-model="表单.账号" type="text" />
				</div>

				<span class="label" style="margin-top: 60rem">密码</span>
				<div class="input rowLayout" @mousedown.stop="是否显示清除 = true">
					<input v-if="!显示密码" v-model="表单.密码" type="password" />
					<input v-if="显示密码" v-model="表单.密码" type="text" />

					<div class="图标 rowLayout">
						<div v-if="表单.密码" class="icon" @click="显示密码 = !显示密码">
							<var-icon name="view-outline" :size="20" color="#555" />
							<span v-show="显示密码" class="隐藏">/</span>
						</div>

						<div class="icon" style="width: 20px">
							<var-icon v-if="表单.密码 && 是否显示清除" @click="表单.密码 = ''" name="close-circle" :size="20" color="#555" />
						</div>
					</div>
				</div>

				<var-button class="按钮" @click="登录()" type="info">登录</var-button>
			</div>
		</div>

		<commonPage v-if="显示内容 == '用户注册'">
			<template #header>
				<headStyle :返回事件="backTo">
					<template #title>注册</template>
				</headStyle>
			</template>

			<template #body>
				<div class="样式2 colLayout">
					<span class="label">账号</span>
					<div class="input rowLayout" style="background: #fff">
						<input v-model="表单.账号" type="text" />
					</div>

					<span class="label" style="margin-top: 70rem">单位</span>
					<div class="input rowLayout" style="background: #fff">
						<input v-model="表单.单位" type="text" />
					</div>

					<span class="label" style="margin-top: 70rem">密码</span>
					<div class="input rowLayout" @mousedown.stop="是否显示清除 = true" style="background: #fff">
						<input v-if="!显示密码" v-model="表单.密码" type="password" />
						<input v-if="显示密码" v-model="表单.密码" type="text" />

						<div class="图标 rowLayout">
							<div v-if="表单.密码" class="icon" @click="显示密码 = !显示密码">
								<var-icon name="view-outline" :size="20" color="#555" />
								<span v-show="显示密码" class="隐藏">/</span>
							</div>

							<div class="icon" style="width: 20px">
								<var-icon v-if="表单.密码 && 是否显示清除" @click="表单.密码 = ''" name="close-circle" :size="20" color="#555" />
							</div>
						</div>
					</div>

					<var-button class="按钮" @click="注册()" type="info">注册</var-button>
				</div>
			</template>
		</commonPage>
	</div>
</template>

<script setup>
import commonPage from '@/组件/通用页面.vue';
import headStyle from '@/组件/头部样式.vue';
import { 请求接口, 消息 } from '@/常用方法.js';
import { useStore } from 'vuex';
import { ref } from 'vue';
import { 连接WebSocket } from '@/Api/连接WebSocket.js';

// 属性
const Store = useStore();

const 选项 = ref([
	{ label: '用户注册', class: 'b1' },
	{ label: '用户登录', class: 'b2' },
	{ label: '临时用户', class: 'b3' },
]);
const 显示内容 = ref('');
const 表单 = ref({
	账号: 运维配置_默认登录填充账号,
	密码: 运维配置_默认登录填充密码,
	单位: '',
});
const 显示密码 = ref(false);
const 是否显示清除 = ref(false);

// 方法
function backTo() {
	显示内容.value = '';
}
async function 登录() {
	let reg = /\S+$/;
	if (reg.test(表单.value.账号) && reg.test(表单.value.密码)) {
		let res = await 请求接口('/oauth/user/token', 'post', {
			username: 表单.value.账号,
			password: 表单.value.密码,
		});
		if (res) {
			Store.commit('setState', {
				key: 'token',
				value: res.access_token,
			});
			Store.commit('setState', {
				key: '路由',
				value: '首页',
			});
			// 写缓存
			window.sessionStorage.账号 = 表单.value.账号;
			window.sessionStorage.密码 = 表单.value.密码;
			setTimeout(() => {
				连接WebSocket();
			}, 300);
		}
	} else {
		消息('账号密码不能为空或带有空格', 1);
	}
}
function 注册() {
	let reg = /\S+$/;
	if (reg.test(表单.value.账号) && reg.test(表单.value.密码) && reg.test(表单.value.单位)) {
	} else {
		消息('填写内容不能为空或带有空格', 1);
	}
}
function 跳转(label) {
	显示内容.value = label;
	显示密码.value = false;
	是否显示清除.value = false;
	switch (label) {
		case '用户注册':
			// 清空
			表单.value.账号 = '';
			表单.value.密码 = '';
			表单.value.单位 = '';
			break;
		case '用户登录':
			// 读缓存
			表单.value.账号 = sessionStorage.账号 || '';
			表单.value.密码 = sessionStorage.密码 || '';
			break;
	}
}
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
.样式1 {
	align-items: center;
	background: #ececec;
	position: relative;
	height: 100%;
	> .icon5 {
		position: absolute;
		z-index: 0;
		width: 100%;
		height: 600rem;
		top: 0;
		left: 0;
	}
	> .选项框 {
		position: absolute;
		width: 90%;
		height: 60%;
		z-index: 10;
		top: 27%;
		> .button {
			width: 75%;
			padding: 26rem 0;
			border-radius: 40rem;
			& + .button {
				margin-top: 70rem;
			}
		}
		> .b1 {
			background: #ffffff;
			border: 2px solid #f22f55;
			color: #35393d;
		}
		> .b2 {
			background: #f22f55;
			color: #fff;
		}
		> .b3 {
			background: #504648;
			color: #fff;
		}
	}
	> .登录 {
		position: absolute;
		width: 90%;
		height: 60%;
		z-index: 10;
		top: 27%;
		padding: 110rem 85rem;
	}
}
.样式2 {
	height: 85%;
	padding: 60rem 115rem 112rem 115rem;
}
.label {
	font-size: 28rem;
	color: #262b2f;
	margin-bottom: 20rem;
	margin-left: 20rem;
}
.input {
	background: #ececec;
	border-radius: 10rem;
	padding: 0 20rem;
	height: 80rem;
	position: relative;
	> input {
		background: transparent;
		outline: 0;
		border: none;
		color: #262b2f;
	}
	> .图标 {
		position: absolute;
		z-index: 10;
		right: 20rem;
		.icon {
			position: relative;
			& + .icon {
				margin-left: 10rem;
			}
			> .隐藏 {
				position: absolute;
				z-index: 10;
				font-size: 36rem;
				left: 50%;
				top: 44%;
				transform: translate(-50%, -50%);
			}
		}
	}
}
.按钮 {
	margin-top: auto;
	width: 100%;
	height: 80rem;
	background: #504648;
	border-radius: 40rem;
}
</style>
