<template>
    <commonPage>
            <template #body>
                <div class="sticky-example">
                    <div class="菜单选项" v-for="item in 菜单列表" :key="item.id" @click="点击菜单(item)" :style="{
                        '--imgurl': `url(${item.imgurl})`,
                        '--imgurl2': `url(${item.imgurl2})`
                    }">
                    </div>
                </div>
            </template>
    </commonPage>

</template>

<script setup>
import commonPage from '@/组件/通用页面.vue';
import headStyle from '@/组件/头部样式.vue';
import listContainer from '@/组件/列表容器.vue';
import { 消息, 请求接口, 提示框 } from '@/常用方法.js';
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';
const store = useStore();
// store.commit('setState', {
// 	路由: '陆军风采',
// });
const 菜单列表 = ref([
    { id: '1', name: '卡拉OK', imgurl: '/图片资源/卡拉OK新.png', imgurl2: '/图片资源/卡拉OK新.png' },
    { id: '2', name: '影视节目', imgurl: '/图片资源/影视节目新.png', imgurl2: '/图片资源/影视节目新.png' },
    { id: '3', name: '卫星电视', imgurl: '/图片资源/卫星电视新.png', imgurl2: '/图片资源/卫星电视新.png' },
    { id: '4', name: '宣传教学', imgurl: '/图片资源/宣传教学新.png', imgurl2: '/图片资源/宣传教学新.png' },
    { id: '5', name: '风采展示', imgurl: '/图片资源/风采展示新.png', imgurl2: '/图片资源/风采展示新.png' },
    { id: '6', name: '文化活动', imgurl: '/图片资源/文化活动新.png', imgurl2: '/图片资源/文化活动新.png' },
    { id: '7', name: '问卷测评', imgurl: '/图片资源/问卷测评新.png', imgurl2: '/图片资源/问卷测评新.png' },
    // { id: '8', name: '问卷测评', imgurl: '/图片资源/问卷测评.png', imgurl2: '/图片资源/问卷测评2.png' },
    // { id: '9', name: '信息咨询', imgurl: '/图片资源/信息咨询.png', imgurl2: '/图片资源/信息咨询2.png' },
])

const 点击菜单 = (item) => {
    store.commit('setState', {
        key: '路由',
        value: item.name
    });
}
</script>
<style lang="less" scoped>
@import url('@/通用样式/style2.css');

:deep(.commonPageBody) {
    margin-top: 32rem;
}

:deep(.背景图) {
    background-image: url('/图片资源/首页.png');
    background-size: contain;
}

.sticky-example {
    // height: 100%;
    overflow-y: scroll;
    display: grid;
    padding: 38rem;
    grid-template-columns: repeat(2, 311rem);
    grid-auto-rows: 290rem;
    gap: 24rem;

    .菜单选项 {
        width: 306rem;
        height: 290rem;
        background-size: 100%;
        background-image: var(--imgurl);
        /* 默认显示正常状态 */
        transition: background-image 0.3s;
        /* 添加过渡效果 */
        &:hover {
            background-image: var(--imgurl2);
            /* 悬停时显示激活状态 */
        }
    }
}
</style>