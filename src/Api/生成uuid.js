export function uuid() {
	let 时间戳 = Date.now().toString(36);
	let 随机数 = Math.random().toString(36).substring(2, 11);
	return `${时间戳}-${随机数}`;
}
