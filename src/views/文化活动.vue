<template>
    <commonPage>
        <template #header>
            <headStyle :返回事件="返回">
                <template #title>文化活动</template>
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
    { id: '1', name: '图书杂志', imgurl: '/图片资源/图书杂志新.png', imgurl2: '/图片资源/图书杂志新.png' },
    { id: '2', name: '有声读物', imgurl: '/图片资源/有声读物新.png', imgurl2: '/图片资源/有声读物新.png' },
    { id: '3', name: '信息资讯', imgurl: '/图片资源/信息资讯新.png', imgurl2: '/图片资源/信息资讯新.png' },
    { id: '4', name: '游戏娱乐', imgurl: '/图片资源/游戏娱乐新.png', imgurl2: '/图片资源/游戏娱乐新.png' },
])

const 点击菜单 = (item) => {
    store.commit('setState', {
        key: '路由',
        value: item.name
    });
}
const 返回 = () => {
    store.commit('setState', {
        key: '路由',
        value: '首页'
    });
}
</script>
<style lang="less" scoped>
@import url('@/通用样式/style2.css');

:deep(.body) {
    margin-top: 50rem;
}


.sticky-example {
    height: 100%;
    overflow: scroll;
    display: grid;
    padding: 38rem;
    grid-template-columns: repeat(2, 307rem);
    grid-auto-rows: 200rem;
    gap: 24rem;

    .菜单选项 {
        width: 307rem;
        height: 200rem;
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