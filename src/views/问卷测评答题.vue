<template>
    <div class="box">
        <div class="info">
            <h2>{{ 试题.name }}</h2>
            <p>参测人员: {{ participant }}</p>
            <p>开始时间: {{ 试题.startTime }}</p>
            <p>结束时间: {{ 试题.endTime }}</p>
            <p>时长要求: {{ duration }} 分钟</p>
            <div class="img"
                :class="{ 'active-status': 试题.status === 1, 'inactive-status': 试题.status === 0, 'end-status': 试题.status === 2 }">
            </div>
        </div>
        <div v-if="currentQuestion" class="question-container">
            <h3>{{ 试题类型[currentQuestion.type] }}</h3>
            <h3 style="position:absolute;top:0;right:58rem">{{ currentQuestionIndex + 1 }}/{{ questionCount }} </h3>
            <h3>{{ currentQuestion.name }}</h3>

            <!-- 单选题 -->
            <div v-if="currentQuestion.type === 0" class="option-group">
                <div class="option" v-for="option in currentQuestion.optionVOList" :key="option.id"
                    @click="试题.status !== 2 && handleOptionClick(option, 0)">
                    <input :disabled="试题.status === 2" type="radio" :name="`question-${currentQuestion.id}`"
                        :value="option.optionValue" :checked="getSingleAnswerValue === option.optionValue"
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
                    <input :disabled="试题.status == 2" type="text" class="option" :placeholder="`请填写第${index + 1}个空`"
                        v-model="getBlankAnswerValues[index]" @change="updateBlankAnswer(index)" />
                </div>
            </div>
        </div>
        <div style="display: flex;gap:20rem;">
            <button v-if="currentQuestionIndex > 0" @click="prevQuestion">上一题</button>
            <button v-if="currentQuestionIndex < questionCount - 1" @click="nextQuestion">下一题</button>
            <button v-if="currentQuestionIndex === questionCount - 1" @click="submitAnswer">提交</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { 消息, 请求接口, 提示框 } from '@/常用方法.js';

const props = defineProps({
    试题: { type: Object, default: () => ({}) }
});

// 参测人员、时间等数据
const participant = ref('mc001');
const duration = ref(60);
const questionCount = ref(0);
const currentQuestionIndex = ref(0);
const questions = ref([]);
const 答案列表 = ref({}); // 使用对象结构存储所有题目答案

const currentQuestion = ref(null);
const 试题类型 = ['单选题', '多选题', '判断题', '填空题', '问答题'];

// 统一答案格式处理
const getAnswerObject = (questionId) => {
    return 答案列表.value[currentQuestionIndex.value] || {
        questionId: questionId,
        questionnaireId: props.试题.id,
        bizUserAnswers: [],
        rightAnswers: currentQuestion.value?.rightAnswer || ''
    };
};

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
    try {
        console.log(答案列表.value, '提交答案到后端');

    } catch (error) {
        消息.error('网络错误，请稍后再试');
        console.error('提交答案出错:', error);
    }
};

// 答案选择方法
const selectSingleAnswer = (value, optionNumberId) => {
    const answerObj = getAnswerObject(currentQuestion.value.id);
    answerObj.bizUserAnswers = [
        { answerValue: value },
        { optionNumber: optionNumberId }
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
        { answerValue: value },
        { optionNumber: optionNumberId }
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
        消息.error('加载试题失败');
        console.error('查询试题列表出错:', error);
    }
};

const loadCurrentQuestion = async () => {
    if (questions.value.length === 0) return;

    const questionId = questions.value[currentQuestionIndex.value].id;
    try {
        const res = await 请求接口(`/ktv/question/getQuestionById/${questionId}`);
        currentQuestion.value = res;

        // 初始化当前题目的答案存储
        if (!答案列表.value[currentQuestionIndex.value]) {
            const answerObj = {
                questionId: questionId,
                questionnaireId: props.试题.id,
                bizUserAnswers: [],
                rightAnswers: currentQuestion.value.rightAnswer
            };

            if (currentQuestion.value.type === 3) { // 填空题
                // 为每个空初始化答案
                answerObj.bizUserAnswers = currentQuestion.value.blankQuestionScoreVOList.map((_, index) => ({
                    answerValue: '',
                    optionNumber: index
                }));
            }

            答案列表.value[currentQuestionIndex.value] = answerObj;
        }
    } catch (error) {
        消息.error('加载题目详情失败');
        console.error('查询试题详情出错:', error);
    }
};

// 监听props变化，加载试题
watch(() => props.试题, async () => {
    if (props.试题.id) {
        await 查询试题列表();
    }
}, { immediate: true });
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
    height: 281rem;
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
</style>