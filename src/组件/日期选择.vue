<template>
    <div class="time-container">
        <div class="time-select" v-for="(item, index) in props.data" :key="index">
            <var-input :placeholder='`请选择${item.name}`' :readonly="true" :rules="v => !!v || `${item.name}不能为空`"
                v-model="item.date" @click="handleInputClick(index)" />
        </div>
        <var-overlay v-model:show="show">
            <div class="overlay-content">
                <var-date-picker type="date" v-if="action" v-model="date" @change="handleDateChange" />
            </div>

        </var-overlay>
    </div>


</template>

<script setup>
import { reactive, ref, watch } from 'vue'

// 父组件传入数据
// const dateList = ref([
//     { name: '开始日期', date: null, select: false },
//     { name: '结束日期', date: null, select: false },
// ])


const props = defineProps({
    data: { type: Array, default: () => [] },
})
const show = ref(false)
const action = ref(false)
const date = ref()
const currentIndex = ref(null)

const handleInputClick = (index) => {
    currentIndex.value = index
    action.value = true
    show.value = true
}

const handleDateChange = (val) => {
    if (currentIndex.value !== null) {
        props.data[currentIndex.value].date = val
    }
    action.value = false
    show.value = false
}
</script>

<style lang="scss" scoped>
.time-container {
    width: 100%;
    display: flex;
    gap: 10rem;
    align-items: center;
    justify-content: space-between;

    :deep(.var-input) {
        width: 310rem;
    }
}

.overlay-content {
    padding: 24px;
    width: 312px;
    border-radius: 28px;
}
</style>