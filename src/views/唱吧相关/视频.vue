<template>
	<commonPage>
		<template #header>
			<headStyle :返回事件="backToPre">
				<template #title>{{ 跳转页 }}</template>
				<template #事件>
					<div class="rowLayout">
						<var-icon name="home" size="40rem" color="#fff" @click="backTo" />
					</div>
				</template>
			</headStyle>
		</template>

		<template #body>
			<div>
				<div class="视频 center" :style="全屏()">
					<div class="以中心点旋转" @click="全屏播放条显示()" :style="旋转()">
						<div v-show="视频.首次播放" class="center" style="width: 100%; height: 100%; position: absolute">
							<img @click.stop="控制('开始播放')" src="/图片资源/icon/icon19.png" style="width: 60rem; height: 60rem" />
						</div>
						<video v-show="!视频.首次播放" id="video" :src="视频.url" style="width: 100%; height: 100%; position: absolute"></video>

						<div class="弹幕容器">
							<div class="弹幕" v-for="item in 弹幕" :style="{ top: `${item.top}%`, left: `${item.position}%` }">{{ item.label }}</div>
						</div>
					</div>
				</div>

				<div v-show="!视频.全屏">
					<div class="进度条 rowLayout">
						<div class="时间">{{ 视频.当前时间 }}</div>
						<var-slider
							class="滑块"
							v-model="视频.当前进度_横"
							@change="拖动进度条($event)"
							active-color="#E73E52"
							track-color="#C5C5C5"
							thumb-color="#E73E52"
							track-height="6"
							label-visible="never"
						/>
						<div class="时间">{{ 视频.总时间 }}</div>
					</div>

					<div class="控制条 rowLayout">
						<div class="rowLayout">
							<img v-if="视频.播放" class="button" @click="控制('播放')" src="/图片资源/icon/icon20.png" />
							<img v-if="!视频.播放" class="button" @click="控制('播放')" src="/图片资源/icon/icon21.png" />

							<img v-if="!视频.静音" class="button" @click="控制('静音')" src="/图片资源/icon/icon22.png" />
							<img v-if="视频.静音" class="button" @click="控制('静音')" src="/图片资源/icon/icon23.png" />

							<img class="button" @click="控制('缩放')" src="/图片资源/icon/icon24.png" />

							<img v-if="!视频.收藏" class="button" @click="控制('收藏')" src="/图片资源/icon/icon25.png" />
							<img v-if="视频.收藏" class="button" @click="控制('收藏')" src="/图片资源/icon/icon26.png" />
						</div>

						<!-- <var-button class="按钮" text outline text-color="#E73E52">原唱</var-button> -->
					</div>
				</div>

				<div class="全屏控制条 colLayout" v-show="视频.全屏控制条显示">
					<img class="noShrink" src="/图片资源/icon/icon19.png" style="width: 30rem; height: 30rem" />

					<var-slider
						v-model="视频.当前进度_竖"
						@change="拖动进度条($event)"
						active-color="#C5C5C5"
						track-color="#E73E52"
						thumb-color="#E73E52"
						track-height="6"
						label-visible="never"
						direction="vertical"
						style="height: 50%"
					/>

					<div class="center 文字">
						<div class="旋转">{{ 视频.当前时间 }}/{{ 视频.总时间 }}</div>
					</div>

					<img class="noShrink" @click="控制('缩放')" src="/图片资源/icon/icon24.png" style="width: 60rem; height: 60rem" />
				</div>
			</div>
		</template>
	</commonPage>
</template>

<script setup>
import commonPage from '@/组件/通用页面.vue';
import headStyle from '@/组件/头部样式.vue';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { 静态文件, 修改收藏 } from '@/Api/唱吧.js';

// 属性
const Store = useStore();
const { 跳转, 跳转页, 视频地址, 歌曲id } = defineProps(['跳转', '跳转页', '视频地址', '歌曲id']);
console.log('视频传入', 视频地址, 歌曲id);
const emit = defineEmits(['跳转视频']);
const 视频 = ref({
	// url: 视频地址 ? 静态文件(视频地址) : '',
	url: 静态文件('/song/a15e59cc3d4f9e8caa1d7fce2c142eaf.mp4'),
	当前时间: '00:00:00',
	总时间: '00:00:00',
	当前进度_横: 0, // 百分比
	当前进度_竖: 100, // 百分比 与横向相反
	播放: false,
	静音: false,
	收藏: false,
	全屏: false,
	全屏控制条显示: false,
	首次播放: true,
});

const 弹幕 = ref([]);
let 弹幕计时器 = null;
watch(弹幕, (newValue, oldValue) => {
	if (!oldValue.length && newValue.length) {
		// 从没弹幕到有弹幕 只添加一次计时器
		弹幕计时器 = setInterval(() => {
			// 移动弹幕 并判断哪些弹幕已经超出范围就将其删除
			let list = JSON.parse(JSON.stringify(弹幕.value));
			for (let i = 0; i < list.length; i++) {
				if (list[i].position <= -100) {
					list.splice(i, 1);
					i--;
				} else {
					list[i].position -= list[i].speed;
				}
			}
			弹幕.value = list;
		}, 30);
	} else if (!newValue.length) {
		// 没有弹幕了 就删除计时器
		clearInterval(弹幕计时器);
	}
});
setTimeout(() => {
	弹幕.value = [
		{ label: '111', top: 随机弹幕('top'), position: 100, speed: 随机弹幕('speed', '111') },
		{ label: '222222', top: 随机弹幕('top'), position: 100, speed: 随机弹幕('speed', '222222') },
		{ label: '3333333333按时递交世界第哦啊就是丢i掉', top: 随机弹幕('top'), position: 100, speed: 随机弹幕('speed', '3333333333按时递交世界第哦啊就是丢i掉') },
	];
}, 500);

let video;
onMounted(() => {
	// 获取视频总时长
	video = document.getElementById('video');
	video.onloadedmetadata = () => {
		console.log('视频总时长:', video.duration, '秒');
		视频.value.总时间 = 格式化时间(video.duration);
	};
	video.ontimeupdate = () => {
		console.log('当前播放时间:', video.currentTime, '秒');
		视频.value.当前时间 = 格式化时间(video.currentTime);
		视频.value.当前进度_横 = Math.round((video.currentTime / video.duration) * 100);
		视频.value.当前进度_竖 = 100 - 视频.value.当前进度_横;
	};
});

// 方法
function backTo() {
	Store.commit('setState', {
		key: '路由',
		value: '首页',
	});
}
function backToPre() {
	emit('跳转视频');
}
async function 控制(type) {
	if (!视频.value.url) return;
	switch (type) {
		case '播放':
			视频.value.播放 = !视频.value.播放;
			视频.value.首次播放 && (视频.value.首次播放 = false);
			if (视频.value.播放) {
				video.play();
			} else {
				video.pause();
			}
			break;
		case '静音':
			视频.value.静音 = !视频.value.静音;
			video.muted = 视频.value.静音;
			break;
		case '缩放':
			视频.value.全屏 = !视频.value.全屏;
			if (视频.value.全屏) {
				视频.value.全屏控制条显示 = true;
			} else {
				视频.value.全屏控制条显示 = false;
			}
			break;
		case '收藏':
			视频.value.收藏 = !视频.value.收藏;
			修改收藏(视频.value.收藏 ? '收藏' : '取消', 歌曲id);
			break;
		case '开始播放':
			视频.value.首次播放 = false;
			video.play();
			break;
	}
}
function 旋转() {
	if (视频.value.全屏) {
		return {
			transform: 'rotateZ(90deg)',
			// 旋转90度时 要以父容器高度为width 宽度为height
			width: '100vh',
			height: '100vw',
		};
	} else {
		return {
			width: '100%',
			height: '100%',
		};
	}
}
function 全屏() {
	if (视频.value.全屏) {
		return {
			position: 'fixed',
			height: '100%',
			top: 0,
			zIndex: 100,
		};
	}
}
function 全屏播放条显示() {
	if (视频.value.全屏) {
		视频.value.全屏控制条显示 = !视频.value.全屏控制条显示;
	}
}
function 拖动进度条(value) {
	if (!视频.value.url) {
		视频.value.当前进度_横 = 0;
		视频.value.当前进度_竖 = 100;
		return;
	}
	// 同步横竖值
	if (视频.value.全屏) {
		// 竖
		视频.value.当前进度_横 = 100 - value;
	} else {
		// 横
		视频.value.当前进度_竖 = 100 - value;
	}
	video.currentTime = (视频.value.当前进度_横 / 100) * video.duration;
}
function 随机弹幕(type, args) {
	if (type == 'top') {
		let num = Math.floor(Math.random() * 100);
		if (num > 90) {
			return 随机弹幕(type);
		} else {
			return num;
		}
	} else {
		let 最大速度 = 1; // 最快就是1
		let 影响因子 = 0.01; // 值越大弹幕长度对速度的影响越大
		let 弹幕长度 = args.length;
		// 1是保证分母最小为接近1的数
		let speed = 最大速度 / (1 + 弹幕长度 * 影响因子);
		return Math.round(speed * 10) / 10;
	}
}
function 格式化时间(秒) {
	// padStart是字符串方法 将不足两位的字符补0
	let h = String(Math.floor(秒 / 3600)).padStart(2, '0');
	let m = String(Math.floor((秒 % 3600) / 60)).padStart(2, '0');
	let s = String(Math.floor(秒 % 60)).padStart(2, '0');
	return `${h}:${m}:${s}`;
}
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
:deep(.commonPageBody) {
	overflow: visible !important;
}
:deep(.var-slider__horizontal-thumb-block) {
	width: 40rem;
	height: 40rem;
}
:deep(.var-slider__horizontal-track) {
	border-radius: 40rem;
	overflow: hidden;
}
.视频 {
	width: 100%;
	height: 405rem;
	background: #000;
	position: relative;
	> .以中心点旋转 {
		// 手动控制元素大小 突破父容器大小限制 必须用absolute
		position: absolute;
		> .弹幕容器 {
			position: absolute;
			width: 100%;
			height: 100%;
			font-size: 40rem;
			color: #fff;
			z-index: 100;
			> .弹幕 {
				// 最大top90% 通过Math.floor(Math.random() * 100)获得0~99之间的整数 再过滤掉超过90的数或者超过90就重新生成
				position: absolute;
				white-space: nowrap;
			}
		}
	}
}
.进度条 {
	background: #fff;
	justify-content: center;
	height: 90rem;
	> .时间 {
		font-size: 30rem;
		color: #35393d;
	}
	> .滑块 {
		width: 50%;
		margin: 0 30rem;
	}
}
.控制条 {
	background: #fff;
	justify-content: space-between;
	padding: 0 40rem;
	margin-top: 3rem;
	height: 120rem;
	.button {
		width: 70rem;
		height: 70rem;
		& + .button {
			margin-left: 50rem;
		}
	}
	.按钮 {
		width: 110rem;
		height: 60rem;
		background: none;
	}
}
.全屏控制条 {
	position: fixed;
	z-index: 110;
	width: 20vw;
	height: 100vh;
	top: 0;
	left: 0;
	background: linear-gradient(to right, rgba(50, 50, 50, 0.8), rgba(50, 50, 50, 0.3));
	justify-content: space-evenly;
	align-items: center;
	> .noShrink {
		transform: rotateZ(90deg);
	}
	> .文字 {
		height: 17%;
		position: relative;
		width: 100%;
		> .旋转 {
			font-size: 24rem;
			color: #fff;
			position: absolute;
			transform: rotateZ(90deg);
		}
	}
}
</style>
