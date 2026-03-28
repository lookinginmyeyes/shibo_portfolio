<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

/** public/music/；需带 Vite base（GitHub Pages 子路径时不能写死 /music/...） */
const musicBase = `${import.meta.env.BASE_URL || "/"}`.replace(/\/?$/, "/");
const songs = [
  {
    title: "晴天",
    url: `${musicBase}music/jay-qingtian.mp3`,
  },
];

/** mousedown 的 target 可能是文本节点，没有 .closest，会抛错导致整卡交互失效 */
const eventToElement = (target) => {
  if (target instanceof Element) return target;
  if (target?.parentElement instanceof Element) return target.parentElement;
  return null;
};

const currentSong = ref(songs[0]);
const currentSongIndex = ref(0);
const isPlaying = ref(false);
const volume = ref(0.5); // 默认音量 50%
const progress = ref(0); // 播放进度

const audioPlayer = ref(null);
const playerPosition = ref({ x: 20, y: 20 }); // 基于 left 和 bottom 定位
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 }); // 拖拽偏移量（基于 left 和 bottom）

// 播放/暂停切换（play() 为 Promise，失败时与 UI 对齐）
const togglePlay = async () => {
  const a = audioPlayer.value;
  if (!a) return;
  if (a.paused) {
    try {
      await a.play();
      isPlaying.value = true;
    } catch {
      isPlaying.value = false;
    }
  } else {
    a.pause();
    isPlaying.value = false;
  }
};

// 切换音量
const changeVolume = () => {
  audioPlayer.value.volume = volume.value;
};

// 播放下一首
const nextSong = () => {
  currentSongIndex.value = (currentSongIndex.value + 1) % songs.length;
  currentSong.value = songs[currentSongIndex.value];
  audioPlayer.value.load();
  audioPlayer.value.play();
};

// 更新播放进度
const updateProgress = () => {
  if (audioPlayer.value && !isNaN(audioPlayer.value.duration)) {
    progress.value = (audioPlayer.value.currentTime / audioPlayer.value.duration) * 100;
  }
};

const onAudioPause = () => {
  isPlaying.value = false;
};

const onAudioPlay = () => {
  isPlaying.value = true;
};

// 改变播放进度
const changeProgress = () => {
  if (audioPlayer.value) {
    audioPlayer.value.currentTime = (progress.value * audioPlayer.value.duration) / 100;
  }
};

const bindAudioListeners = () => {
  const a = audioPlayer.value;
  if (!a) return;
  a.addEventListener('timeupdate', updateProgress);
  a.addEventListener('pause', onAudioPause);
  a.addEventListener('play', onAudioPlay);
};

// 监听音频播放时间更新（等 DOM 挂上 ref 后再绑，避免偶发 audio 为 null）
onMounted(() => {
  nextTick(() => {
    bindAudioListeners();
  });
});

onBeforeUnmount(() => {
  const a = audioPlayer.value;
  if (a) {
    a.removeEventListener('timeupdate', updateProgress);
    a.removeEventListener('pause', onAudioPause);
    a.removeEventListener('play', onAudioPlay);
  }
  window.removeEventListener('mousemove', onDragging);
  window.removeEventListener('mouseup', stopDragging);
});

// 拖拽开始
const startDragging = (e) => {
  const el = eventToElement(e.target);
  if (!el) return;
  // 滑块、播放键等：避免当成拖拽，否则 click 可能进不来
  if (el instanceof HTMLInputElement && el.type === 'range') return;
  if (el.closest('.play-button')) return;
  if (el.closest('.progress-container')) return;
  if (el.closest('.controls')) return;
  if (el.closest('.song-info-top')) return;

  isDragging.value = true;
  // 记录点击时的偏移量
  dragOffset.value = {
    x: e.clientX - playerPosition.value.x,
    y: window.innerHeight - e.clientY - playerPosition.value.y, // 基于 bottom 计算
  };
  window.addEventListener("mousemove", onDragging);
  window.addEventListener("mouseup", stopDragging);
};

// 拖拽中
const onDragging = (e) => {
  if (isDragging.value) {
    const newLeft = e.clientX - dragOffset.value.x;
    const newBottom = window.innerHeight - e.clientY - dragOffset.value.y;

    // 限制播放器不能拖出可视区域
    const safeLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 100));
    const safeBottom = Math.max(0, Math.min(newBottom, window.innerHeight - 100));

    playerPosition.value = {
      x: safeLeft,
      y: safeBottom,
    };
  }
};

// 拖拽结束
const stopDragging = () => {
  isDragging.value = false;
  window.removeEventListener("mousemove", onDragging);
  window.removeEventListener("mouseup", stopDragging);
};


</script>

<template>
  <div
      class="music-player"
      :style="{
      left: playerPosition.x + 'px',
      bottom: playerPosition.y + 'px'
    }"
      @mousedown="startDragging"
  >
    <!-- 用于背景图的独立 div -->
    <div class="background-image" :class="{ rotate: isPlaying }"></div>

    <!-- 歌曲标题和播放/暂停按钮 -->
    <div class="song-info-top">
      <p class="song-title">{{ currentSong.title }}</p>
    </div>

    <audio ref="audioPlayer" :src="currentSong.url" @ended="nextSong"></audio>

    <!-- 播放进度条 -->
    <div class="progress-container">
      <input
          type="range"
          min="0"
          max="100"
          step="1"
          v-model="progress"
          @input="changeProgress"
          @mousedown.stop
          class="progress-bar"
      />
    </div>

    <!-- 音量调节滑块 -->
    <div class="controls">
      <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="volume"
          @input="changeVolume"
          @mousedown.stop
      />
    </div>

    <!-- 播放/暂停按钮 -->
    <button type="button" @click.stop="togglePlay" class="play-button">
      {{ isPlaying ? '♫' : '▷' }}
    </button>
  </div>
</template>




<style scoped>
.music-player {
  position: fixed;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 999999;
  cursor: move;
  transition: transform 0.2s ease;
  font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif;
  border: 3px solid #ff69b4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  bottom: 20px;
  left: 20px;
  animation: float 3s ease-in-out infinite;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/img/musicplayer/backgroundByMusic.jpg');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.background-image.rotate {
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.song-info-top {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #ff1493;
  margin-left: 0;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: bold;
  text-shadow: 1px 1px 2px #fff;
}

.play-button {
  margin-bottom: 0px;
  margin-right: -5px;
  font-size: 20px;
  cursor: pointer;
  background: none;
  border: none;
  color: #ff1493;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  position: relative;
}

.play-button:hover {
  transform: scale(1.2);
}

.play-button::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #ff1493;
  border-radius: 50%;
  animation: pulse 2s infinite;
  opacity: 0.5;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.2;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

.song-title {
  margin: 0;
  white-space: nowrap;
  text-shadow: 1px 1px 2px #fff;
}

.progress-container {
  width: 100%;
  margin-top: -10px;
  padding: 0;
}

.progress-bar {
  width: 100%;
  accent-color: #ff1493;
  background-color: rgba(255, 255, 255, 0.7);
  height: 5px;
  border-radius: 2.5px;
}

.progress-bar::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #ff1493;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.controls {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding-bottom: 0;
}

.controls input[type="range"] {
  width: 100%;
  accent-color: #ff1493;
  background-color: rgba(255, 255, 255, 0.7);
  height: 5px;
  border-radius: 2.5px;
}

.controls input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: #ff1493;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>


