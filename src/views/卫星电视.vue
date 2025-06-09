<template>
    <commonPage>
        <!-- 播放列表 -->
        <template #header>
            <headStyle :返回事件="返回">
                <template #title>卫星电视</template>
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
            <div style="padding-top: 100rem;">
                <player ref="videoPlayer" :videoSrc="选中频道?.channelUrl"></player>
                <div class="cardlist">
                    <div class="card" @click="handleClick(列表项)" :style="{
                        background: 列表项.enable && 列表项.isClicked ? '#F22F55' : 列表项.enable ? '#F7DFDF' : '#E5E8F1',
                        borderColor: 列表项.enable ? '#C92236' : '#808B9B',
                        color: 列表项.enable && 列表项.isClicked ? '#FFFFFF' : 列表项.enable ? '#35393D' : '#748596'
                    }" v-for="列表项 in 列表" :key="列表项.id">{{ 列表项.channelName }}</div>
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
import { 消息, 请求接口, 提示框 } from '@/常用方法.js';
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';

const store = useStore();

const 列表 = ref([])
const 选中频道 = ref(null)
const videoPlayer = ref(null) // 获取 player 组件的引用

const handleClick = (item) => {
    console.log(item);
    if (!item.enable) {
        消息('该频道已停用', 1)
        return;
    } else {
        // 将所有项的 isClicked 设为 false
        列表.value.forEach(listItem => {
            listItem.isClicked = false;
        });
        // 将当前点击项的 isClicked 设为 true
        item.isClicked = true;
        选中频道.value = item

        // 触发视频播放
        if (videoPlayer.value) {
            videoPlayer.value.stopVideo();
            videoPlayer.value.playVideo();
        }
    }
}

const 获取频道 = async () => {
    await 请求接口('/ktv/tv/h5/getAllChannel').then(data => {
        // console.log(data);
        列表.value = data
    })

}
const 返回 = () => {
    store.commit('setState', {
        key: '路由',
        value: '首页'
    });
}
onMounted(() => {
    获取频道()
})
</script>

<style scoped lang="less">
.cardlist {
    padding-top: 50rem;
    padding-left: 40rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex - start;
    gap: 25rem;

    .card {
        width: 197rem;
        height: 131rem;
        border-radius: 13rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Microsoft YaHei;
        border: 1rem solid #C92236;
        font-size: 24rem;
    }
}


.player {
    width: 720rem;
    height: 405rem;
    background: #353232;
}
</style>