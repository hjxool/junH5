<template>
	<div class="遮罩 colLayout">
		<div class="flexGrow" @click="$emit('show', false)" style="background: transparent"></div>

		<div class="弹窗 colLayout">
			<div class="title noShrink center">已点歌曲</div>

			<List :列表="列表" :滚动事件="节流加载">
				<template #item="{ 列表项, 索引 }">
					<div class="item rowLayout">
						<div>
							<div class="歌名">{{ 列表项.name }}</div>
							<div class="歌手 rowLayout">
								<div style="margin-right: 20rem">歌手</div>
								<div>{{ 列表项.singerName || '暂无' }}</div>
							</div>
						</div>

						<img v-show="索引 == 0" class="icon" src="/图片资源/icon/icon15.png" />
						<div v-show="索引 > 0" class="rowLayout">
							<div class="button center" @click.stop="操作('置顶', { id: 列表项.id })">置顶</div>
							<div class="button center" @click.stop="操作('删除', { id: 列表项.id })">删除</div>
						</div>
					</div>
				</template>
			</List>
		</div>
	</div>

	<var-overlay v-model:show="loading" @click.prevent>
		<var-loading color="#409eff" />
	</var-overlay>
</template>

<script setup>
import List from '@/组件/列表容器.vue';
import { 查询已点歌曲, 修改已点歌曲 } from '@/Api/唱吧.js';
import { ref } from 'vue';
import { 节流 } from '@/Api/防抖节流.js';

// 属性
const emit = defineEmits(['列表事件']);
const 列表 = ref([]);
const 分页 = {
	单页数量: 20,
	当前页: 1,
	总条数: 0,
};
const loading = ref(false);

查询(1);

// 方法
function 查询(page) {
	分页.当前页 = page;
	loading.value = true;
	查询已点歌曲({ pageNum: 分页.当前页, pageSize: 分页.单页数量 }).then((res) => {
		let list = res.data || [];
		if (分页.当前页 == 1) {
			列表.value = list;
		} else {
			列表.value.push(...list);
		}
		分页.总条数 = res.total;
		emit('列表事件', 列表.value);
		loading.value = false;
	});
}
async function 操作(type, args) {
	await 修改已点歌曲(type, args);
	查询(1);
}
const 节流加载 = 节流(滚动加载, 1000);
async function 滚动加载({ target }) {
	// 触底判断
	if (target.scrollTop + target.clientHeight >= target.scrollHeight - 20) {
		console.log('加载');
		// 判断是否还有下一页可以加载
		if (分页.当前页 < 分页.总条数) {
			查询(++分页.当前页);
		}
	}
}
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
.遮罩 {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 990;
	background: rgba(0, 0, 0, 0.2);
	font-size: 24rem;
	user-select: none;
	> .弹窗 {
		min-height: 40%;
		max-height: 60%;
		background: #fff;
		z-index: 10;
		> .title {
			padding: 20rem;
			padding-bottom: 0;
		}
		.item {
			height: 125rem;
			padding: 0 20rem;
			justify-content: space-between;
			border-radius: 10px;
			border: 1px solid #d2d2d2;
			.歌名 {
				font-size: 26rem;
				color: #35393d;
				margin-bottom: 20rem;
			}
			.歌手 {
				font-size: 22rem;
				color: #7d8996;
			}
			.icon {
				width: 55rem;
				height: 42rem;
			}
			.button {
				width: 100rem;
				height: 60rem;
				border-radius: 40rem;
				border: 1px solid #f22f55;
				& + .button {
					margin-left: 20rem;
				}
			}
		}
	}
}
</style>
