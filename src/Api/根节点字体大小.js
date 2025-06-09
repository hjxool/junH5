export function rem() {
	const 根节点 = document.documentElement;
	const 可视宽度 = 根节点.clientWidth;
	const 缩放比例 = Math.round((可视宽度 / 720) * 100) / 100;
	根节点.style.fontSize = 缩放比例 * 1 + 'px'; // 按设计稿720px宽度下根节点字体大小为1px
}
