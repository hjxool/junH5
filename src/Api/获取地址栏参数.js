import Store from '@/store/main.js';

export function 获取地址栏参数() {
	let list = new URLSearchParams(location.search);
	for (let [key, value] of list) {
		switch (key) {
			case 'token':
				Store.commit('setState', {
					key: 'token',
					value,
				});
				break;
			default:
				Store.commit('setState', {
					key: 'query参数',
					value,
				});
				break;
		}
	}
	let url = location.href.split('?')[0];
	history.replaceState('', '', url);
}
