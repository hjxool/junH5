<template>
    <commonPage>
        <template #header>
            <headStyle :返回事件="返回">
                <template #title>问卷测评</template>
                <template #事件>
                    <div class="rowLayout">
                        <div class="rowLayout">
                            <var-icon name="home" size="40rem" color="#fff" @click="返回('首页')" />
                        </div>
                    </div>
                </template>
            </headStyle>
        </template>
        <template #body>
            <answer v-if="答题" :试题="试题"></answer>
            <div class="sticky-example" v-if="!答题">
                <var-tabs elevation color="#ECECEC" active-color="#35393D" inactive-color="#7D8996"
                    v-model:active="active" @change="getData()">
                    <var-tab><span>我的问卷</span></var-tab>
                    <var-tab><span>我的测评</span></var-tab>
                </var-tabs>
                <div class="subtabs">
                    <div class="item"
                        :style="{ color: subtab?.id === item.id ? '#35393D' : '#7D8996', background: item.id === subtab?.id ? '#FFFFFF' : 'transparent' }"
                        v-for="item in submenu" :key="item.id" @click="handleClick(item)">
                        <img :src="item.imgSrc" style="width:24rem;height:24rem" alt="">
                        {{ item.name }}
                    </div>
                </div>
                <var-input variant="outlined" v-model="关键词" clearable
                    style="margin-top: 10rem;margin-left:35rem;width: 646rem;height: 66rem;">
                    <template #prepend-icon>
                        <var-icon name="magnify" />
                    </template>
                    <template #append-icon>
                        <var-button
                            style="width: 102rem;height: 52rem;background: #504648;border-radius: 26rem;color:#fff"
                            @click="getData()">搜索</var-button>
                    </template>
                </var-input>
                <div class="cardlist">
                    <div class="card" v-for="item in 列表" :key="item.id" @click="handleAnswer(item)">
                        <div class="img"></div>
                        <div class="info">
                            <div class="status"
                                :class="{ 'active-status': item.status === 1, 'inactive-status': item.status === 0, 'end-status': item.status === 2 }">
                            </div>
                            <span class="name"
                                style="font-family: Microsoft YaHei;font-weight: 400;font-size: 26rem;color: #35393D;">{{
                                    item.name }}</span>
                            <span class="text">参测人员：{{ item.person }}</span>
                            <span class="text">开始时间： {{ item.startTime }} </span>
                            <span class="text">结束时间： {{ item.endTime }}</span>
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
import answer from '@/views/问卷测评答题.vue'
import { 消息, 请求接口, 提示框 } from '@/常用方法.js';
import { useStore } from 'vuex';
import { ref, onMounted, watch } from 'vue';


const 答题 = ref(false);
const store = useStore();
const active = ref(0);
const 关键词 = ref('');
const submenu = ref([
    { name: '我的', id: 1, imgSrc: '/图片资源/业务_问卷.png' },
    { name: '历史', id: 2, imgSrc: '/图片资源/历史时间-2.png' },
]);
const subtab = ref({ name: '我的问卷', id: 1 });
const 列表 = ref([]);
const 试题 = ref([]);


watch(subtab, () => {
    // console.log(subtab.value);
    getData();
});
const handleClick = (item) => {
    subtab.value = item;
};
const handleAnswer = (item) => {
    console.log(item);
    if (item.status !== 0) {
        getDetail(item.id);
        答题.value = true;
    } else {
        消息('未到开始时间！',1);
    }

};
const getData = async () => {
    const body = {
        type: active.value,
        name: 关键词.value,
    }
    await 请求接口('/ktv/questionnaire/h5/list', body).then(res => {
        列表.value = res.data;
        if (subtab.value.id !== 2) {
            列表.value = res.data.filter(item => item.status !== 2);
        } else {
            列表.value = res.data.filter(item => item.status === 2);
        }
    })
};

const getDetail = async (id) => {
    await 请求接口(`/ktv/questionnaire/h5/getQuestionnaireById/${id}`).then(res => {
        试题.value = res;
        // console.log(试题.value);
    })
}
const 返回 = (page) => {
    switch (page) {
        case '首页': {
            store.commit('setState', {
                key: '路由',
                value: '首页'
            });
        } break;
        default: {
            if (答题.value) {
                答题.value = false;
            } else {
                store.commit('setState', {
                    key: '路由',
                    value: '首页'
                });
            }
        }
    }
}

// watch(() => active.value, () => {
//     subtab.value.id = 1
// });
onMounted(() => {
    getData();
});
</script>

<style lang="less" scoped>
@import '@/通用样式/style2.css';

.sticky-example {
    height: 100vh;
    overflow: auto;
    position: relative;
    flex-direction: column;

    .subtabs {
        width: 100%;
        height: 90rem;
        min-height: 90rem;
        background: #E2E2E2;
        border-radius: 1rem;
        flex-shrink: 0;
        display: flex;
        justify-content: space-around;
        align-items: flex-end;

        .item {
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Microsoft YaHei;
            gap: 10rem;
            font-weight: 400;
            font-size: 24rem;
            color: #35393D;
            width: 291rem;
            height: 72rem;
            border-radius: 20rem 20rem 0rem 0rem;
        }
    }

    .cardlist {
        padding-top: 50rem;
        padding-left: 25rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 25rem;

        .card {
            width: 661rem;
            height: 271rem;
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
                background-image: url('/图片资源/问卷.png');
                background-size: 100%;
            }

            .info {
                width: 340rem;
                display: flex;
                flex-direction: column;
                gap: 10rem;
                position: relative;

                .status {
                    top: -30rem;
                    right: 10rem;
                    position: absolute;
                    width: 95rem;
                    height: 97rem;
                    background-image: none;
                    background-size: 100%;

                    &.active-status {
                        background-image: url('/图片资源/测评进行中.png');
                    }

                    &.inactive-status {
                        background-image: url('/图片资源/测评未进行.png');
                    }

                    &.end-status {
                        background-image: url('/图片资源/测评已结束.png');
                    }
                }

                .text {
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    font-size: 22rem;
                    color: #7D8996;
                    line-height: 36rem;
                }
            }
        }
    }
}
</style>