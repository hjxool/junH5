<template>

    <div>
        <div class="header ">
            <var-select placeholder="分组" v-model="分组" clearable @change="筛选分组()" @clear="筛选分组()">
                <var-option v-for="(item) in 分组下拉选项" :key="item.id" :label="item.label" :value="item.value" />
            </var-select>
            <var-select placeholder="状态" v-model="状态" clearable @change="筛选状态()" @clear="筛选状态()">
                <var-option v-for="(item) in 状态列表" :key="item.terminalStatus" :label="item.terminalStatusName"
                    :value="item.terminalStatus" />
            </var-select>
            <var-input v-model="终端名称" clearable @input="模糊搜索终端名称()" @clear="模糊搜索终端名称()"></var-input>
        </div>
        <div class="body">
            <div v-if="终端列表.length === 0">
                <div class="empty">暂无终端设备</div>
            </div>
            <template v-else>
                <div class="card" v-for="item in 终端列表" :key="item.terminalId">
                    <div class="left center">
                        <img src="/图片资源/终端.png">
                    </div>
                    <div class="right center">
                        <div class="rowLayout">
                            <div class="terminal-name">{{ item.termName }}</div>
                            <div class="terminal-status" :style="{ color: item.status ? '#0EA64F' : '#798491' }">
                                <div style="width:8rem;height:8rem;border-radius:50%"
                                    :style="{ background: item.status ? '#0EA64F' : '#798491' }"></div>{{
                                        item.status == 1 ? '在线' : '离线' }}
                            </div>
                        </div>
                        <div class="rowLayout">
                            <div class="terminal-ip"><img src="/图片资源/Ip.png" alt=""> {{ item.ip }}</div>
                            <div class="terminal-type"
                                :style="{ background: 终端类型[item.termType].bgcolor, color: 终端类型[item.termType].color }">
                                {{ 终端类型[item.termType].name }}
                            </div>
                        </div>
                    </div>

                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { 消息, 请求接口 } from '@/常用方法.js';

const props = defineProps({
    // props选项
    业务类型: { type: Number, required: false, default: 4 }, //0: 用户管理, 1: 终端管理, 2: 终端状态, 3: 考试/地震, 4: 任务, 5: 分组管理
    终端显示接口: { type: String, required: false, default: '/broadcast/termInfo/list' },
    分组显示接口: { type: String, required: false, default: '/broadcast/group/show' },
    分组列表接口: { type: String, required: false, default: '/broadcast/group/groupList' },
    设备id列表: { type: Array, required: false, default: [] }
})

const 状态列表 = ref([
    { terminalStatus: 1, terminalStatusName: '在线' },
    { terminalStatus: 2, terminalStatusName: '离线' },
])
const 终端类型 = ref([
    { name: '播音终端', bgcolor: '#BEDBF8', color: '#2875F6' },
    { name: '寻呼话筒', bgcolor: '#BEEBF8', color: '#169CA8' },
    { name: '采集终端', bgcolor: '#E5E6D5', color: '#84925B' },
    { name: '对讲主机', bgcolor: '#F2DAE4', color: '#D76D7E' },
    { name: '对讲面板', bgcolor: '#F2E5DA', color: '#D76D7E' },
    { name: '服务器声卡', bgcolor: '#E5E6D5', color: '#84925B' },
    { name: '本地声卡', bgcolor: '#F2DAE4', color: '#D76D7E' },
    { name: '报警终端', bgcolor: '#F2E5DA', color: '#D76D7E' }
])
const 终端名称 = ref()
// const 选中的设备Id = ref(props.设备id列表);
const 终端分组列表 = ref([])
const 分组下拉选项 = ref([])
const 分组 = ref(null)
const 状态 = ref(null)

const 模糊搜索终端名称 = async () => {
    await getTerminalList()
    if (终端名称.value) {
        终端列表.value = 终端列表.value.filter(item =>
            item.termName.toLowerCase().includes(终端名称.value.toLowerCase())
        )
    } else {
        await getTerminalList()
    }
}

const 终端列表 = ref([])
const getTerminalList = async () => {
    await 请求接口(props.终端显示接口, 'get', { type: props.业务类型 }).then(data => {
        if (props.设备id列表.length !== 0) {
            终端列表.value = data.filter(item => props.设备id列表?.includes(item.id))
        } else {
            终端列表.value = []
        }
    })
}

const getTerminalGroupList = async () => {
    await 请求接口('/broadcast/group/groupList', 'get').then(data => {
        终端分组列表.value = data
        分组下拉选项.value = data.map(item => {
            return {
                label: item.groupName,
                value: item.id
            }
        })
    })
}

const 统一筛选 = async () => {
    await getTerminalList();
    let filteredList = 终端列表.value;

    // 根据分组筛选
    if (分组.value) {
        filteredList = filteredList.filter(item => {
            return 终端分组列表.value.some(item2 => {
                return item2.id == 分组.value && item2.deviceIdList.includes(item.id);
            });
        });
    }

    // 根据状态筛选
    if (状态.value) {
        filteredList = filteredList.filter(item => item.status == 状态.value);
    }

    终端列表.value = filteredList;
}

const 筛选分组 = async () => {
    await 统一筛选();
}

const 筛选状态 = async () => {
    await 统一筛选();
}
watch(() => props.设备id列表, async val => {
    //查询val数组中与终端列表中id相同的数据
    await getTerminalList()
    // console.log(终端列表.value);
}, {
    deep: true,
    immediate: true
})
onMounted(async () => {
    await getTerminalList()
    await getTerminalGroupList()
})
</script>
<style lang="scss" scoped>
@import '@/通用样式/style1.css';

.header {
    display: flex;
    justify-content: space-between;
    padding: 10rem 25rem;

    width: 100%;


    .var-select {
        width: 200rem;

        :deep(.var-field-decorator__placeholder .var--ellipsis .var-field-decorator--hint-center .var-field-decorator--placeholder-hint) {
            display: none;
        }

        :deep(.var-select__select) {
            background: #FFFFFF;
            border-radius: 39rem;
        }

        :deep(.var-select__label) {
            font-family: Microsoft YaHei;
            font-weight: 400;
            font-size: 24rem;
            color: #35393D;
            width: 100rem;
            padding-left: 25rem;

            span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .var-input {
        width: 249rem;
        height: 49rem;

        :deep(.var-input__input) {
            background: #FFFFFF;
            border-radius: 24rem;
            border: 1rem solid #B6BECD;
            font-family: Microsoft YaHei;
            font-weight: 400;
            font-size: 24rem;
            padding: 0 20rem;
            color: #35393D;
        }

    }

    :deep(.var-field-decorator__line) {
        display: none;
    }
}

.body {
    display: flex;
    align-items: center;
    gap: 10rem;
    flex-direction: column;
    overflow: scroll;
    // align-items: flex-start;
    height: 100%;

    .card {
        width: 682rem;
        height: 136rem;
        // background: red;
        display: flex;
        background: #FFFFFF;
        box-shadow: 0rem 2rem 6rem 0rem rgba(100, 104, 113, 0.24);
        border-radius: 8rem;
        border: 1rem solid #B3CCE3;

        .left {
            width: 143rem;
            height: 134rem;
            background: #fff;
            border-radius: 8rem;

            img {
                width: 150rem;
                height: 150rem;
            }
        }

        .right {
            width: 538rem;
            height: 134rem;
            background-image: url(/图片资源/终端背景.png);
            background-size: 100% 100%;
            display: grid;
            gap: 20rem 0;

            .rowLayout {
                width: 538rem;
                justify-content: space-between;
                padding: 0 32rem;
            }

            .terminal-name {
                font-family: Microsoft YaHei;
                font-weight: 400;
                font-size: 26rem;
                color: #35393D;

            }

            .terminal-status {
                display: flex;
                align-items: center;
                gap: 0 10rem;
                width: 136rem;
                height: 44rem;
                justify-content: center;
                font-family: Microsoft YaHei;
                font-weight: 400;
                font-size: 20rem;
            }

            .terminal-ip {
                font-family: Microsoft YaHei;
                font-weight: 400;
                font-size: 20rem;
                color: #697077;

                img {
                    width: 20rem;
                    height: 17rem;
                }
            }

            .terminal-type {
                font-family: Microsoft YaHei;
                font-weight: 400;
                font-size: 20rem;
                display: flex;
                align-items: center;
                gap: 0 10rem;
                width: 136rem;
                height: 44rem;
                justify-content: center;
                border-radius: 22rem;

                img {
                    width: 19rem;
                    height: 20rem;
                }
            }
        }
    }
}

.empty {
    font-size: 26rem;
    margin-top: 100rem;
}
</style>