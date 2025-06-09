import { 请求接口 } from '@/常用方法';

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

export function 查询歌手(筛选条件) {
	return 请求接口('/ktv/singer/list', 筛选条件);
}

export function 查询已点歌曲() {
	return 请求接口('/ktv/song/h5/songRequestListGet');
}

const 修改类型 = {
	新增: '/ktv/song/h5/songRequestListAdd',
	删除: '/ktv/song/h5/songRequestListDel',
	置顶: '/ktv/song/h5/songRequestListTopping',
};
export async function 修改已点歌曲(type, args) {
	await 请求接口(修改类型[type], 'post', args);
	return 查询已点歌曲();
}

export function 记录点击量(id) {
	return 请求接口(`/ktv/song/h5/recordClick/${id}`);
}

export function 静态文件(path) {
	return 请求接口(`/ktv/upload/staticResources`, { path });
}
