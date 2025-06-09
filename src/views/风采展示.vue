<template>
  <commonPage>
    <template #header>
      <headStyle :返回事件="返回">
        <template #title>风采展示</template>
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
      <div class="sticky-example" v-if="!展开相册">
        <var-tabs elevation color="#ECECEC" active-color="#35393D" inactive-color="#7D8996" v-model:active="active"
          @change="getData()">
          <var-tab v-for="item in 分类列表" :key="item.id">{{ item.name }}</var-tab>
        </var-tabs>
        <var-input variant="outlined" v-model="keyWords" clearable 
          style="margin-top: 50rem;width: 646rem;height: 66rem;margin-left: 40rem;">
          <template #prepend-icon>
            <var-icon name="magnify" />
          </template>
          <template #append-icon>
            <var-button @click="getData()"
              style="width: 102rem;height: 52rem;background: #504648;border-radius: 26rem;color:#fff">搜索</var-button>
          </template>
        </var-input>
        <div class="cardlist">
          <div class="card" v-for="item in 列表" :key="item.id" @click="handleClick(item)">
            <div class="img">
              <img :src="访问静态资源(item.coverPath)" style="width:100%;height:100%" alt="">
            </div>
            <div class="name">{{ item.name }}</div>
          </div>
        </div>
        <var-back-top :duration="300" :right="10" :bottom="10" />
      </div>
      <div v-else>
        <div class="cardlist">
          <div style="width:100%;text-align:center;font-size:26rem" v-if="相册列表.length === 0">暂无图片</div>
          <div v-else class="card" style="border:0" v-for="item in 相册列表" :key="item.id">
            <!-- <div class="img"> -->
            <img :src="访问静态资源(item.storePath)" style="width:100%;" alt="">
            <!-- </div> -->
            <!-- <div class="name">{{ item.name }}</div> -->
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
import { 消息, 请求接口, 提示框, 访问静态资源 } from '@/常用方法.js';
import { useStore } from 'vuex';
import { ref, onMounted } from 'vue';
const store = useStore();

const keyWords = ref('')
const active = ref(0)
const 列表 = ref([])
const 展开相册 = ref(false)
const 相册列表 = ref([])
const 分类列表 = ref([
  { id: 0, name: '全部' },
  { id: 1, name: '雄姿英发 ' },
  { id: 2, name: '同袍同泽' },
  { id: 3, name: '生活日常' },
])
const getData = async () => {
  const body = {
    name: keyWords.value,
    typeId: active.value == 0 ? '' : active.value - 1
  }
  await 请求接口('/ktv/image/h5/list', body).then(res => {
    列表.value = res.data
  })
}

const handleClick = (item) => {
  // console.log(item.imageNumbersList);
  展开相册.value = true
  相册列表.value = item.imageNumbersList
}
const 返回 = (i) => {
  if (i == '首页') {
    store.commit('setState', {
      key: '路由',
      value: '首页'
    });
  } else {
    if (展开相册.value) {
      展开相册.value = false
    } else {
      store.commit('setState', {
        key: '路由',
        value: '首页'
      });
    }
  }

}
onMounted(() => {
  getData();
})
</script>
<style lang="less" scoped>
@import url('@/通用样式/style2.css');

.sticky-example {
  height: 100vh; // 改用视窗单位确保高度
  overflow: auto; // 修正滚动设置
  position: relative; // 添加定位上下文
  flex-direction: column;
}

.cardlist {
  padding-top: 50rem;
  padding-left: 25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex - start;
  gap: 25rem;

  .card {
    width: 321rem;
    height: 361rem;
    background: #FFFFFF;
    border-radius: 10rem;
    border: 1px solid #D2D2D2;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    .img {
      width: 294rem;
      height: 258rem;
      background: #D5D6D8;
      border-radius: 10rem;
    }

    .name {
      // width: 111rem;
      height: 26rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 26rem;
      color: #35393D;
      line-height: 40rem;
    }
  }
}
</style>