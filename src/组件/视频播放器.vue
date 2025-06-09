<template>
    <div class="player">
        <div class="video-container">
            <video ref="videoPlayer" :src="videoSrc" controls playsinline webkit-playsinline></video>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    videoSrc: {
        type: String,
        default: ''
    }
});

const videoPlayer = ref(null);

// 添加播放方法
const playVideo = () => {
    if (videoPlayer.value) {
        videoPlayer.value.play();
    }
}

// 添加停止方法
const stopVideo = () => {
    if (videoPlayer.value) {
        videoPlayer.value.pause(); // 暂停视频
        videoPlayer.value.currentTime = 0; // 将视频进度重置为开始
    }
}

// 将方法暴露给父组件
defineExpose({
    playVideo,
    stopVideo
});
</script>

<style scoped lang="less">
.player {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .video-container {
        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

}
</style>