<template>
    <commonPage>
        <template #header>
            <headStyle :返回事件="返回">
                <template #title>影视节目</template>
                <template #事件>
                    <div class="rowLayout">
                        <div class="rowLayout">
                            <var-icon name="home" size="40rem" color="#fff" @click="返回()" />
                        </div>
                    </div>
                </template>
            </headStyle>
        </template>
        <template #body>
            <div class="sticky-example">
                <var-tabs elevation color="#ECECEC" active-color="#35393D" inactive-color="#7D8996"
                    v-model:active="active">
                    <var-tab v-for="item in 一级分类" :key="item.categoryId">{{ item.categoryName }}</var-tab>
                </var-tabs>
                <div class="subtabs">
                    <div class="item" :style="{ color: subtab?.typeId === item.typeId ? '#35393D' : '#7D8996' }"
                        v-for="item in 二级分类" :key="item.typeId" @click="handleClick(item)">{{ item.typeName
                        }}</div>
                </div>
                <var-input variant="outlined" v-model="关键词" clearable
                    style="margin-top: 10rem;margin-left:35rem;width: 646rem;height: 66rem;">
                    <template #prepend-icon>
                        <var-icon name="magnify" />
                    </template>
                    <template #append-icon>
                        <var-button @click="getData()"
                            style="width: 102rem;height: 52rem;background: #504648;border-radius: 26rem;color:#fff">搜索</var-button>
                    </template>
                </var-input>
                <div class="cardlist">
                    <div style="width:100%;text-align:center;font-size:26rem" v-if="列表.length === 0">暂无资源</div>
                    <div v-else class="card" v-for="item in 列表" :key="item">
                        <div class="img">
                            <img :src="访问静态资源(item.coverPath)" style="width:100%;height:100%" alt="">
                            <div class="playbtn" @click="playVideo(item)"></div>
                        </div>
                        <div class="info">
                            <span class="name"
                                style="font-family: Microsoft YaHei;font-weight: 400;font-size: 26rem;color: #35393D;">{{
                                    item.movieName }}</span>
                            <span class="text">导演： {{ item.director }}</span>
                            <span class="text">主演： {{ 省略演员表(item.actor) }} </span>
                            <span class="text">简介： {{ 省略简介(item.movieDetails) }}</span>
                        </div>
                    </div>
                </div>
                <var-back-top :duration="300" :right="10" :bottom="10" />
            </div>
        </template>
    </commonPage>

</template>

<script setup>
import commonPage from '@/组件/通用页面.vue';
import headStyle from '@/组件/头部样式.vue';
import { 消息, 请求接口, 提示框, 访问静态资源 } from '@/常用方法.js';
import { useStore } from 'vuex';
import { ref, onMounted, watch } from 'vue';
const store = useStore();
// store.commit('setState', {
// 	路由: '陆军风采',
// });

const 列表 = ref([]);
const 一级分类 = ref([
    { id: 0, name: '电影' },
    { id: 1, name: '电视剧' },
    { id: 2, name: '微电影' },
    { id: 3, name: '动漫' },
    { id: 4, name: '综艺' },
    { id: 5, name: '纪录片' }
])
const 关键词 = ref('')

const 二级分类 = ref([])
const subtab = ref({ typeName: ' 革命 ', typeId: 0 })
const handleClick = (item) => {
    subtab.value = item
    getData()
}

const active = ref(0)
const playVideo = (item) => {
    store.commit('setState', {
        key: '路由',
        value: '影视类型'
    });
    store.commit('setState', {
        key: '电影',
        value: item
    });
    store.commit('setState', {
        key: '军营影院变量',
        value: {
            subtab: subtab.value,
            active: active.value,
            keyWords: 关键词.value,
        }
    });
}
const 省略演员表 = (str) => {
    return str.split('/').slice(0, 3).join('/') + '...'
}

const 省略简介 = (str) => {
    return str.slice(0, 36) + '...'
}
const 返回 = () => {
    store.commit('setState', {
        key: '路由',
        value: '首页'
    });
    store.commit('setState', {
        key: '军营影院变量',
        value: {
            subtab: { typeName: ' 革命 ', typeId: 0 },
            active: 0,
            keyWords: '',
        }
    });
}

watch(() => active.value, async () => {
    // console.log(一级分类.value[active.value]);
    if (一级分类.value[active.value].types.length === 0) {
        二级分类.value = [{ typeId: '', name: '' }]
    } else {
        二级分类.value = 一级分类.value[active.value].types
    }
    // console.log(二级分类.value);
    subtab.value = 二级分类.value[0]
    // console.log(subtab.value);
    await getData()
})
const getData = async () => {
    // console.log( active.value, subtab.value.typeId);
    // 二级分类.value.length == 0 ? subtab.value.typeId = null : subtab.value.typeId = subtab.value.typeId
    await 请求接口('/ktv/movie/h5/list', { movieName: 关键词.value, categoryId: active.value, typeId: subtab.value.typeId }).then(res => {
        // console.log(res);
        列表.value = res.data;
    })
}
const 获取分类 = async () => {
    await 请求接口('/ktv/movie/h5/categories').then(res => {
        // console.log(res);
        一级分类.value = res
        二级分类.value = 一级分类.value[0].types
    })
}

onMounted(() => {
    获取分类()
    if (store.state.军营影院变量) {
        subtab.value = store.state.军营影院变量.subtab
        active.value = store.state.军营影院变量.active
        关键词.value = store.state.军营影院变量.keyWords
        getData();
    } else {
        getData();
    }
})
</script>
<style lang="less" scoped>
@import '@/通用样式/style2.css';

.sticky-example {
    height: 100vh; // 改用视窗单位确保高度
    overflow: auto; // 修正滚动设置
    position: relative; // 添加定位上下文
    flex-direction: column;

    .subtabs {
        width: 100%;
        height: 90rem;
        min-height: 90rem; // 防止被压缩
        background: #ECECEC;
        border-radius: 1rem;
        flex-shrink: 0; // 禁止收缩 ✅
        display: flex;
        justify-content: space-around;
        align-items: center;

        .item {
            font-family: Microsoft YaHei;
            font-weight: 400;
            font-size: 24rem;
            color: #35393D;
        }
    }

    .cardlist {
        padding-top: 50rem;
        padding-left: 25rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex - start;
        gap: 25rem;

        .card {
            width: 661rem;
            height: 301rem;
            background: #FFFFFF;
            border-radius: 10rem;
            border: 1rem solid #D2D2D2;
            display: flex;
            justify-content: space-around;
            align-items: center;

            .img {
                width: 200rem;
                height: 230rem;
                background: #DDDDDD;
                border-radius: 10rem;
                position: relative;

                .playbtn {
                    position: absolute;
                    cursor: pointer;
                    right: 10rem;
                    bottom: 10rem;
                    width: 81rem;
                    height: 81rem;
                    background-image: url('/图片资源/播放键.png');
                    background-size: 100%;
                }
            }

            .info {
                width: 340rem;
                display: flex;
                flex-direction: column;
                gap: 5rem;

                .text {
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    font-size: 24rem;
                    color: #7D8996;
                    line-height: 36rem;
                }
            }
        }
    }
}
</style>