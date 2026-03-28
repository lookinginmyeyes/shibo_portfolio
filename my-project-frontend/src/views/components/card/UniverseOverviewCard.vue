<template>
  <div class="universe-detail">
    <div class="tab-buttons">
      <button
        type="button"
        :class="['tab-button', { active: activeTab === 'projects' }]"
        @click="activeTab = 'projects'"
      >
        我的项目
      </button>
      <button
        type="button"
        :class="['tab-button', { active: activeTab === 'skills' }]"
        @click="activeTab = 'skills'"
      >
        我的 Skill
      </button>
    </div>

    <div v-if="activeTab === 'projects'" class="task-list">
      <div v-for="(project, index) in projects" :key="index" class="task-card">
        <h3>
          <a
            class="project-title-link"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            @click.prevent="openUrl(project.url)"
          >{{ project.name }}</a>
        </h3>
        <p>{{ project.desc }}</p>
        <p>
          <a
            class="inline-link"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            @click.prevent="openUrl(project.url)"
          >打开链接 →</a>
        </p>
      </div>
    </div>

    <div v-else class="skills-panel">
      <p class="skills-intro">常用方向与工具（随项目迭代更新）。</p>
      <div class="skill-tags">
        <span
          v-for="(skill, i) in skills"
          :key="i"
          class="skill-pill"
          :style="{ backgroundColor: tagColor(skill) }"
        >{{ skill }}</span>
      </div>
      <div v-if="skillsRepoUrl" class="skills-repo">
        <a
          class="inline-link"
          :href="skillsRepoUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click.prevent="openUrl(skillsRepoUrl)"
        >AIPM Skills 开源仓库 →</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  projects: { type: Array, default: () => [] },
  skills: { type: Array, default: () => [] },
  skillsRepoUrl: { type: String, default: '' },
})

const activeTab = ref('projects')

const openUrl = (url) => {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

const palette = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
  'rgb(199, 199, 199)',
  'rgb(83, 109, 254)',
  'rgb(0, 188, 212)',
  'rgb(255, 193, 7)',
  'rgb(76, 175, 80)',
]

const tagColor = (text) => {
  let hash = 0
  for (let i = 0; i < String(text).length; i++) {
    hash = String(text).charCodeAt(i) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}
</script>

<style scoped>
.universe-detail {
  border-radius: 20px;
  padding: 40px;
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Comic Sans MS', 'Noto Sans JP', sans-serif;
  color: #fff;
  background-image: url('@/img/websitetaskbackground/WebsiteTaskBackground.jpg');
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.4);
  background-blend-mode: multiply;
}

.tab-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 8px;
}

.tab-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-family: inherit;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.tab-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
}

.tab-button.active {
  background-color: rgba(255, 255, 255, 0.4);
  font-weight: bold;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
}

.task-card {
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(255, 0, 255, 0.3);
}

.task-card h3 {
  margin-top: 0;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.6);
}

.task-card p {
  margin: 5px 0;
  font-size: 14px;
  color: #f0f0f0;
}

.project-title-link,
.inline-link {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.project-title-link:hover,
.inline-link:hover {
  color: #e0e0ff;
}

.skills-panel {
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
}

.skills-intro {
  margin: 0 0 16px;
  font-size: 15px;
  color: #f0f0f0;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.skill-pill {
  padding: 8px 14px;
  border-radius: 18px;
  font-size: 14px;
  color: #fff;
  opacity: 0.95;
}

.skills-repo {
  margin-top: 8px;
}
</style>
