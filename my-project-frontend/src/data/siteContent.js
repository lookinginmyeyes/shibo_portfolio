/**
 * 站点展示文案与外链（首页「我的小宇宙」、弹窗 UniverseOverviewCard 等统一从这里维护）
 */

export const universeProjects = [
  {
    name: '黑暗森林 · 推理博弈游戏',
    url: 'https://dark-forest-rouge.vercel.app/',
    desc: '基于"黑暗森林"法则的回合制身份博弈游戏，[文明·人联] vs [文明·智域]。',
  },
  {
    name: '心斋 · 情绪打卡',
    url: 'https://xinzhai.vercel.app/about',
    desc: '一个帮你把每天的情绪安放下来的小网站，记录、回看自己的心情轨迹。',
  },
  {
    name: 'AIPM Skills · AI 产品经理提效库',
    url: 'https://github.com/lookinginmyeyes/AIPM-skills',
    desc: '一组为 AI 产品经理准备的 skills，例如一页纸 PRD 生成、用户需求调研、评测集生成等。',
  },
]

export const universeSkills = [
  'Vue3',
  'Prompt 工程',
  'Agent Workflow',
  'PRD / 原型',
  'RAG / 评测',
  'vibe coding',
]

/** Skill 汇总弹窗底部仓库链接 */
export const skillsRepoUrl = 'https://github.com/lookinginmyeyes/AIPM-skills'

/** 卡片与弹窗共用的项目列表（避免引用被意外改写） */
export function cloneUniverseProjectsForUi() {
  return universeProjects.map((p) => ({
    name: p.name,
    url: p.url,
    desc: p.desc,
  }))
}

/** 首页左侧「我的小宇宙」区块（除 type 外文案与图也在此维护） */
export function createUniverseHomeSection() {
  return {
    title: '我的小宇宙',
    description: '几个正在生长的个人项目，欢迎随便点开逛逛。',
    image: 'mainview/2.png',
    type: 'project',
    projects: cloneUniverseProjectsForUi(),
  }
}
