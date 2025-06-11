<template>
	<div class="flexGrow" style="overflow-x: hidden">
		<var-index-bar duration="300" :sticky="false" highlight-color="rgb(244, 64, 52)">
			<div v-for="item in 列表" :key="item.首字母">
				<var-index-anchor class="首字母" :index="item.首字母">{{ item.首字母 }}</var-index-anchor>

				<var-cell v-for="item2 in item.list" :key="item2.id">
					<div class="歌手 rowLayout" @click="歌手歌曲(item2)">
						<div class="icon center">
							<div v-if="!item2.头像">暂无</div>
							<img v-else class="bgImg" :src="item2.头像" />
						</div>
						<span class="name">{{ item2.singerName }}</span>
					</div>
				</var-cell>
			</div>
		</var-index-bar>
	</div>

	<var-popup position="right" v-model:show="歌曲.show">
		<div class="歌曲" :class="{ center: 歌曲.loading }">
			<var-loading v-if="歌曲.loading" color="#409eff" style="position: absolute" />

			<List :列表="歌曲.list" :滚动事件="节流加载">
				<template #item="{ 列表项, 索引 }">
					<div class="item rowLayout">
						<div style="overflow: hidden">
							<div class="歌名 textEllipsis">{{ 列表项.name }}</div>
							<div class="rowLayout singer">
								<span style="margin-right: 20rem">歌手</span>
								<span>{{ 列表项.singerName || '暂无' }}</span>
							</div>
						</div>

						<div class="rowLayout noShrink" style="margin-left: auto">
							<div class="button b2" @click="修改已点歌曲('新增', 列表项)">点歌</div>
						</div>
					</div>
				</template>
			</List>
		</div>
	</var-popup>
</template>

<script setup>
import List from '@/组件/列表容器.vue';
import { ref, watch } from 'vue';
import { 静态文件, 查询歌曲, 修改已点歌曲 } from '@/Api/唱吧.js';
import { 节流 } from '@/Api/防抖节流.js';

// 属性
const { 歌手列表 } = defineProps(['歌手列表']);
const 列表 = ref([]);
const 歌曲 = ref({
	show: false,
	list: [],
	loading: false,
});
let 当前歌手id;
const 分页 = {
	单页数量: 20,
	当前页: 1,
	总条数: 0,
};

watch(
	() => 歌手列表,
	() => {
		初始化();
	}
);

// 方法
function 初始化() {
	for (let [首字母, list] of Object.entries(歌手列表)) {
		列表.value.push({
			首字母,
			list: list.map((e) => ({
				...e,
				头像: e.filePath ? 静态文件(e.filePath) : '',
			})),
		});
	}
}
function 歌手歌曲(item) {
	歌曲.value.show = true;
	歌曲.value.loading = true;
	歌曲.value.list = [];
	分页.当前页 = 1;
	分页.总条数 = 0;
	当前歌手id = item.id;
	查询歌曲({ pageNum: 分页.当前页, pageSize: 分页.单页数量, singerId: 当前歌手id }).then((res) => {
		let list = res.data || [];
		歌曲.value.list = list;
		分页.总条数 = res.total;
		歌曲.value.loading = false;
	});
}
const 节流加载 = 节流(滚动加载, 1000);
function 滚动加载({ target }) {
	// 触底判断
	if (target.scrollTop + target.clientHeight >= target.scrollHeight - 20) {
		console.log('加载');
		// 判断是否还有下一页可以加载
		if (分页.当前页 < 分页.总条数) {
			分页.当前页++;
			歌曲.value.loading = true;
			查询歌曲({ pageNum: 分页.当前页, pageSize: 分页.单页数量, singerId: 当前歌手id }).then((res) => {
				let list = res.data || [];
				歌曲.value.list = list;
				分页.总条数 = res.total;
				歌曲.value.loading = false;
			});
		}
	}
}
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
:deep(.var-index-bar__anchor-item) {
	color: #35393d;
	font-size: 24rem;
	padding: 16rem 10rem;
}
:deep(.var-index-bar__anchor-item--active) {
	color: rgb(244, 64, 52);
	font-size: 30rem;
}
:deep(.首字母) {
	font-size: 28rem;
	color: #7f7577;
	padding-left: 50rem;
	background: #ececec;
}
:deep(.var-index-bar__anchor-list) {
	top: 55%;
}

.歌手 {
	padding: 20rem;
	background: #fff;
	> .icon {
		width: 100rem;
		height: 100rem;
		border-radius: 50%;
		margin-right: 30rem;
		overflow: hidden;
		position: relative;
		z-index: 10;
		font-size: 26rem;
		background: #ccc;
		color: #fff;
	}
	> .name {
		color: #35393d;
		font-size: 26rem;
	}
}
.歌曲 {
	width: 80vw;
	height: 100%;
	background: #ececec;
	.item {
		background: #ffffff;
		border-radius: 10px;
		border: 1px solid #d2d2d2;
		padding: 20rem 24rem;
		overflow: hidden;
		& + .item {
			margin-top: 16rem;
		}
		.歌名 {
			font-size: 30rem;
			color: #35393d;
		}
		.singer {
			margin-top: 14rem;
			font-size: 26rem;
			color: #7d8996;
		}
		.button {
			font-size: 26rem;
			border-radius: 40rem;
			border: 1px solid #f22f55;
			padding: 12rem 22rem;
			& + .button {
				margin-left: 20rem;
			}
		}
		.b2 {
			color: #fff;
			background: #f22f55;
		}
	}
}
</style>
