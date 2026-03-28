<!--
  视觉与交互参考 CareerCompass（MIT）中的 animated-characters：
  https://github.com/arsh342/careercompass/blob/main/src/components/ui/animated-characters.tsx
  本文件为 Vue 3 重写，未直接复制 React 代码。
-->
<template>
  <div class="ac-root" aria-hidden="true">
    <div class="ac-stage" :style="stageStyle">
      <!-- Purple -->
      <div ref="purpleRef" class="ac-char ac-purple" :style="purpleBodyStyle">
        <div class="ac-eye-row ac-purple-eyes" :style="purpleEyeRowStyle">
          <div ref="purpleEyeLRef" class="ac-eyeball" :style="eyeballOuter(18)">
            <div
              class="ac-pupil-in-eye"
              :style="pupilInEye(purpleEyeLRef, 7, 5, isPurpleBlinking)"
            />
          </div>
          <div ref="purpleEyeRRef" class="ac-eyeball" :style="eyeballOuter(18)">
            <div
              class="ac-pupil-in-eye"
              :style="pupilInEye(purpleEyeRRef, 7, 5, isPurpleBlinking)"
            />
          </div>
        </div>
      </div>

      <!-- Black -->
      <div ref="blackRef" class="ac-char ac-black" :style="blackBodyStyle">
        <div class="ac-eye-row ac-black-eyes" :style="blackEyeRowStyle">
          <div ref="blackEyeLRef" class="ac-eyeball" :style="eyeballOuter(16)">
            <div
              class="ac-pupil-in-eye"
              :style="pupilInEye(blackEyeLRef, 6, 4, isBlackBlinking, true)"
            />
          </div>
          <div ref="blackEyeRRef" class="ac-eyeball" :style="eyeballOuter(16)">
            <div
              class="ac-pupil-in-eye"
              :style="pupilInEye(blackEyeRRef, 6, 4, isBlackBlinking, true)"
            />
          </div>
        </div>
      </div>

      <!-- Orange -->
      <div ref="orangeRef" class="ac-char ac-orange" :style="orangeBodyStyle">
        <div class="ac-eye-row ac-orange-eyes" :style="orangeEyeRowStyle">
          <div ref="orangeSocketLRef" class="ac-pupil-socket">
            <div class="ac-pupil-dot" :style="pupilInSocket(orangeSocketLRef, 12, 5)" />
          </div>
          <div ref="orangeSocketRRef" class="ac-pupil-socket">
            <div class="ac-pupil-dot" :style="pupilInSocket(orangeSocketRRef, 12, 5)" />
          </div>
        </div>
      </div>

      <!-- Yellow -->
      <div ref="yellowRef" class="ac-char ac-yellow" :style="yellowBodyStyle">
        <div class="ac-eye-row ac-yellow-eyes" :style="yellowEyeRowStyle">
          <div ref="yellowSocketLRef" class="ac-pupil-socket">
            <div class="ac-pupil-dot" :style="pupilInSocket(yellowSocketLRef, 12, 5)" />
          </div>
          <div ref="yellowSocketRRef" class="ac-pupil-socket">
            <div class="ac-pupil-dot" :style="pupilInSocket(yellowSocketRRef, 12, 5)" />
          </div>
        </div>
        <div class="ac-mouth" :style="yellowMouthStyle" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  scale: { type: Number, default: 1 },
  isTyping: { type: Boolean, default: false },
})

const mouseX = ref(0)
const mouseY = ref(0)

const purpleRef = ref(null)
const blackRef = ref(null)
const orangeRef = ref(null)
const yellowRef = ref(null)

const purpleEyeLRef = ref(null)
const purpleEyeRRef = ref(null)
const blackEyeLRef = ref(null)
const blackEyeRRef = ref(null)
const orangeSocketLRef = ref(null)
const orangeSocketRRef = ref(null)
const yellowSocketLRef = ref(null)
const yellowSocketRRef = ref(null)

const isPurpleBlinking = ref(false)
const isBlackBlinking = ref(false)
const isLookingAtEachOther = ref(false)

let purpleBlinkTimer = null
let blackBlinkTimer = null
let lookTimer = null

const stageStyle = computed(() => ({
  transform: props.scale !== 1 ? `scale(${props.scale})` : undefined,
  transformOrigin: 'center bottom',
}))

function onMouseMove(e) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

function calculateBody(refEl) {
  if (!refEl?.value) {
    return { faceX: 0, faceY: 0, bodySkew: 0 }
  }
  const rect = refEl.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 3
  const dx = mouseX.value - centerX
  const dy = mouseY.value - centerY
  const faceX = Math.max(-15, Math.min(15, dx / 20))
  const faceY = Math.max(-10, Math.min(10, dy / 30))
  const bodySkew = Math.max(-6, Math.min(6, -dx / 120))
  return { faceX, faceY, bodySkew }
}

const purplePos = computed(() => calculateBody(purpleRef))
const blackPos = computed(() => calculateBody(blackRef))
const orangePos = computed(() => calculateBody(orangeRef))
const yellowPos = computed(() => calculateBody(yellowRef))

const purpleBodyStyle = computed(() => {
  const { bodySkew } = purplePos.value
  const skew = props.isTyping ? (bodySkew || 0) - 12 : bodySkew || 0
  const tx = props.isTyping ? 40 : 0
  return {
    transform: props.isTyping
      ? `skewX(${skew}deg) translateX(${tx}px)`
      : `skewX(${skew}deg)`,
  }
})

const blackBodyStyle = computed(() => {
  const { bodySkew } = blackPos.value
  if (isLookingAtEachOther.value) {
    return {
      transform: `skewX(${(bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`,
    }
  }
  if (props.isTyping) {
    return { transform: `skewX(${(bodySkew || 0) * 1.5}deg)` }
  }
  return { transform: `skewX(${bodySkew || 0}deg)` }
})

const orangeBodyStyle = computed(() => ({
  transform: `skewX(${orangePos.value.bodySkew || 0}deg)`,
}))

const yellowBodyStyle = computed(() => ({
  transform: `skewX(${yellowPos.value.bodySkew || 0}deg)`,
}))

const purpleEyeRowStyle = computed(() => {
  const { faceX, faceY } = purplePos.value
  if (isLookingAtEachOther.value) {
    return { left: '55px', top: '65px' }
  }
  return { left: `${45 + faceX}px`, top: `${40 + faceY}px` }
})

const blackEyeRowStyle = computed(() => {
  const { faceX, faceY } = blackPos.value
  if (isLookingAtEachOther.value) {
    return { left: '32px', top: '12px' }
  }
  return { left: `${26 + faceX}px`, top: `${32 + faceY}px` }
})

const orangeEyeRowStyle = computed(() => {
  const { faceX, faceY } = orangePos.value
  return { left: `${82 + faceX}px`, top: `${90 + faceY}px` }
})

const yellowEyeRowStyle = computed(() => {
  const { faceX, faceY } = yellowPos.value
  return { left: `${52 + faceX}px`, top: `${40 + faceY}px` }
})

const yellowMouthStyle = computed(() => {
  const { faceX, faceY } = yellowPos.value
  return { left: `${40 + faceX}px`, top: `${88 + faceY}px` }
})

function eyeballOuter(sizePx) {
  return {
    width: `${sizePx}px`,
    height: `${sizePx}px`,
  }
}

function pupilInEye(eyeRef, pupilSize, maxDistance, blinking, isBlack = false) {
  if (blinking) {
    return { width: 0, height: 0, opacity: 0 }
  }
  const el = eyeRef?.value
  if (!el) return {}
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const deltaX = mouseX.value - cx
  const deltaY = mouseY.value - cy
  const dist = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
  const angle = Math.atan2(deltaY, deltaX)
  let fx
  let fy
  if (isLookingAtEachOther.value) {
    if (isBlack) {
      fx = 0
      fy = -4
    } else {
      fx = 3
      fy = 4
    }
  } else {
    fx = Math.cos(angle) * dist
    fy = Math.sin(angle) * dist
  }
  return {
    width: `${pupilSize}px`,
    height: `${pupilSize}px`,
    transform: `translate(${fx}px, ${fy}px)`,
    transition: 'transform 0.04s linear',
  }
}

function pupilInSocket(socketRef, size, maxDistance) {
  const base = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: '#2d2d2d',
    borderRadius: '50%',
  }
  const sock = socketRef?.value
  if (!sock) return base
  const rect = sock.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const deltaX = mouseX.value - cx
  const deltaY = mouseY.value - cy
  const dist = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
  const angle = Math.atan2(deltaY, deltaX)
  const x = Math.cos(angle) * dist
  const y = Math.sin(angle) * dist
  return {
    ...base,
    transform: `translate(${x}px, ${y}px)`,
    transition: 'transform 0.04s linear',
  }
}

function runPurpleBlinkLoop() {
  const delay = Math.random() * 4000 + 3000
  purpleBlinkTimer = window.setTimeout(() => {
    isPurpleBlinking.value = true
    window.setTimeout(() => {
      isPurpleBlinking.value = false
      runPurpleBlinkLoop()
    }, 150)
  }, delay)
}

function runBlackBlinkLoop() {
  const delay = Math.random() * 4000 + 3000
  blackBlinkTimer = window.setTimeout(() => {
    isBlackBlinking.value = true
    window.setTimeout(() => {
      isBlackBlinking.value = false
      runBlackBlinkLoop()
    }, 150)
  }, delay)
}

watch(
  () => props.isTyping,
  (v) => {
    if (lookTimer) {
      clearTimeout(lookTimer)
      lookTimer = null
    }
    if (v) {
      isLookingAtEachOther.value = true
      lookTimer = window.setTimeout(() => {
        isLookingAtEachOther.value = false
      }, 800)
    } else {
      isLookingAtEachOther.value = false
    }
  }
)

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  runPurpleBlinkLoop()
  runBlackBlinkLoop()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  if (purpleBlinkTimer) clearTimeout(purpleBlinkTimer)
  if (blackBlinkTimer) clearTimeout(blackBlinkTimer)
  if (lookTimer) clearTimeout(lookTimer)
})
</script>

<style scoped>
.ac-root {
  pointer-events: none;
  user-select: none;
}

.ac-stage {
  position: relative;
  width: 550px;
  height: 400px;
}

.ac-char {
  position: absolute;
  bottom: 0;
  transition: transform 0.16s ease-out;
}

.ac-purple {
  left: 70px;
  width: 180px;
  height: 400px;
  background-color: #6c3ff5;
  border-radius: 10px 10px 0 0;
  z-index: 1;
  transform-origin: bottom center;
}

.ac-black {
  left: 240px;
  width: 120px;
  height: 310px;
  background-color: #2d2d2d;
  border-radius: 8px 8px 0 0;
  z-index: 2;
  transform-origin: bottom center;
}

.ac-orange {
  left: 0;
  width: 240px;
  height: 200px;
  z-index: 3;
  background-color: #ff9b6b;
  border-radius: 120px 120px 0 0;
  transform-origin: bottom center;
}

.ac-yellow {
  left: 310px;
  width: 140px;
  height: 230px;
  background-color: #e8d754;
  border-radius: 70px 70px 0 0;
  z-index: 4;
  transform-origin: bottom center;
}

.ac-eye-row {
  position: absolute;
  display: flex;
  transition: left 0.16s ease-out, top 0.16s ease-out;
}

.ac-purple-eyes {
  gap: 32px;
}

.ac-black-eyes {
  gap: 24px;
}

.ac-orange-eyes {
  gap: 32px;
  transition: left 0.07s ease-out, top 0.07s ease-out;
}

.ac-yellow-eyes {
  gap: 24px;
  transition: left 0.07s ease-out, top 0.07s ease-out;
}

.ac-eyeball {
  border-radius: 50%;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ac-pupil-in-eye {
  border-radius: 50%;
  background-color: #2d2d2d;
  flex-shrink: 0;
}

.ac-pupil-socket {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ac-pupil-dot {
  flex-shrink: 0;
}

.ac-mouth {
  position: absolute;
  width: 80px;
  height: 4px;
  background-color: #2d2d2d;
  border-radius: 999px;
  transition: left 0.07s ease-out, top 0.07s ease-out;
}
</style>
