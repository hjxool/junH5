<template>
    <div style="width:100%;height:100%;background:rgba(0,0,0,0.6); position: absolute;z-index: 999;padding-top:30%"
        v-if="loading">
        <var-loading description="答题结束，自动跳转！" color="white" :loading="loading">
            1111
        </var-loading>
    </div>
    <div class="box">
        <div class="info">
            <h2>{{ 试题.name }}</h2>
            <!-- <p>参测人员: {{ 试题.userName }}</p> -->
            <p>开始时间: {{ 试题.startTime }}</p>
            <p>结束时间: {{ 试题.endTime }}</p>
            <p>时长要求: {{ 试题.duration }} 分钟</p>
            <p v-if="试题.status !== 2">倒计时: {{ formatTime(倒计时) }}</p>
            <div class="img"
                :class="{ 'active-status': 试题.status === 1, 'inactive-status': 试题.status === 0, 'end-status': 试题.status === 2 }">
            </div>
        </div>
        <div v-if="currentQuestion" class="question-container">
            <h3>{{ 试题类型[currentQuestion.type] }}</h3>
            <h3 style="position:absolute;top:0;right:58rem">{{ currentQuestionIndex + 1 }}/{{ questionCount }} </h3> 
            <h3>{{ currentQuestion.name }}</h3>

            <template v-if="试题.status !== 2">
                <!-- 单选题 -->
                <div v-if="currentQuestion.type === 0" class="option-group">
                    <div class="option" v-for="option in currentQuestion.optionVOList" :key="option.id"
                        @click=" handleOptionClick(option, 0)">
                        <input type="radio" :name="`question-${currentQuestion.id}`" :value="option.optionValue"
                            :checked="getSingleAnswerValue === option.optionValue"
                            @change="selectSingleAnswer(option.optionValue, option.optionNumberId)" />
                        {{ option.optionValue }} <!-- 选项文本 -->
                    </div>
                </div>

                <!-- 多选题 -->
                <div v-if="currentQuestion.type === 1" class="option-group">
                    <div class="option" v-for="option in currentQuestion.optionVOList" :key="option.id"
                        @click="handleOptionClick(option, 1)">
                        <input :disabled="试题.status === 2" type="checkbox" :value="option.optionValue"
                            :checked="getMultiAnswerValues.includes(option.optionValue)"
                            @change="toggleMultiAnswer(option)" />
                        {{ option.optionValue }} <!-- 选项文本 -->
                    </div>
                </div>

                <!-- 判断题（与单选题逻辑类似，使用radio） -->
                <div v-if="currentQuestion.type === 2" class="option-group">
                    <div class="option" v-for="option in currentQuestion.optionVOList" :key="option.id"
                        @click="handleOptionClick(option, 2)">
                        <input :disabled="试题.status === 2" type="radio" :name="`question-${currentQuestion.id}`"
                            :value="option.optionValue" :checked="getJudgeAnswerValue === option.optionValue"
                            @change="selectJudgeAnswer(option.optionValue, option.optionNumberId)" />
                        {{ option.optionValue }} <!-- 选项文本 -->
                    </div>
                </div>

                <!-- 填空题 -->
                <div v-if="currentQuestion.type === 3" class="blank-group">
                    <div class="blank" v-for="(blank, index) in currentQuestion.blankQuestionScoreVOList"
                        :key="blank.id || index">
                        <input :disabled="试题.status == 2" type="text" class="option"
                            v-model="getBlankAnswerValues[index]" @change="updateBlankAnswer(index)" />
                    </div>
                </div>
                <div v-if="currentQuestion.type === 4" class="blank-group">
                    <div class="blank" v-for="(blank, index) in currentQuestion.optionVOList" :key="blank.id || index">
                        <input :disabled="试题.status == 2" type="text" class="option"
                            v-model="getBlankAnswerValues[index]" @change="updateBlankAnswer(index)" />
                    </div>
                </div>
            </template>
            <!-- 已完成或已结束 -->
            <template v-if="试题.status === 2 || 试题.completed">
                <!-- 单选题 -->
                <div v-if="currentQuestion.type === 0" class="option-group">
                    <div class="option" v-for="option in currentQuestion.optionVOList" :key="option.id">
                        <input disabled type="radio" :name="`question-${currentQuestion.id}`"
                            :value="option.optionValue" :checked="option.checked" />
                        <div style="width: 100%;display:flex;justify-content:space-between;">
                            {{ option.optionValue }}
                            <div v-if="currentQuestion.rightAnswer.includes(option.optionNumberId.toString())">
                                <var-icon name="checkbox-marked-circle" color="green" />答案
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 多选题 -->
                <div v-if="currentQuestion.type === 1" class="option-group">
                    <div class="option" v-for="option in currentQuestion.optionVOList" :key="option.id">
                        <input disabled type="checkbox" :value="option.optionValue" :checked="option.checked" />
                        <div style="width: 100%;display:flex;justify-content:space-between;">
                            {{ option.optionValue }}
                            <div v-if="currentQuestion.rightAnswer.includes(option.optionNumberId.toString())">
                                <var-icon name="checkbox-marked-circle" color="green" />答案
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 判断题 -->
                <div v-if="currentQuestion.type === 2" class="option-group">
                    <div class="option" v-for="option in currentQuestion.optionVOList" :key="option.id">
                        <input disabled type="radio" :name="`question-${currentQuestion.id}`"
                            :value="option.optionValue" :checked="option.checked" />
                        <div style="width: 100%;display:flex;justify-content:space-between;">
                            {{ option.optionValue }}
                            <div v-if="currentQuestion.rightAnswer.includes(option.optionNumberId.toString())">
                                <var-icon name="checkbox-marked-circle" color="green" />答案
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 填空题 -->
                <div v-if="currentQuestion.type === 3" class="blank-group">
                    <div class="blank" v-for="(blank, index) in currentQuestion.blankQuestionScoreVOList"
                        :key="blank.id || index">
                        <input disabled type="text" class="option" v-model="getUserBlankAnswer" />
                        <div v-if="试题.completed" class="关键词解析">关键词解析：
                            <div class="关键词" v-for="(keyword, index) in currentQuestion.blankQuestionScoreVOList"
                                :key="index">
                                第{{ index + 1 }}空： {{ keyword.rightAnswers }}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 问答题 -->
                <div v-if="currentQuestion.type === 4" class="blank-group">
                    <div class="blank" v-for="(blank, index) in currentQuestion.optionVOList" :key="blank.id || index">
                        <input disabled type="text" class="option" v-model="getUserBlankAnswer" />
                    </div>
                </div>
            </template>
        </div>
        <div style="display: flex;gap:20rem;">
            <button v-if="currentQuestionIndex > 0" @click="prevQuestion">上一题</button>
            <button v-if="currentQuestionIndex < questionCount - 1" @click="nextQuestion">下一题</button>
            <button v-if="currentQuestionIndex === questionCount - 1 && 试题.status !== 2"
                @click="submitAnswer">提交</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, computed, onUnmounted } from 'vue';
import { 消息, 请求接口, 提示框 } from '@/常用方法.js';

const props = defineProps({
    试题: { type: Object, default: () => ({}) }
});
const loading = ref(false);
// 参测人员、时间等数据
const questionCount = ref(0);
const currentQuestionIndex = ref(0);
const questions = ref([]);
const 答案列表 = ref([]); // 使用对象结构存储所有题目答案
const 倒计时 = ref()
const timer = ref(null);

const currentQuestion = ref(null);
const 试题类型 = ['单选题', '多选题', '判断题', '填空题', '问答题'];

// 统一答案格式处理
const getAnswerObject = (questionId) => {
    return 答案列表.value[currentQuestionIndex.value] || {
        questionId: questionId,
        questionnaireId: props.试题.id,
        bizUserAnswers: [],
        // rightAnswers: currentQuestion.value?.rightAnswer || ''
    };
};

const emit = defineEmits(['提交答案']);
const setAnswerObject = (questionId, answerObj) => {
    答案列表.value[currentQuestionIndex.value] = answerObj;
};

// 单选题处理
const getSingleAnswerValue = computed(() => {
    const answerObj = getAnswerObject(currentQuestion.value?.id);
    return answerObj.bizUserAnswers[0]?.answerValue || '';
});

// 多选题处理
const getMultiAnswerValues = computed(() => {
    const answerObj = getAnswerObject(currentQuestion.value?.id);
    return answerObj.bizUserAnswers.map(item => item.answerValue) || [];
});

// 判断题处理
const getJudgeAnswerValue = computed(() => {
    const answerObj = getAnswerObject(currentQuestion.value?.id);
    return answerObj.bizUserAnswers[0]?.answerValue || '';
});

// 填空题处理
const getBlankAnswerValues = computed({
    get() {
        const answerObj = getAnswerObject(currentQuestion.value?.id);
        return answerObj.bizUserAnswers.map(item => item.answerValue) || [];
    },
    set(values) {
        const answerObj = getAnswerObject(currentQuestion.value?.id);
        answerObj.bizUserAnswers = values.map((value, index) => ({
            answerValue: value,
            optionNumber: index
        }));
        setAnswerObject(currentQuestion.value?.id, answerObj);
    }
});

//获取用户填空题答案
const getUserBlankAnswer = computed(() => {
    const answerObj = currentQuestion.value;
    // console.log(answerObj);
    return answerObj.userAnswer || '未作答';
});
// 题目导航方法
const prevQuestion = () => {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
        loadCurrentQuestion();
    }
};
// 在脚本中添加通用点击处理函数
const handleOptionClick = (option, type) => {
    const questionId = currentQuestion.value.id;
    switch (type) {
        case 0: // 单选题
            selectSingleAnswer(option.optionValue, option.optionNumberId);
            // 手动触发input的点击事件（确保视觉选中状态同步）
            const radioInput = document.querySelector(`input[name="question-${questionId}"][value="${option.optionValue}"]`);
            radioInput?.click();
            break;
        case 1: // 多选题
            toggleMultiAnswer(option);
            // 手动触发input的点击事件（确保视觉选中状态同步）
            const checkboxInput = document.querySelector(`input[type="checkbox"][value="${option.optionValue}"]`);
            checkboxInput?.click();
            break;
        case 2: // 判断题（同单选题逻辑）
            selectJudgeAnswer(option.optionValue, option.optionNumberId);
            const judgeInput = document.querySelector(`input[name="question-${questionId}"][value="${option.optionValue}"]`);
            judgeInput?.click();
            break;
        default:
            break;
    }
};
const nextQuestion = () => {
    if (currentQuestionIndex.value < questionCount.value - 1) {
        currentQuestionIndex.value++;
        loadCurrentQuestion();
    }
};

const submitAnswer = async () => {
    提示框('确认提交？').then(async (confirm) => {
        // console.log(confirm);
        if (confirm) {
            loading.value = true;
            await 请求接口(`/ktv/answer/h5/save`, 'post', 答案列表.value).then(res => {
                setTimeout(() => {
                    emit('提交答案', true);
                    // console.log('提交成功');
                    loading.value = false;
                }, 1500);
            });
        }
    });
}

const 中途退出 = () => {
    return new Promise(async (resolve) => {
        提示框('确认中途退出？将自动提交答案！').then(async (confirm) => {
            if (confirm) {
                loading.value = true;
                try {
                    await 请求接口(`/ktv/answer/h5/save`, 'post', 答案列表.value);
                    setTimeout(() => {
                        emit('提交答案', true);
                        loading.value = false;
                        resolve(true); // 成功完成并提交
                    }, 1500);
                } catch (error) {
                    loading.value = false;
                    resolve(false); // 处理失败的情况
                }
            } else {
                resolve(false); // 用户取消了操作
            }
        });
    });
}
// 答案选择方法
const selectSingleAnswer = (value, optionNumberId) => {
    const answerObj = getAnswerObject(currentQuestion.value.id);
    answerObj.bizUserAnswers = [
        { answerValue: value, optionNumber: optionNumberId }
    ];
    setAnswerObject(currentQuestion.value.id, answerObj);
    // console.log(answerObj, '单选题答案');
};

const toggleMultiAnswer = (option) => {
    const answerObj = getAnswerObject(currentQuestion.value.id);
    const answers = [...answerObj.bizUserAnswers];
    const index = answers.findIndex(item => item.answerValue === option.optionValue);

    if (index > -1) {
        answers.splice(index, 1);
    } else {
        answers.push({
            answerValue: option.optionValue,
            optionNumber: option.optionNumberId
        });
    }

    answerObj.bizUserAnswers = answers;
    setAnswerObject(currentQuestion.value.id, answerObj);
};

const selectJudgeAnswer = (value, optionNumberId) => {
    const answerObj = getAnswerObject(currentQuestion.value.id);
    answerObj.bizUserAnswers = [
        { answerValue: value, optionNumber: optionNumberId }
    ];
    setAnswerObject(currentQuestion.value.id, answerObj);
};

const updateBlankAnswer = (index) => {
    const answers = [...getBlankAnswerValues.value];
    const answerObj = getAnswerObject(currentQuestion.value.id);

    // 确保数组长度足够
    while (answers.length <= index) {
        answers.push('');
    }

    answerObj.bizUserAnswers = answers.map((value, i) => ({
        answerValue: value,
        optionNumber: i
    }));

    setAnswerObject(currentQuestion.value.id, answerObj);
};

// 加载试题方法
const 查询试题列表 = async () => {
    try {
        const res = await 请求接口(`/ktv/question/list`, { questionnaireId: props.试题.id });
        questions.value = res.data || [];
        questionCount.value = res.total || 0;

        if (questions.value.length > 0) {
            loadCurrentQuestion();
        }
    } catch (error) {
        // 消息.error('加载试题失败');
        console.error('查询试题列表出错:', error);
    }
};

const loadCurrentQuestion = async () => {
    if (questions.value.length === 0) return;

    const questionId = questions.value[currentQuestionIndex.value].id;
    try {
        const res = await 请求接口(`/ktv/question/getQuestionById/${questionId}`);
        currentQuestion.value = res;
        if (!答案列表.value[currentQuestionIndex.value]) {
            答案列表.value[currentQuestionIndex.value] = {
                questionId: questionId,
                questionnaireId: props.试题.id,
                bizUserAnswers: []
            };
        }
        // console.log(答案列表.value, '当前题目');
    } catch (error) {
        // 消息.error('加载题目详情失败');
        console.error('查询试题详情出错:', error);
    }
};


// 修改倒计时计算
// 添加倒计时格式化函数
const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// 添加倒计时计算
const startCountdown = () => {
    if (props.试题.endTime && props.试题.startTime) {
        // 清除已有定时器
        if (timer.value) {
            clearInterval(timer.value);
        }

        timer.value = setInterval(() => {
            if (倒计时.value > 0) {
                倒计时.value--;
                // console.log('倒计时:', 倒计时.value);
            } else {
                clearInterval(timer.value);
                submitAnswer();
            }
        }, 1000);
    }
};

// 监听props变化，加载试题
watch(() => props.试题, async () => {
    if (props.试题.id) {
        await 查询试题列表();
        if (props.试题.status !== 2) {
            startCountdown();
        }
    }
}, { immediate: true });

watch(() => 倒计时.value, (newVal) => {
    // console.log('倒计时变化:', newVal);
    if (newVal && newVal <= 0) {
        submitAnswer();
    }
}, { immediate: true });

defineExpose({
    中途退出
});

onMounted(() => {
    // console.log('组件挂载完成');
    if (props.试题.status !== 2) {
        倒计时.value = props.试题.duration * 60
    }

});
onUnmounted(() => {
    // console.log('组件销毁');
    if (timer.value) {
        clearInterval(timer.value);
    }
});
</script>

<style scoped lang="scss">
/* 样式部分保持不变 */
.box {
    margin-top: 50rem;
    width: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 10rem;
}

.info {
    width: 661rem;
    height: 350rem;
    background: #FFFFFF;
    border-radius: 10rem;
    border: 1rem solid #D2D2D2;
    padding: 0rem 47rem;
    position: relative;

    h2 {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 26rem;
        color: #35393D;
    }

    p {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 22rem;
        color: #7D8996;
    }

    .img {
        top: 30rem;
        right: 30rem;
        position: absolute;
        width: 95rem;
        height: 97rem;
        background-image: none;
        background-size: 100%;

        &.active-status {
            background-image: url('/图片资源/测评进行中.png');
        }

        &.inactive-status {
            background-image: url('/图片资源/测评未进行.png');
        }

        &.end-status {
            background-image: url('/图片资源/测评已结束.png');
        }
    }
}

.question-container {
    position: relative;
    padding: 0rem 46rem;
    width: 661rem;
    height: 657rem;
    background: #FFFFFF;
    border-radius: 10rem;
    border: 1rem solid #D2D2D2;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 26rem;
    color: #35393D;

    .option-group,
    .blank-group {
        margin-top: 26rem;
    }

    .option {
        padding: 29rem 30rem;
        display: flex;
        align-items: center;
        gap: 25rem;
        width: 566rem;
        height: 80rem;
        border-radius: 12rem;
        border: 1rem solid #A4A4A4;
        margin-top: 26rem;
    }

    .blank {
        margin-top: 26rem;
        display: flex;
        flex-direction: column;
        gap: 15rem;

        .关键词解析 {
            font-family: Microsoft YaHei;
            font-weight: 400;
            font-size: 26rem;
            color: red;
            margin-left: 20rem;
            display: flex;
            flex-direction: column;
            gap: 10rem;

            .关键词 {
                color: #A4A4A4;
                margin-top: 5rem;
            }
        }
    }
}

button {
    width: 200rem;
    height: 72rem;
    background: #504648;
    border-radius: 36rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 28rem;
    color: #FFFFFF;
    line-height: 36rem;
    margin-top: 50rem;
}

.var-countdown {
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 22rem;
    color: #7D8996;
}
</style>