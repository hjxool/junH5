<template>
	<div class="遮罩 colLayout">
		<div class="flexGrow" @click="$emit('show', false)" style="background: transparent"></div>

		<div class="弹窗 colLayout">
			<div class="title noShrink center">已点歌曲</div>

			<List :列表="列表">
				<template #item="{ 列表项, 索引 }">
					<div class="item rowLayout">
						<div>
							<div class="歌名">{{ 列表项.歌名 }}</div>
							<div class="歌手 rowLayout">
								<div style="margin-right: 20rem">歌手</div>
								<div>{{ 列表项.歌手 }}</div>
							</div>
						</div>

						<img v-show="索引 == 0" class="icon" src="/图片资源/icon/icon15.png" />
						<div v-show="索引 > 0" class="rowLayout">
							<div class="button center" @click.stop="$emit('修改', { type: '置顶', id: 列表项.id })">置顶</div>
							<div class="button center" @click.stop="$emit('修改', { type: '删除', id: 列表项.id })">删除</div>
						</div>
					</div>
				</template>
			</List>
		</div>
	</div>
</template>

<script setup>
import List from '@/组件/列表容器.vue';

// 属性
const { 列表 } = defineProps(['列表']);
</script>

<style lang="less" scoped>
@import '@/通用样式/style1.css';
.遮罩 {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 990;
	background: rgba(0, 0, 0, 0.2);
	font-size: 24rem;
	user-select: none;
	> .弹窗 {
		min-height: 40%;
		max-height: 60%;
		background: #fff;
		z-index: 10;
		> .title {
			padding: 20rem;
			padding-bottom: 0;
		}
		.item {
			height: 125rem;
			padding: 0 20rem;
			justify-content: space-between;
			border-radius: 10px;
			border: 1px solid #d2d2d2;
			.歌名 {
				font-size: 26rem;
				color: #35393d;
				margin-bottom: 20rem;
			}
			.歌手 {
				font-size: 22rem;
				color: #7d8996;
			}
			.icon {
				width: 55rem;
				height: 42rem;
			}
			.button {
				width: 100rem;
				height: 60rem;
				border-radius: 40rem;
				border: 1px solid #f22f55;
				& + .button {
					margin-left: 20rem;
				}
			}
		}
	}
}
</style>
