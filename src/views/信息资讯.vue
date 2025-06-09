<template>
    <commonPage>
        <template #header>
            <headStyle :返回事件="返回">
                <template #title>信息资讯</template>
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
            <div class="sticky-example">
                <var-input v-if="!展示内容" variant="outlined" v-model="关键词" clearable
                    style="margin-top: 10rem;width: 646rem;height: 66rem;">
                    <template #prepend-icon>
                        <var-icon name="magnify" />
                    </template>
                    <template #append-icon>
                        <var-button @click="getData()"
                            style="width: 102rem;height: 52rem;background: #504648;border-radius: 26rem;color:#fff">搜索</var-button>
                    </template>
                </var-input>
                <div class="cardlist" v-if="!展示内容">
                    <div style="width:100%;text-align:center;font-size:26rem" v-if="列表数据.length === 0">暂无信息</div>
                    <div class="card" v-for="item in 列表数据" :key="item.id" @click="handleClick(item)">
                        <div class="leftbox">
                            <div class="content">{{ item.title }}</div>
                            <div class="info">{{ item.source }} </div>
                            <div class="info">{{ item.updateTime }}
                            </div>
                        </div>
                        <div class="img">
                            <img :src="访问静态资源(item.coverPath)" style="width:100%;height:100%" alt="">
                        </div>
                    </div>
                </div>
                <div v-show="展示内容" class="text-content" ref="textContent"></div>
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
import { ref, onMounted } from 'vue';
const store = useStore();
// store.commit('setState', {
// 	路由: '陆军风采',
// });

const 列表数据 = ref([]);
const 关键词 = ref('');
const textContent = ref(null);
const 展示内容 = ref(false);
const getData = async () => {
    await 请求接口('/ktv/news/h5/list', { title: 关键词.value }).then(res => {
        // console.log(res);
        列表数据.value = res.data;
    })
};
const 返回 = (页面) => {
    switch (页面) {
        case '首页': {
            store.commit('setState', {
                key: '路由',
                value: '首页',
            });
        } break;
        default: {
            if (展示内容.value) {
                展示内容.value = false;
            } else {
                store.commit('setState', {
                    key: '路由',
                    value: '文化活动'
                });
            }
        }
    }
}
const handleClick = (item) => {
    // console.log(item.htmlContent);
    展示内容.value = true;
    if(item.htmlContent){
        textContent.value.innerHTML = item.htmlContent;
        textContent.value.style.paddingTop = "5rem"
    }else{
        textContent.value.innerHTML ="空空如也"
        textContent.value.style.paddingTop = "50rem"
    }
    
}
onMounted(() => {
    getData();
});
</script>
<style lang="less" scoped>
@import url('@/通用样式/style2.css');

.sticky-example {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;

    .var-sticky {
        position: relative;
        width: 100%;
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
            height: 239rem;
            background: #FFFFFF;
            cursor: pointer;
            border-radius: 10rem;
            border: 1px solid #D2D2D2;
            display: flex;
            justify-content: center;
            align-items: center;

            .leftbox {
                display: flex;
                flex-direction: column;
                gap: 25rem;

                .content {
                    width: 349rem;
                    height: 62rem;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    font-size: 26rem;
                    color: #35393D;
                    line-height: 40rem;
                }

                .info {
                    width: 354rem;
                    height: 22rem;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    font-size: 22rem;
                    color: #7D8996;
                    line-height: 36rem;
                }
            }

            .img {
                width: 190rem;
                height: 168rem;
                background: #DDDDDD;
                border-radius: 10rem;
            }
        }
    }
}

.text-content {
    font-size: 15px;
    overflow-y: scroll;
}
</style>