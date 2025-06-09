<template>
	<div class="遮罩 center" v-if="显示弹窗">
		<var-loading v-show="加载" />
		<div class="dialog" v-show="!加载">
			<div class="dialog_body">
				<var-breadcrumbs>
					<var-breadcrumb @click="handleBack(item)" v-for="item in 文件层级列表" :key="item.level">{{ item.name
					}}</var-breadcrumb>
				</var-breadcrumbs>
				<div v-if="列表.subCatalogueVOs?.length == 0 && 列表.docFileInfoVOS?.length == 0">
					<img style="width: 100%;height:100%;" src="/图片资源/空列表.png" alt="">
				</div>
				<div class="row" v-for="item in 列表.subCatalogueVOs" :key="item.id">
					<var-radio @click="handleClick(0, item)"></var-radio>
					<img src="/图片资源/文件夹.png" alt="">
					{{ item.catalogueName }}
				</div>
				<div class="row" v-for="item in 列表.docFileInfoVOS" :key="item.id">
					<var-radio v-model="item.selected" @change="handleClick(1, item)"></var-radio>
					<img src="/图片资源/音频2.png" alt="">
					{{ item.fileName }}
				</div>
			</div>

			<div class="dialog_foot">
				<var-button @click="handleCancel()" class="cancel_btn color4">取消</var-button>
				<var-button @click="
					{
					emit('选中的文件', 选中文件);
					显示弹窗 = false;
				}
					" class="confirm_btn color1" style="margin-right: 20px">确定</var-button>
			</div>
		</div>
	</div>

</template>

<script setup>
import { nextTick, onMounted, ref, toRaw, watch } from 'vue';
import { 提示框, 消息, 请求接口 } from '@/常用方法.js';
import uuid from '@/utils/唯一id/uuid.js';
// import filePreview from '@/components/文件预览组件/文件预览.vue';

const 加载 = ref(false)
const 文件层级列表 = ref([{ name: '首页', level: 0 }])
const 列表 = ref([])
const prop = defineProps({
	显示组件: { type: Boolean, default: false, required: false },
	筛选文件: { type: Number, default: null, required: false }, //文档: 1, 视频: 2, 音频: 3, 图片: 4, 其他: 5
});
const 选中文件 = ref([])
const emit = defineEmits(['选中的文件', '弹窗对象']);

const 显示弹窗 = ref(prop.显示组件)
watch(() => prop.显示组件, (newValue, oldValue) => {
	显示弹窗.value = newValue;
	emit('弹窗对象', 显示弹窗);
});

async function handleBack(item) {
	// console.log(item.level)
	文件层级列表.value = 文件层级列表.value.slice(0, item.level + 1)
	await 获取列表(item.id);
}
async function handleClick(index, item) {
	switch (index) {
		case 0:
			文件层级列表.value.push({ id: item.id, name: item.catalogueName, level: item.level })
			await 获取列表(item.id);
			break;
		case 1:
			// console.log(item.selected)
			if (!item.selected) {
				选中文件.value.push(item)
			}
			break;
	}
}

async function handleCancel() {
	显示弹窗.value = false;
	await 获取列表()
	文件层级列表.value = [{ name: '首页', level: 0 }]

}
const 获取列表 = async (catalogueId) => {
	加载.value = true;
	let url = '';
	url =
		catalogueId == undefined
			? `/mediaInfo/queryMediaByCatalogueId/newPlatform?fileType=${prop.筛选文件}`
			: `/mediaInfo/queryMediaByCatalogueId/newPlatform?catalogueId=${catalogueId}&fileType=${prop.筛选文件}`;
	await 请求接口(url, 'get').then(data => {
		列表.value = data
		列表.value.docFileInfoVOS = 列表.value.docFileInfoVOS.map(item => {
			item.selected = false
			item.uuid = uuid(8, 16)
			return item
		})
		// console.log(列表.value)
	}).finally(() => {
		加载.value = false;
	});
}

onMounted(() => {
	获取列表();
});
</script>

<style lang="scss" scoped>
.dialog {
	width: 651rem;
	height: 1039rem;
	background: #FFFFFF;
	border-radius: 16rem;
	border: 1rem solid #C0DAF7;
}

.dialog_body {
	width: 100%;
	height: 90%;
	overflow: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 25rem;
	gap: 25rem;

	.row {
		width: 587rem;
		height: 75rem;
		background: #FFFFFF;
		box-shadow: 0rem 2rem 6rem 0rem rgba(100, 104, 113, 0.24);
		border-radius: 12rem;
		border: 1rem solid #D4E1EA;
		display: flex;
		align-items: center;
		gap: 10rem;
		// justify-content: space-between;
		padding: 0 25rem;
	}
}

.dialog_foot {
	// direction: rtl;
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 10%;

	button {
		width: 180rem;
		height: 74rem;
		border: 0;
		color: #fff;
		border-radius: 38rem;
		font-size: 30rem;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		// font-size: 30rem;
	}

	.color1 {
		background: linear-gradient(0deg, rgba(19, 104, 233, 0.99), rgba(61, 149, 238, 0.99));
	}

	.color2 {
		background: linear-gradient(0deg, #AA9537, #CBAF6D);
	}

	.color3 {
		background: linear-gradient(0deg, #CE5656, #E56177);
	}

	.color4 {
		background: linear-gradient(0deg, rgba(108, 134, 174, 0.99), rgba(141, 173, 205, 0.99));
	}
}
</style>
