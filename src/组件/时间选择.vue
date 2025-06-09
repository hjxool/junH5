<template>
    <var-input :placeholder='`${props.placeholder}`' :readonly="true" :rules="v => !!v || `开始时间不能为空`" v-model="time"
        @click="picker" />
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Picker, Snackbar } from '@varlet/ui'
import { timeToSeconds, secondsToTime } from '../Api/时间格式转化'

const props = defineProps({
    // props选项
    data: { type: String, required: false, default: null },
    placeholder: { type: String, required: false, default: '' },
})
const emit = defineEmits(['selectTime'])
const time = ref(props.data)
watch(() => props.data, (newValue) => {
    // console.log(time.value);
    time.value = newValue
    emit('selectTime', time.value);
})
async function picker() {
    const { state, values, indexes, options } = await Picker({
        columns: [
            Array.from({ length: 24 }, (_, index) => ({ text: index.toString() })),
            Array.from({ length: 60 }, (_, index) => ({ text: index.toString() })),
            Array.from({ length: 60 }, (_, index) => ({ text: index.toString() })),
        ],
        onChange(values, indexes) {
            const newTime = values.map(item => {
                return item.toString().padStart(2, '0');
            }).join(':');
            time.value = newTime
            emit('selectTime', newTime);
        },
    })
}

</script>

<style lang="scss" scoped>
.time-picker-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 5%;
    width: 80%;
    left: 10%;
    z-index: 10000;
    // justify-content: flex-end;
    // align-items: flex-end;
    // margin-top: 10px; // 根据需要调整间距
}
</style>