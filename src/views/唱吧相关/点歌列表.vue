<template>
	<commonPage v-if="!跳转视频播放">
		<template #header>
			<headStyle :返回事件="backToPre">
				<template #title>{{ 跳转页 }}</template>
				<template #事件>
					<div class="rowLayout">
						<var-icon name="home" size="40rem" color="#fff" @click="backTo" />
					</div>
				</template>
			</headStyle>
		</template>

		<template #body>
			<div class="body colLayout">
				<var-tabs v-if="导航栏.options.length" class="noShrink" v-model:active="导航栏.选中" @change="分类查询(1, 搜索值)" color="transparent" inactive-color="#7D8996">
					<var-tab v-for="item in 导航栏.options" :name="item">{{ item }}</var-tab>
				</var-tabs>

				<Search v-show="分类显示()" class="noShrink" @搜索事件="分类查询(1, $event)" style="width: 90%; align-self: center; margin-top: 20rem" />

				<IndexBar v-if="跳转页 == '歌星点歌'" :歌手列表="歌手列表" />

				<List v-else :列表="列表" :滚动事件="节流加载">
					<template #item="{ 列表项, 索引 }">
						<div class="item rowLayout">
							<div style="overflow: hidden">
								<div class="歌名 textEllipsis">{{ 列表项.name }}</div>
								<div class="rowLayout 歌手">
									<span style="margin-right: 20rem">歌手</span>
									<span>{{ 列表项.singerName || '暂无' }}</span>
								</div>
							</div>

							<div class="rowLayout noShrink" style="margin-left: auto">
								<!-- <div class="button">自唱</div> -->
								<div class="button b2" @click="修改已点歌曲('新增', { songId: 列表项.id })">点歌</div>
							</div>
						</div>
					</template>
				</List>

				<div class="noShrink" style="position: relative; z-index: 10">
					<Playing v-if="已点歌曲.list.length" :当前播放="已点歌曲.list[0]" @跳转视频="跳转视频()" @刷新="已点歌曲查询()" />

					<div class="底部按钮 rowLayout">
						<var-button class="按钮" @click="显示弹幕()" type="info">弹幕</var-button>
						<var-button class="按钮" @click="已点歌曲.show = true" type="info">已点</var-button>
					</div>
				</div>
			</div>
		</template>
	</commonPage>

	<PlayList
		v-if="已点歌曲.show"
		@show="(arg) => (已点歌曲.show = arg)"
		@列表事件="
			(arg) => {
				已点歌曲.list = arg;
			}
		"
	/>

	<var-overlay v-model:show="弹幕.show">
		<div class="弹幕 colLayout">
			<div style="font-size: 30rem">弹幕</div>
			<div class="input rowLayout">
				<input class="flexGrow" v-model="弹幕.input" maxlength="20" type="text" />
				<div class="noShrink">{{ 弹幕.input.length }} / 20</div>
			</div>
			<div class="rowLayout" style="width: 100%; justify-content: space-evenly">
				<var-button class="按钮" @click="弹幕.show = false" type="info" style="background: #fff"> 取消 </var-button>
				<var-button class="按钮" @click="保存弹幕(弹幕.input)" type="info" style="color: #fff; background: #f22f55"> 发送 </var-button>
			</div>
		</div>
	</var-overlay>

	<VideoPlay v-if="跳转视频播放" :跳转="跳转" :跳转页="跳转页" @跳转视频="跳转视频播放 = false" :视频地址="视频地址" :歌曲id="歌曲id" />

	<var-overlay v-model:show="loading" @click.prevent>
		<var-loading color="#409eff" />
	</var-overlay>
</template>

<script setup>
import commonPage from '@/组件/通用页面.vue';
import headStyle from '@/组件/头部样式.vue';
import Search from '@/组件/搜索框.vue';
import IndexBar from './索引列表.vue';
import PlayList from './已点歌曲.vue';
import Playing from './正在播放.vue';
import VideoPlay from './视频.vue';
import List from '@/组件/列表容器.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { 查询歌曲, 热门歌曲, 发送弹幕, 查询歌手, 修改已点歌曲, 查询已点歌曲, 记录点击量, 查询收藏 } from '@/Api/唱吧.js';
import { 节流 } from '@/Api/防抖节流.js';
import { 消息 } from '@/常用方法';

// 属性
const Store = useStore();
const { 跳转, 跳转页 } = defineProps(['跳转', '跳转页']);
const 列表 = ref([]);
const 导航栏 = ref({
	选中: '',
	options: [],
});
const 已点歌曲 = ref({
	show: false,
	list: [],
});
const 弹幕 = ref({
	show: false,
	input: '',
});
const 跳转视频播放 = ref(false);
const 歌曲类型 = {
	歌名点歌: {
		全部: {},
		国语: { songLanguageId: 0 },
		粤语: { songLanguageId: 1 },
		闽南语: { songLanguageId: 2 },
	},
	流行金曲: {
		全部: { songTypeId: 0 },
		流行: { songTypeId: 0, typeId: 0 },
		摇滚: { songTypeId: 0, typeId: 1 },
		民谣: { songTypeId: 0, typeId: 2 },
		其他: { songTypeId: 0, typeId: 3 },
	},
	经典歌曲: {
		全部: { songTypeId: 2 },
		经典老歌: { songTypeId: 2, typeId: 0 },
		'80-90': { songTypeId: 2, typeId: 1 },
		'00年代': { songTypeId: 2, typeId: 2 },
	},
	嘹亮军歌: { songTypeId: 5 },
	戏曲荟萃: {
		全部: { songTypeId: 7 },
		京剧: { songTypeId: 7, typeId: 0 },
		越剧: { songTypeId: 7, typeId: 1 },
		豫剧: { songTypeId: 7, typeId: 2 },
		秦腔: { songTypeId: 7, typeId: 3 },
	},
	歌星点歌: {
		全部: {},
		华人男星: { typeId: 6 },
		华人女星: { typeId: 5 },
		华人乐队: { typeId: 4 },
	},
};
const 分页 = {
	单页数量: 20,
	当前页: 1,
	总条数: 0,
};
const loading = ref(false);
const 搜索值 = ref('');
const 视频地址 = ref('');
const 歌曲id = ref('');
const 歌手列表 = ref([]);

初始化();

// 方法
function backTo() {
	Store.commit('setState', {
		key: '路由',
		value: '首页',
	});
}
function backToPre() {
	跳转('');
}
function 初始化() {
	switch (跳转页) {
		case '歌星点歌':
			导航栏.value.options = ['全部', '华人男星', '华人女星', '华人乐队'];
			导航栏.value.选中 = '全部';
			break;
		case '歌名点歌':
			导航栏.value.options = ['全部', '国语', '粤语', '闽南语'];
			导航栏.value.选中 = '全部';
			break;
		case '排行点歌':
			导航栏.value.options = ['总榜'];
			导航栏.value.选中 = '总榜';
			break;
		case '流行金曲':
			导航栏.value.options = ['全部', '流行', '摇滚', '民谣', '其他'];
			导航栏.value.选中 = '全部';
			break;
		case '经典歌曲':
			导航栏.value.options = ['全部', '经典老歌', '80-90', '00年代'];
			导航栏.value.选中 = '全部';
			break;
		case '戏曲荟萃':
			导航栏.value.options = ['全部', '京剧', '越剧', '豫剧', '秦腔'];
			导航栏.value.选中 = '全部';
			break;
		case '嘹亮军歌':
			break;
		case '个人歌库':
			break;
	}
	分类查询(1);
	已点歌曲查询();
}
function 显示弹幕() {
	弹幕.value.show = true;
	弹幕.value.input = '';
}
function 滚动加载({ target }) {
	// 触底判断
	if (target.scrollTop + target.clientHeight >= target.scrollHeight - 20) {
		console.log('加载');
		// 判断是否还有下一页可以加载
		if (分页.当前页 < 分页.总条数) {
			分类查询(++分页.当前页, 搜索值.value);
		}
	}
}
const 节流加载 = 节流(滚动加载, 500);
function 分类查询(page, keyWords = '') {
	分页.当前页 = page;
	搜索值.value = keyWords;
	loading.value = true;
	switch (跳转页) {
		case '排行点歌':
			热门歌曲().then((res) => {
				let list = res || [];
				列表.value = list;
				loading.value = false;
			});
			break;
		case '嘹亮军歌':
			查询歌曲({ pageNum: 分页.当前页, pageSize: 分页.单页数量, ...歌曲类型[跳转页], keyWords: 搜索值.value }).then((res) => {
				let list = res.data || [];
				if (分页.当前页 == 1) {
					列表.value = list;
				} else {
					列表.value.push(...list);
				}
				分页.总条数 = res.total;
				loading.value = false;
			});
			break;
		case '歌星点歌':
			查询歌手({ ...歌曲类型[跳转页][导航栏.value.选中], singerName: 搜索值.value }).then((res) => {
				歌手列表.value = res;
			});
			break;
		case '个人歌库':
			查询收藏({ pageNum: 分页.当前页, pageSize: 分页.单页数量 }).then((res) => {
				let list = res.data || [];
				if (分页.当前页 == 1) {
					列表.value = list;
				} else {
					列表.value.push(...list);
				}
				分页.总条数 = res.total;
				loading.value = false;
			});
			break;
		default:
			查询歌曲({ pageNum: 分页.当前页, pageSize: 分页.单页数量, ...歌曲类型[跳转页][导航栏.value.选中], keyWords: 搜索值.value }).then((res) => {
				let list = res.data || [];
				if (分页.当前页 == 1) {
					列表.value = list;
				} else {
					列表.value.push(...list);
				}
				分页.总条数 = res.total;
				loading.value = false;
			});
			break;
	}
}
async function 保存弹幕(msg) {
	if (!msg) {
		消息('内容不能为空', 4);
		return;
	}
	let res = await 发送弹幕(msg);
	console.log('res', res);
	res && 消息('发送成功');
	弹幕.value.show = false;
}
function 分类显示() {
	switch (跳转页) {
		case '排行点歌':
			return false;
		case '个人歌库':
			return false;
		default:
			return true;
	}
}
function 跳转视频() {
	跳转视频播放.value = true;
	let t = 已点歌曲.value.list[0];
	记录点击量(t.songId);
	视频地址.value = t.songPath || '';
	歌曲id.value = t.songId;
}
function 已点歌曲查询() {
	查询已点歌曲({ pageNum: 1, pageSize: 1 }).then((res) => {
		let list = res.data || [];
		已点歌曲.value.list = list;
	});
}
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
:deep(.var-tabs__indicator-inner) {
	background: #e11934;
}
:deep(.var-tabs--layout-horizontal-indicator-inner) {
	width: 40%;
}
:deep(.var-tab--active) {
	color: #35393d;
	font-size: 30rem;
}

.body {
	overflow: hidden;
	.item {
		background: #ffffff;
		border-radius: 10px;
		border: 1px solid #d2d2d2;
		// padding: 0 24rem 20rem 24rem;
		padding: 20rem 24rem;
		overflow: hidden;
		& + .item {
			margin-top: 16rem;
		}
		.歌名 {
			font-size: 30rem;
			color: #35393d;
		}
		.歌手 {
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
	.底部按钮 {
		background: #ffffff;
		border-top: 1px solid #baacac;
		justify-content: flex-end;
		padding: 25rem 40rem;
		> .按钮 {
			width: 148rem;
			height: 68rem;
			background: #504648;
			border-radius: 34rem;
			& + .按钮 {
				margin-left: 35rem;
			}
		}
	}
}
.弹幕 {
	width: 90vw;
	height: 330rem;
	justify-content: space-between;
	padding: 30rem;
	align-items: center;
	font-size: 26rem;
	color: #262b2f;
	background: #ffffff;
	border-radius: 16rem;
	border: 1px solid #c9c9c9;
	> .input {
		width: 100%;
		height: 80rem;
		background: #ececec;
		border-radius: 10rem;
		padding: 0 20rem;
		> input {
			background: transparent;
			outline: 0;
			border: none;
		}
	}
	.按钮 {
		width: 140rem;
		height: 70rem;
		border-radius: 40rem;
		border: 1px solid #f22f55;
		color: #262b2f;
	}
}
</style>
