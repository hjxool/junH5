<template>
    <commonPage>
        <template #header>
            <headStyle :返回事件="返回">
                <template #title>影视类型</template>
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
            <div style="padding:  45rem;overflow-y:scroll ;font-size: 28rem;">
                <div class="box">
                    <!-- <span style="overflow-x:scroll" >{{ `${接口地址}${staticResourcesPath}${encodeURIComponent(播放地址)}` }}</span> -->
                    <player v-show="play" ref="videoPlayer"
                        :videoSrc="`${接口地址}${staticResourcesPath}${encodeURIComponent(播放地址)}`"></player>

                </div>
                <div class="box" v-show="!play">
                    <div class="img">
                        <img :src="访问静态资源(movie.coverPath)" style="width:100%;height:100%" alt="">
                    </div>
                    <div class="info">
                        <div class="label">{{ movie.movieName }} </div>
                        <div class="text">{{ movie.keyWords }}</div>
                        <div class="text">影视时长：{{ movie.totalDuration }}</div>
                        <var-button class="btn" type="primary" size="large" @click="handlePlay(0)"></var-button>
                    </div>
                </div>
                <div class="box box2">
                    <span class="label">选集</span>
                    <div class="选集">
                        <div class="num" :class="{ '播放样式': 播放索引 === index, '未播放样式': 播放索引 !== index }"
                            v-for="(item, index) in movie.movieNumber" :key="item.id" @click="切换选集(index)">
                            {{ index }}</div>
                    </div>
                </div>
                <div class="box box2" style="background: none;">
                    <div class="label">简介</div>
                    <div class="text">导演：{{ movie.director || '无' }}</div>
                    <div class="text">主演： {{ movie.actor }}</div>
                    <div class="label">剧情简介</div>
                    <div class="text">
                        {{ movie.movieDetails }}
                    </div>
                </div>
            </div>
        </template>
    </commonPage>

</template>

<script setup>
import commonPage from '@/组件/通用页面.vue';
import headStyle from '@/组件/头部样式.vue';
import listContainer from '@/组件/列表容器.vue';
import player from '@/组件/视频播放器.vue';
import { 接口地址 } from '@/系统常量.js';
import { 消息, 请求接口, 提示框, 访问静态资源 } from '@/常用方法.js';
import { useStore } from 'vuex';
import { ref, onMounted, computed } from 'vue';
const store = useStore();
// store.commit('setState', {
// 	路由: '陆军风采',
// });
const routeFrom = ref(store.state.路由来源)
const movie = ref(computed(() => store.state.电影))
const play = ref(false);
const staticResourcesPath = "/ktv/upload/staticResources?path="
const 播放地址 = ref(movie.value.movieNumber[0].filePath)
const 播放索引 = ref(null)
const videoPlayer = ref(null);
const handlePlay = (k) => {
    播放索引.value = k
    play.value = true;
    if (videoPlayer.value) {
        videoPlayer.value.playVideo();
    }
};
const 返回 = (路由) => {
    switch (路由) {
        case '首页':
            store.commit('setState', {
                key: '路由',
                value: '首页',
            });
            store.commit('setState', {
                key: '军营影院变量',
                value: {
                    subtab: { typeName: ' 革命 ', typeId: 0 },
                    active: 0,
                    keyWords: '',
                }
            });
            videoPlayer.value.stopVideo();
            break;
        default: {
            if (play.value) {
                play.value = false;
                播放索引.value = null
                videoPlayer.value.stopVideo();
            } else {
                if(routeFrom.value == '宣传教学') {
                    store.commit('setState', {
                       key: '路由',
                       value: '宣传教学',
                    });
                } else {
                    store.commit('setState', {
                       key: '路由',
                       value: '影视节目',
                    });
                }
                videoPlayer.value.stopVideo();
            }
        }
    }
};
const 切换选集 = (index) => {
    // 播放索引.value = 
    handlePlay(index)
    播放地址.value = movie.value.movieNumber[index].filePath
}
const getDetail = async () => {
    await 请求接口('/ktv/movie/h5/getMovieById', { id: movie.value.id }).then(res => {
        movie.value = res;
        // 播放索引.value = 0;
    })
}

onMounted(() => {
    // console.log(movie.value);
    if(routeFrom.value == undefined) {
        getDetail();
    }
})
</script>
<style lang="less" scoped>
@import url('@/通用样式/style2.css');

.box {
    display: flex;
    justify-content: space-around;

    .img {
        width: 200rem;
        height: 230rem;
        background: #DDDDDD;
        border-radius: 10rem;
    }

    .info {
        width: 340rem;
        display: flex;
        flex-direction: column;
        gap: 20rem;

        .btn {
            width: 140rem;
            height: 58rem;
            background-image: url('/图片资源/播放2.png');
            background-size: 100% 100%;
            border-radius: 50rem;
        }
    }
}

.box2 {
    width: 640rem;
    height: max-content;
    background: #F1F3F6;
    border-radius: 10rem;
    margin-top: 20rem;
    flex-direction: column;
    justify-content: flex-start;
    padding: 22rem 28rem;
    gap: 27rem;

    .选集 {
        display: flex;
        gap: 20rem;
        width: 584rem;
        flex-wrap: wrap;
        overflow-y: scroll;

        .num {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 65rem;
            height: 65rem;
            border-radius: 10rem;
            border: 1rem solid #C3C3C3;
            font-family: Microsoft YaHei;
            font-weight: 400;
            font-size: 24rem;

        }
    }

}

.label {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 26rem;
    color: #35393D;
    margin-left: 0;
}

.text {
    // width: fit-content;
    // height: 35rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 24rem;
    color: #7D8996;
    // overflow: hidden;
}

.播放样式 {
    background: #F22F55;
    color: #fff;
}

.未播放样式 {
    background: #FFFFFF;
    color: #35393D;
}
</style>