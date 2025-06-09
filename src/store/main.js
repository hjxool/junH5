import { createStore } from 'vuex';
import { 消息 } from '@/常用方法.js';

export default createStore({
	state() {
		return {
			token: '',
			query参数: null,
			路由: '',
		};
	},
	mutations: {
		setState(State, args) {
			if (!args?.key) {
				消息('传参错误', 1);
				return;
			}
			State[args.key] = args.value;
		},
	},
});
