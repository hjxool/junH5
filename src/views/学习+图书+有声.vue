<template>
	<commonPage>
		<template #header>
			<headStyle :返回事件="backTo">
				<template #title>{{ 跳转页 }}</template>
				<template #事件>
					<div class="rowLayout">
						<var-icon name="home" size="40rem" color="#fff" @click="backTo('首页')" />
					</div>
				</template>
			</headStyle>
		</template>

		<template #body>
			<div class="body colLayout">
				<var-tabs v-if="导航栏.options.length" class="noShrink" v-model:active="导航栏.选中" @change="切换列表($event)" color="transparent" inactive-color="#7D8996">
					<var-tab v-for="item in 导航栏.options" :name="item">{{ item }}</var-tab>
				</var-tabs>

				<Search class="noShrink" :搜索事件="backTo" style="width: 90%; align-self: center; margin-top: 20rem" />

				<List :列表="列表" @scroll="节流加载($event)" style="overflow-x: hidden; height: 100%; padding-right: 5rem">
					<template #item="{ 列表项, 索引 }">
						<div class="item">
							<img class="封面" :src="访问静态资源(列表项.coverPath)" />

							<div class="colLayout" style="justify-content: space-between">
								<div class="书名">{{ 列表项.name }}</div>
								<div class="简介">{{ 列表项.details }}</div>
								<div class="button center" @click="打开资料(列表项)">打开</div>
							</div>
						</div>
					</template>
				</List>
			</div>
		</template>
	</commonPage>
</template>

<script setup>
import commonPage from '@/组件/通用页面.vue';
import headStyle from '@/组件/头部样式.vue';
import Search from '@/组件/搜索框.vue';
import List from '@/组件/列表容器.vue';
import { 消息, 请求接口, 提示框, 访问静态资源 } from '@/常用方法.js';
import { 节流 } from '@/Api/防抖节流.js';
import { ref } from 'vue';
import { useStore } from 'vuex';

// 属性
const Store = useStore();
const { 跳转页 } = defineProps(['跳转页']);
const loading = ref(false);
const 搜索值 = ref('');
const 导航栏 = ref({
	选中: '',
	options: [],
});
const 分页 = {
	单页数量: 20,
	当前页: 1,
	总条数: 0,
};
const 资料类型 = {
	图书杂志: {
		全部: {},
		领袖著作: { bookType: 0 },
		中外名著: { bookType: 1 },
		国学经典: { bookType: 2 },
		人物传记: { bookType: 3 },
		诗歌散文: { bookType: 4 },
		军事文学: { bookType: 5 },
		优秀期刊: { bookType: 6 },
		热门推荐: { bookType: 7 },
	},
	宣传教学: {
        全部: {},
		宣传讲话: {type: 0},
		宣传文集: {type: 1},
		宣传视频: {type: 2},
	},
	有声读物: {
		全部: {},
		中外名著: {bookType: 0},
		戏曲音乐: {bookType: 1},
		相声小说: {bookType: 2},
	}
};
const 列表 = ref([]);
初始化();

// 方法
function backTo(路由) {
	switch (路由) {
        case '首页':
            Store.commit('setState', {
                key: '路由',
                value: '首页',
            });
            break;
        default: {
			if(跳转页 == '宣传教学') {
	        	Store.commit('setState', {
	        	   key: '路由',
	        	   value: '首页',
	            });
	        } else {
	        	Store.commit('setState', {
	        	    key: '路由',
	        	    value: '文化活动',
	            });
	        }
        }
    }	
}
function 初始化() {
	switch (跳转页) {
		case '宣传教学':
			导航栏.value.options = ['全部', '宣传讲话', '宣传视频', '宣传文集'];
			导航栏.value.选中 = '全部';
			break;
		case '图书杂志':
			导航栏.value.options = ['全部', '精神领袖', '中外名著', '国学经典'];
			导航栏.value.选中 = '全部';
			break;
		case '有声读物':
			导航栏.value.options = ['全部', '中外名著', '戏曲音乐', '相声小品'];
			导航栏.value.选中 = '全部';
			break;
	}
	分类查询();
}


function 切换列表() {
	分页.当前页 = 1;
	分类查询(搜索值.value);
}
function 滚动加载({ target }) {
	// 触底判断
	if (target.scrollTop + target.clientHeight >= target.scrollHeight - 20) {
		console.log('加载');
		// 判断是否还有下一页可以加载
		if (分页.当前页 < 分页.总条数) {
			分页.当前页++;
			分类查询();
		}
	}
}
const 节流加载 = 节流(滚动加载, 500);
function 分类查询(keyWords = '') {
	搜索值.value = keyWords;
	loading.value = true;
	switch (跳转页) {
		case '宣传教学':
		    请求接口('/ktv/study/h5/list', { pageNum: 分页.当前页, pageSize: 分页.单页数量, ...资料类型[跳转页][导航栏.value.选中], keyWords: 搜索值.value }).then(res => {
                let list = res.data || [];
				list.forEach(item => {
                    if (item.hasOwnProperty('picture')) {
                      item.coverPath = item.picture;
                      delete item.picture;
                    }
                });
				列表.value = list
            })
			break;
		case '图书杂志':
		    请求接口('/ktv/book/h5/list', { pageNum: 分页.当前页, pageSize: 分页.单页数量, ...资料类型[跳转页][导航栏.value.选中], keyWords: 搜索值.value }).then(res => {
                let list = res.data || [];
				列表.value = list
            })
			break;
		case '有声读物':
		    请求接口('/ktv/audioBook/h5/list', { pageNum: 分页.当前页, pageSize: 分页.单页数量, ...资料类型[跳转页][导航栏.value.选中], keyWords: 搜索值.value }).then(res => {
                let list = res.data || [];
				列表.value = list;
            })
			break;
	}
}

function 打开资料(列表项) {
	console.log(列表项)
    switch(跳转页){
		case '宣传教学':
			if(列表项.type == 2) {
				let 电影 = 列表项
				电影.movieNumber = 电影.bizKtvStudyNumberList;
				电影.movieName = 电影.name;
				电影.movieDetails = 电影.details;
				delete 电影.bizKtvStudyNumberList;
				delete 电影.name;
				delete 电影.details;
				Store.commit('setState', {
                    key: '路由',
                    value: '影视类型'
                });
		        Store.commit('setState', {
                    key: '路由来源',
                    value: '宣传教学'
                });
                Store.commit('setState', {
                    key: '电影',
                    value: 电影
                });
			} else {
				Store.commit('setState', {
                key: '路由',
                value: '资料章节'
                });
		        Store.commit('setState', {
                    key: '路由来源',
                    value: '图书杂志'
                });
                Store.commit('setState', {
                    key: '资料',
                    value: 列表项
                });
			    Store.commit('setState', {
                    key: '是否有声',
                    value: false
                });
			}
		    break;
        case "图书杂志":
		    Store.commit('setState', {
                key: '路由',
                value: '资料章节'
            });
		    Store.commit('setState', {
                key: '路由来源',
                value: '图书杂志'
            });
            Store.commit('setState', {
                key: '资料',
                value: 列表项
            });
			Store.commit('setState', {
                key: '是否有声',
                value: false
            });
			break;
		case "有声读物":
		    Store.commit('setState', {
                key: '路由',
                value: '资料章节'
            });
		    Store.commit('setState', {
                key: '路由来源',
                value: '有声读物'
            });
            Store.commit('setState', {
                key: '资料',
                value: 列表项
            });
			Store.commit('setState', {
                key: '是否有声',
                value: true
            });
			break;
	}
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
		height: 320rem;
		padding: 30rem;
		border-radius: 10rem;
		background: #fff;
		display: flex;
		> .封面 {
			height: 100%;
			width: 200rem;
			margin-right: 30rem;
		}
		.书名 {
			font-size: 26rem;
			color: #35393d;
			padding-left: 10rem;
		}
		.简介 {
			font-size: 22rem;
			color: #7d8996;
			padding-left: 10rem;
			display: -webkit-box;
            -webkit-line-clamp: 3; /* 显示的行数 */
            -webkit-box-orient: vertical;
            overflow: hidden;
		}
		.button {
			width: 140rem;
			height: 60rem;
			color: #fff;
			background: #f22f55;
			border-radius: 40rem;
			font-size: 24rem;
		}
	}
}
</style>
