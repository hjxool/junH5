import { Snackbar, Dialog } from '@varlet/ui';
import Store from '@/store/main.js';
import { Tenant_Id, Client_Id, 接口地址 } from '@/系统常量.js';

export function 消息(消息内容 = '成功', 消息颜色 = 'success') {
	let type = 'success';
	switch (消息颜色) {
		case -1:
			console.log(消息内容);
			return;
			break;
		case 1:
			type = 'error';
			break;
		case 2:
			type = 'success';
			break;
		case 3:
			type = 'info';
			break;
		case 4:
			type = 'warning';
			break;
		default:
			type = 'success';
			break;
	}
	Snackbar({
		content: 消息内容,
		type,
	});
}

export async function 提示框(提示内容 = '成功', 提示标题 = '') {
	try {
		return (
			(await Dialog({
				title: 提示标题,
				message: 提示内容,
			})) === 'confirm'
		);
	} catch (e) {
		return false;
	}
}

// GET 请求接口('/api/xxx') 请求接口('/api/xxx', {key: value})
// POST等 请求接口('/api/xxx', 'post', {key: value}) 请求接口('/api/xxx', 'post')
export async function 请求接口(url, ...args) {
	let options = {};
	options['headers'] = {
		Authorization: `Bearer ${Store.state.token}`,
		clientid: Client_Id,
		'Tenant-Id': Tenant_Id,
	};
	if (typeof args[0] == 'string') {
		// POST等请求
		options['method'] = args[0];
		options['body'] = JSON.stringify(args[1] || {});
		// 有 body 时不能省略
		options.headers['Content-Type'] = 'application/json';
	} else {
		// GET
		options['method'] = 'get';
		if (args[0] && typeof args[0] == 'object') {
			url += '?';
			for (let [key, value] of Object.entries(args[0])) {
				if (Array.isArray(value)) {
					for (let arg of value) {
						url += `${key}=${arg}&`;
					}
				} else {
					url += `${key}=${value}&`;
				}
			}
			url = url.substring(0, url.length - 1);
		}
	}
	return fetch(`${运维配置_接口地址}${url}`, options)
		.then((res) => res.json())
		.then(({ head: { code, message }, data }) => {
			switch (code) {
				case 200:
					return data;
				case 401:
					消息('登录失效', 3);
					setTimeout(() => {
						Store.commit('setState', {
							key: '路由',
							value: '登录',
						});
					}, 1000);
					return false;
				default:
					提示框(message);
					return false;
			}
		})
		.catch((err) => {
			消息(err, 1);
			return false;
		});
}

export const 访问静态资源 = (url) => `${接口地址}/ktv/upload/staticResources?path=${url}`;
