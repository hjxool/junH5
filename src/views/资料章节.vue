<template>
	<commonPage>
		<template #header>
			<headStyle :返回事件="backTo">
				<template #事件>
					<!-- <div class="rowLayout">
						<var-icon name="home" size="40rem" color="#fff" @click="backTo" />
					</div> -->
				</template>
			</headStyle>
		</template>

		<template #body>
			<div class="body colLayout">
                <div class="book-container">
                    <div v-show="currentPage === 'read'" class="read-page">
                        <div class="content-padding">
                            <div class="text-content">
                                <div class="chapterContent">
                                    <!-- <p class="chapterTitle">{{ chapters[currentChapterIndex].title }}</p> -->
                                    <div class="contentDetails" v-html="chapterContent"></div>
                                </div>
                            </div>
                            
                            <div class="bottom-buttons">
                              <var-button type="primary" plain class="nav-button prevBtn" @click="上一章">上一章</var-button>
                              <var-button type="primary" plain class="nav-button catalogBtn" @click="打开目录">目录</var-button>
                              <var-button type="primary" plain class="nav-button nextBtn" @click="下一章">下一章</var-button>
                            </div>
                        </div>
                    </div>
              
                    <div class="catalog-overlay" v-show="showCatalog" @click="关闭目录"></div>
        
                    <div class="catalog-panel" :class="{ 'panel-open': showCatalog }">
                        <div class="panel-header">
                            <div class="book-title">{{ book.name }}</div>
                            <div class="author">作者：{{book.author}}</div>
                            <div class="author">目录</div>
                        </div>
                        
                        <div class="catalog-content">
                            <div 
                              v-for="(chapter, index) in chapters" 
                              :key="chapter.chapterIndex" 
                              class="chapter-item"
                              :class="{ active: currentChapterIndex === index }"
                              @click="选择章节(index)"
                            >
                              {{ chapter.title }}
                            </div>
                        </div>
                    </div>
                </div>
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
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

// 属性
const Store = useStore();
const { 跳转页 } = defineProps(['跳转页']);
const currentPage = ref('read'); // 'read' 或 'catalog'
const currentChapterIndex = ref(0);
const showCatalog = ref(false);
const routeFrom = ref(Store.state.路由来源)
const book = ref(computed(() => Store.state.资料))
const chapterContent = ref(null)

const chapters = ref([]);
初始化();

const 选择章节 = (index) => {
  currentChapterIndex.value = index;
  currentPage.value = 'read';
  获取章节内容(index)
  console.log(`选择了第${index + 1}章`);
};

// 处理上一章按钮点击
const 上一章 = () => {
  if (currentChapterIndex.value > 0) {
    currentChapterIndex.value--;
    获取章节内容(currentChapterIndex.value)
  } else {
    console.log('已经是第一章');
  }
};

// 处理下一章按钮点击
const 下一章 = () => {
  if (currentChapterIndex.value < chapters.value.length - 1) {
    currentChapterIndex.value++;
    获取章节内容(currentChapterIndex.value)
  } else {
    console.log('已经是最后一章');
  }
};

const 打开目录 = () => {
  showCatalog.value = true;
};

const 关闭目录 = () => {
  showCatalog.value = false;
};

// 方法
function backTo() {
    if(routeFrom.value == '图书杂志') {
        Store.commit('setState', {
           key: '路由',
           value: '图书杂志',
        });
    }
}
function 初始化() {
	获取资料内容()
}

function 获取资料内容() {
    请求接口('/ktv/upload/getChapterIndex', {relativePath:book.value.storePath}).then(res => {
        chapters.value = res;
        if(res){
            获取章节内容(0)
        } else {
            消息('未获取到目录', 1);
        }
    })
}

async function 获取章节内容(index) {
    let path = chapters.value[index].chapterFilePath
    const res = await 请求接口('/ktv/upload/staticResources', {path: path})
    chapterContent.value = res
}

</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
.body {
	overflow: hidden;
    .book-container {
        height: 100vh;
        background-color: #fff;
        position: relative;
        overflow: hidden;
        .read-page {
            height: 100%;
            position: relative;

            .content-padding {
                padding: 16rem;
                .text-content {
                    line-height: 1.6;
                    color: #333;
                    .chapterContent {
                        color: #696D71;
                        .chapterTitle {
                            color: #35393D;
                            font-size: 36rem;
                            font-weight: 400;
                            margin-left: 40rem;
                            line-height: 40rem;
                        }
                        .contentDetails {
                            line-height: 60rem;
                            overflow-y:auto;
                            scrollbar-width: none;
                            height: 1260rem;
                            padding: 40rem;
                            font-size: 30rem;
                            white-space: pre-wrap; 
                            word-wrap: break-word;
                        }
                    }
                }
                .bottom-buttons {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: space-around;
                    padding: 12rem 16rem;
                    background: #FFFFFF;
                    border-top: 1rem solid #eee;
                    .nav-button {
                        width: 140rem;
                        height: 60rem;
                        border-radius: 40rem;
                        font-size: 24rem;
                        color: #fff;
                    }
                    
                    .prevBtn,
                    .nextBtn {
                        background: #f22f55;
                    }
                    
                    .catalogBtn {
                        background: #504648;
                    }
                }
            }
        }
    }
   
    .text-content p {
        margin-bottom: 16rem;
    }
    
    
    .catalog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }
    
    .catalog-panel {
        position: fixed;
        top: 0;
        left: -75%;
        width: 75%; 
        height: 100%;
        background-color: #f5f5f5;
        z-index: 101;
        transition: transform 0.3s ease;
        box-shadow: 2rem 0 8rem rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
    }
    
    .panel-open {
        transform: translateX(100%); 
    }
    
    .panel-header {
        padding: 30rem;
        border-bottom: 1rem solid #ddd;
        position: relative;
        background-color: #fff;
    }
    
    .book-title {
        font-size: 36rem;
        font-weight: bold;
    }
    
    .author {
        font-size: 30rem;
        color: #35393D;
        margin-top:24rem;
    }
    
    .catalog-content {
        flex: 1;
        overflow-y: auto;
        padding: 16rem;
    }
    
    .chapter-item {
        padding: 16rem;
        border-bottom: 1rem solid #eee;
        font-size: 30rem;
        position: relative;
    }
    
    .chapter-item::before {
        content: attr(data-number);
        position: absolute;
        left: -20rem;
        color: #999;
        opacity: 0.5;
    }
    
    .chapter-item.active {
        color: #f00;
        font-weight: bold;
    }
}

</style>