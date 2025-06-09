<template>
	<!-- 粘性布局，包含两个按钮和一个输入框 -->
	<var-sticky>
		<!-- 分组显示按钮，点击切换显示类型 -->
		<var-button @click="handleDisplayTypeChange(0)" :style="{
			background: displayType === 0 ? '#218DF9' : '#fff',
			color: displayType === 0 ? '#fff' : '#919BA7',
		}">
			分组显示
		</var-button>
		<!-- 终端显示按钮，点击切换显示类型 -->
		<var-button @click="handleDisplayTypeChange(1)" :style="{
			background: displayType === 1 ? '#218DF9' : '#fff',
			color: displayType === 1 ? '#fff' : '#919BA7',
		}">
			终端显示
		</var-button>
		<!-- 输入框 -->
		<var-input v-model="searchKeyword"></var-input>
	</var-sticky>

	<!-- 折叠面板 -->
	<var-collapse v-model="value">
		<!-- 已选终端折叠项 -->
		<var-collapse-item title="已选终端" name="1">
			<!-- 自定义折叠项图标，添加清空按钮 -->
			<template #icon>
				<var-button type="primary" @click.stop="clearSelectedList">清空</var-button>
			</template>
			<!-- 已选终端列表 -->
			<div class="term-list">
				<div v-if="selectedTerminalList.length === 0">
					未选择终端
				</div>
				<template v-else>
					<div class="term-card" v-for="item in selectedTerminalList" :key="item.id">
						{{ item.termName }}
						<!-- 单选框，点击移除终端 -->
						<var-radio @click.stop="removeTerminal(item)" v-model="item.selected"></var-radio>
					</div>
				</template>

			</div>
		</var-collapse-item>
		<!-- 未选终端折叠项（终端显示模式） -->
		<var-collapse-item v-if="displayType === 1" title="未选终端" name="2">
			<div class="term-list">
				<div v-if="terminalGroupList.length === 0">
					无终端设备
				</div>
				<template v-else>
					<div class="term-card" v-for="item in filteredTerminalList" :key="item.id">
						{{ item.termName }}
						<!-- 单选框，选择或取消选择终端 -->
						<var-radio v-model="item.selected" @change="(val) => selectDevice(item, val)"></var-radio>
					</div>
				</template>

			</div>
		</var-collapse-item>
		<!-- 未选终端折叠项（分组显示模式） -->
		<var-collapse-item v-if="displayType === 0" title="未选终端" name="3">
			<var-collapse v-model="value2">
				<!-- 循环渲染分组列表 -->
				<var-collapse-item v-for="item in terminalGroupList" :key="item.id" :title="item.groupName"
					:name="item.groupName">
					<template #title>
						<var-radio v-model="item.selected" @click.stop
							@change="(val) => handleGroupSelection(item, val)"></var-radio>
						<!-- {{ item.selected }} -->
						<span>{{ item.groupName }}</span>
					</template>
					<div class="term-list">
						<div class="term-card" v-for="item2 in filteredGroupTerminalList(item)" :key="item2.id">
							{{ item2.termName }}
							<!-- 单选框，选择或取消选择终端 -->
							<var-radio v-model="item2.selected" @change="(val) => selectDevice(item2, val)"></var-radio>
						</div>
					</div>
				</var-collapse-item>
			</var-collapse>
		</var-collapse-item>
	</var-collapse>
</template>

<script setup>
import { nextTick, onMounted, ref, watch, computed } from 'vue';
// 引入请求接口和消息提示方法
import { 请求接口, 消息 } from '../常用方法.js';

// 定义组件接收的属性
const props = defineProps({
	业务类型: { type: Number, required: true, default: 4 }, //0: 用户管理, 1: 终端管理, 2: 终端状态, 3: 考试/地震, 4: 任务, 5: 分组管理
	终端显示接口: { type: String, required: false, default: '/broadcast/termInfo/list' },
	分组显示接口: { type: String, required: false, default: '/broadcast/group/show' },
	分组列表接口: { type: String, required: false, default: '/broadcast/group/groupList' },
	设备id列表: { type: Array, default: () => [] },
});

// 显示类型，0表示分组显示，1表示终端显示
const displayType = ref(1);
// 折叠面板展开项的值
const value = ref(['1', '2', '3']);
const value2 = ref([]);
// 已选终端列表
const selectedTerminalList = ref([]);
// 终端列表
const terminalList = ref([]);
// 终端分组列表
const terminalGroupList = ref([]);
const emit = defineEmits(['设备id列表更改']);
const searchKeyword = ref('');

// 搜索框输入时，根据输入的关键字过滤终端列表
const filteredTerminalList = computed(() => {
	if (!searchKeyword.value) {
		return terminalList.value;
	}
	const keyword = searchKeyword.value.toLowerCase();
	return terminalList.value.filter((item) => item.termName.toLowerCase().includes(keyword));
});
const filteredGroupTerminalList = computed(() => {
	return (group) => {
		if (!searchKeyword.value) {
			return group.deviceList;
		}
		const keyword = searchKeyword.value.toLowerCase();
		return group.deviceList.filter((item) => item.termName.toLowerCase().includes(keyword));
	};
});

const handleGroupSelection = (group, val) => {
	// 遍历该分组下的所有设备，并设置其选中状态
	group.deviceList.forEach((device) => {
		device.selected = val;
		// 调用 selectDevice 方法，同步更新已选列表
		selectDevice(device, val);
	});
};
// 获取终端列表
const getTerminalList = async () => {
	await 请求接口(props.终端显示接口, 'get', { type: props.业务类型 }).then(data => {
		terminalList.value = data;
		if (props.设备id列表.length > 0) {
			// 筛选出已选终端
			selectedTerminalList.value = data.filter((item) => props.设备id列表.includes(item.id));
			// 设置已选终端的选中状态
			selectedTerminalList.value.forEach((item) => (item.selected = true));
			terminalList.value.forEach((item) => {
				if (props.设备id列表.includes(item.id)) {
					item.selected = true;
				}
			});
		}
	});

};

// 获取终端分组列表
const getTerminalGroupList = async () => {
	await 请求接口(props.分组显示接口, 'get', { type: props.业务类型 }).then(data => {
		terminalGroupList.value = data.map((item) => ({
			...item,
			selected: false, // 默认未选中
		}));

		if (props.设备id列表.length > 0) {
			// 设置分组内已选终端的选中状态
			terminalGroupList.value = data.map((item) => {
				// console.log(item.deviceList);
				item.deviceList.forEach((item2) => {
					if (props.设备id列表.includes(item2.id)) {
						item2.selected = true;
					}
				});
				// 检查分组下的设备是否全部为选中状态
				if (item.deviceList.length !== 0) {
					const allDevicesSelected = item.deviceList.every((device) => device.selected);
					item.selected = allDevicesSelected;
				}
				return item;
			});
		} else {
			terminalGroupList.value = data;
		}
	})
};

// 选择设备
const selectDevice = (n, val) => {
	if (val) {
		// 选中时添加到已选列表
		if (!selectedTerminalList.value.find((item) => item.id === n.id)) {
			selectedTerminalList.value.push(n);
		}
	} else {
		// 取消选中时从已选列表移除
		selectedTerminalList.value = selectedTerminalList.value.filter((item) => item.id !== n.id);
		// 同步更新分组列表和终端列表的选中状态
		terminalGroupList.value.forEach((item) => {
			item.deviceList.forEach((item2) => {
				if (item2.id === n.id) {
					item2.selected = false;
				}
			});
		});
		terminalList.value.forEach((item) => {
			if (item.id === n.id) {
				item.selected = false;
			}
		});
	}
};

// 移除终端
const removeTerminal = (item) => {
	// 从已选列表移除终端
	selectedTerminalList.value = selectedTerminalList.value.filter((term) => term.id !== item.id);
	// 同步更新分组列表和终端列表的选中状态
	terminalList.value.forEach((term) => {
		if (term.id === item.id) {
			term.selected = false;
		}
	});
	terminalGroupList.value.forEach((group) => {
		group.deviceList.forEach((item2) => {
			if (item2.id === item.id) {
				item2.selected = false;
			}
		});
	});
};

// 处理显示类型切换
const handleDisplayTypeChange = (type) => {
	displayType.value = type;
	nextTick(() => {
		// 根据显示类型更新折叠面板展开项
		if (type === 0) {
			value.value = ['1', '3'];
		} else {
			value.value = ['1', '2'];
		}
	});
};

// 清空已选列表
const clearSelectedList = () => {
	selectedTerminalList.value = [];
	// 同步更新分组列表和终端列表的选中状态
	terminalList.value.forEach((item) => {
		item.selected = false;
	});
	terminalGroupList.value.forEach((item) => {
		item.deviceList.forEach((item2) => {
			item2.selected = false;
		});
	});
};

// 监听已选终端列表的变化，同步更新分组列表和终端列表的选中状态
watch(
	() => selectedTerminalList.value,
	(val) => {
		val.forEach((item) => {
			terminalList.value.forEach((term) => {
				if (term.id === item.id) {
					term.selected = true;
				}
			});
			terminalGroupList.value.forEach((group) => {
				group.deviceList.forEach((item2) => {
					if (item2.id === item.id) {
						item2.selected = true;
					}
				});
			});
		});
		const deviceList = val.map((item) => item.id);
		emit('设备id列表更改', deviceList);
	},
	{
		deep: true,
		// immediate: true
	}
);

// 监听搜索关键字的变化
watch(
	() => searchKeyword.value,
	(newVal) => {
		if (newVal) {
			// 遍历分组列表，检查是否有匹配的终端
			const expandedGroups = terminalGroupList.value
				.filter((group) => {
					return group.deviceList.some((item) => item.termName.toLowerCase().includes(newVal.toLowerCase()));
				})
				.map((group) => group.groupName);

			// 更新折叠面板的展开项
			value2.value = [...expandedGroups];
		} else {
			// 如果没有搜索关键字，恢复默认展开项
			value2.value = [];
		}
	}
);

// 组件挂载时获取终端列表和终端分组列表
onMounted(async () => {
	await getTerminalList();
	await getTerminalGroupList();
});
</script>

<style lang="scss" scoped>
@import '@/通用样式/style1.css';

:deep(.var-sticky__wrapper) {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	gap: 45rem;

	button {
		width: 146rem;
		height: 52rem;
		border-radius: 26rem;
		border: 1rem solid #bec6d3;
	}

	.var-input__input {
		// margin-top: -30rem;
		width: 249rem;
		height: 49rem;
		background: #ffffff;
		border-radius: 24rem;
		border: 1rem solid #b6becd;
	}
}

.term-list {
	width: 100%;
	height: 350rem;
	display: grid;
	grid-template-rows: max-content max-content;
	grid-template-columns: 1fr 1fr;
	gap: 10rem;
	overflow: auto;

	.term-card {
		width: 100%;
		height: 100rem;
		background-image: url(/图片资源/终端选择卡片.png);
		background-size: 100% 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 25rem;
	}
}
</style>
