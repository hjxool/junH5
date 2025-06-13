import { 请求接口 } from '@/常用方法';
import Store from '@/store/main.js';
import { Tenant_Id, Client_Id } from '@/系统常量.js';
import { 消息 } from '@/常用方法.js';

export function 获取类型(type) {
	return 请求接口(`/ktv/dict/${type}`);
}

export function 查询歌曲(筛选条件) {
	return 请求接口('/ktv/song/h5/list', 筛选条件);
}

export function 热门歌曲() {
	return 请求接口('/ktv/study/h5/recommend');
}

export function 发送弹幕(msg) {
	return 请求接口(`/ktv/song/h5/sendComment?comment=${msg}`, 'post');
}

export function 查询已点歌曲(筛选条件) {
	return 请求接口('/ktv/song/h5/getChooseSongPageList', 筛选条件);
}

const 修改类型 = {
	新增: '/ktv/song/h5/songRequestListAdd',
	删除: '/ktv/song/h5/songRequestListDel',
	置顶: '/ktv/song/h5/songRequestListTopping',
};
export function 修改已点歌曲(type, args) {
	return 请求接口(修改类型[type], 'post', args);
}

export function 记录点击量(id) {
	return 请求接口(`/ktv/song/h5/recordClick/${id}`);
}

export function 静态文件(path) {
	return `${运维配置_接口地址}/ktv/upload/staticResources?path=${encodeURIComponent(path)}`;
}

export function 查询歌手(筛选条件) {
	let url = '/ktv/singer/h5/list';
	if (筛选条件 && typeof 筛选条件 == 'object') {
		url += '?';
		for (let [key, value] of Object.entries(筛选条件)) {
			value && (url += `${key}=${value}&`);
		}
		url = url.substring(0, url.length - 1);
	}
	return fetch(`${运维配置_接口地址}${url}`, {
		method: 'get',
		headers: {
			Authorization: `Bearer ${Store.state.token}`,
			clientid: Client_Id,
			'Tenant-Id': Tenant_Id,
		},
	})
		.then((res) => res.json())
		.then((res) => {
			if (res.head) {
				switch (res.head.code) {
					case 401:
						消息('登录失效', 3);
						setTimeout(() => {
							Store.commit('setState', {
								key: '路由',
								value: '登录',
							});
						}, 1000);
						return false;
				}
			} else {
				return res;
			}
		})
		.catch((err) => {
			消息(err, 1);
			return false;
		});
}

const 指令 = {
	暂停: -1,
	切换: 0,
	播放: 1,
};
export function 发送指令(id, command) {
	return 请求接口('/ktv/song/h5/sendCommand', { id, command: 指令[command] });
}

export function 查询收藏(分页) {
	return 请求接口('/ktv/songUser/h5/list', 分页);
}

const 修改类型2 = {
	取消: '/ktv/songUser/h5/delete/',
	收藏: '/ktv/songUser/h5/add/',
};
export async function 修改收藏(type, id) {
	return 请求接口(`${修改类型2[type]}${id}`);
}
