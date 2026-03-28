<template>
  <!-- 全局顶部导航栏 -->
  <div class="global-header"
       :class="{ 'header-hidden': !isHeaderVisible }"
       v-if="shouldShowHeader">
    <el-container class="main-container">
      <el-header class="main-header">
        <!-- 修改部分：导航栏左侧添加图标 -->
        <div class="logo-container">
          <el-icon><Document /></el-icon>
          <span class="logo-text">Bowen Shi · Portfolio</span>
        </div>
        <el-menu mode="horizontal" :default-active="activeIndex">
          <el-menu-item index="1" @click="handleHomeClick">
            <el-icon><HomeFilled /></el-icon>
            主页
          </el-menu-item>
          <el-menu-item index="2" @click="handleBlogClick">
            <el-icon><Menu /></el-icon>
            文章
          </el-menu-item>
          <el-menu-item index="3" @click="handleJobClick">
            <el-icon><Star /></el-icon>
            求职（优化中）
          </el-menu-item>
          <el-menu-item index="4" @click="handleTalkClick">
            <el-icon><ChatLineRound /></el-icon>
            随笔
          </el-menu-item>
          <el-menu-item index="5" @click="handleLinkClick">
            <el-icon><Link /></el-icon>
            友链
          </el-menu-item>
          <el-menu-item index="6" @click="handleMessageClick">
            <el-icon><Message /></el-icon>
            留言
          </el-menu-item>
        </el-menu>
        <div class="tabs">
          <div class="admin-menu-item" @click="handleAdminClick">
            <el-icon><Setting /></el-icon>
            <span>管理</span>
          </div>
          <span class="eye-protection-text">护眼👉</span>
          <div class="dark-mode-toggle" @click="toggleDark()">
            <el-icon v-if="isDark">
              <Sunny />
            </el-icon>
            <el-icon v-else>
              <Moon />
            </el-icon>
          </div>
        </div>

        <!-- 密码验证弹窗 -->
        <el-dialog v-model="showAdminDialog" title="请输入管理员密码" width="300px" :close-on-click-modal="false">
          <el-input v-model="adminPassword" type="password" placeholder="请输入密码" @keyup.enter="confirmAdminLogin" />
          <template #footer>
            <el-button @click="showAdminDialog = false">取消</el-button>
            <el-button type="primary" @click="confirmAdminLogin">确认</el-button>
          </template>
        </el-dialog>
      </el-header>
    </el-container>
  </div>

  <router-view class="app-content"/>

  <!-- 右键菜单 -->
  <div
      v-if="showContextMenu"
      class="context-menu"
      :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
  >
    <img src="@/img/monse_gif/monse6.gif" alt="右键菜单" />
  </div>

  <!-- 点击生成爱心的容器 -->
  <div id="heart-container"></div>
  <MusicPlayer />
  <AIChat />
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useDark, useToggle } from "@vueuse/core";
import { useRouter, useRoute } from "vue-router";
import {
  ChatLineRound,
  Document,
  HomeFilled,
  Message,
  Star,
  Menu,
  Link,
  Sunny, Moon,
  Setting
} from "@element-plus/icons-vue";
import MusicPlayer from "@/views/components/music/MusicPlayer.vue";
import AIChat from "@/views/components/aichat/AIChat.vue";
import { ElMessage } from "element-plus";
const router = useRouter();

// 控制右键菜单的显示与位置
const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);

const route = useRoute(); // 添加 route
// 添加计算属性来判断是否应该显示导航栏
const shouldShowHeader = computed(() => true);


// 添加响应式数据来跟踪当前激活的菜单索引
const activeIndex = ref('1');

// 监听路由变化来更新激活的菜单项
watch(() => route.name, (newRouteName) => {
  if (newRouteName === 'index') {
    activeIndex.value = '1';
  } else if (newRouteName === 'BlogList' || route.path.startsWith('/blog')) {
    activeIndex.value = '2';
  } else if (newRouteName === 'Talks' || route.path.startsWith('/talks')) {
    activeIndex.value = '4';
  }else if (newRouteName === 'Job' || route.path.startsWith('/job')) {
    activeIndex.value = '3';
  }else if (newRouteName === 'Links' || route.path.startsWith('/links')) {
    activeIndex.value = '5';
  }else if (newRouteName === 'MessageCloud' || route.path.startsWith('/message')) {
    activeIndex.value = '6';
  }
}, { immediate: true });

// 修改 handleHomeClick 方法
const handleHomeClick = () => {
  activeIndex.value = '1';
  router.push({ name: 'index' });
};

// 修改 handleBlogClick 方法
const handleBlogClick = () => {
  activeIndex.value = '2';
  router.push({ name: 'BlogList' }).then(() => {
    // 跳转后显示导航栏
    isHeaderVisible.value = true;
  });
};

// 添加留言页面跳转方法
const handleMessageClick = () => {
  activeIndex.value = '6';
  router.push('/message');
};

// 添加友链页面跳转方法
const handleLinkClick = () => {
  activeIndex.value = '5';
  router.push('/links');
};

// 添加求职页面跳转方法
const handleJobClick = () => {
  activeIndex.value = '3';
  router.push('/job');
};

// 添加说说页面跳转方法
const handleTalkClick = () => {
  activeIndex.value = '4';
  router.push('/talks');
};
// 添加暗黑模式相关逻辑
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light',
  initialValue: 'dark' // 设置默认值为暗黑模式
})

const toggleDark = useToggle(isDark)

// 管理员入口
const showAdminDialog = ref(false);
const adminPassword = ref('');

const handleAdminClick = () => {
  if (sessionStorage.getItem('adminAuth') === 'true') {
    router.push('/admin');
  } else {
    adminPassword.value = '';
    showAdminDialog.value = true;
  }
};

const confirmAdminLogin = () => {
  if (adminPassword.value === '666888') {
    sessionStorage.setItem('adminAuth', 'true');
    showAdminDialog.value = false;
    router.push('/admin');
  } else {
    ElMessage.error('密码错误');
  }
};


// 鼠标右键点击事件处理
const handleContextMenu = (event) => {
  event.preventDefault(); // 阻止默认的右键菜单
  showContextMenu.value = true;
  contextMenuX.value = event.clientX+120;
  contextMenuY.value = event.clientY;
};

// 点击页面其他地方隐藏右键菜单
const handleClick = () => {
  showContextMenu.value = false;
};

// 双击事件处理函数
const handleDoubleClick = (event) => {
  event.preventDefault(); // 阻止默认的双击行为
};

// 爱心内容数组
const content = [
  "⚔️ 剑心通明 ⚔️", "🔮 修仙问道 🔮", "🔥 炼气化神 🔥",
  "⚡ 御剑飞行 ⚡", "🛡️ 护体金光 🛡️", "💊 灵丹妙药 💊", "🌀 内力深厚 🌀", "道士职业 ☯️",
  "🌟 星辰变 🌟", "🐉 龙腾九天 🐉", "❄️ 寒冰真气 ❄️","💥 雷霆万钧 💥", "🌪️ 风卷残云 🌪️", "💎 灵石仙器 💎",
  "📜 秘籍传承 📜", "🏯 仙山福地 🏯", "💫 化神期至 💫", "🗡️ 飞剑传书 🗡️",
  "🏹 神兵利器 🏹", "📿 佛珠禅意 📿", "☯️ 阴阳调和 ☯️", "🌊 水灵法术 🌊", "⛰️ 金刚不坏 ⛰️", "👻 驱邪镇魔 👻",
  "🧚 神仙眷侣 🧚", "🔥 三昧真火 🔥", "🌙 月下独酌 🌙", "🌸 落英神剑 🌸","⚡ 九阳神功 ⚡",
  "❄️ 九阴真经 ❄️", "💫 乾坤大挪移 💫", "🌪️ 凌波微步 🌪️", "💣 爆炸符箓 💣", "✨ 仙法无边 ✨",
  "🎯 百步穿杨 🎯", "👑 武林盟主 👑", "🏯 修仙洞府 🏯", "🌌 星辰大海 🌌", "🔥 凤舞九天 🔥","⚡ 雷动九天 ⚡",
  "🗡️ 剑指苍穹","⚡ 一念成仙","🏯 仙山琼阁","👻 魑魅魍魉","星辰大海🌟","🏞️ 昆仑仙境","🌊 瀛洲仙岛",
  "🌟 仙气万古 🌟","🔥 纯阳无明 🔥","⛰️ 蓬莱福地","🌋 火域洞天","❄️ 冰原圣境","🌸 桃源秘境",
  "🌌 星辰幻境","🏯 天庭宝地","🌿 青丘仙谷","⚡ 雷泽神域","🔱 方天画戟","💍 储物戒指","📜 天罡符箓",
  "🗡️ 青釭剑","🛡️ 八卦盾","🔮 水晶球","🏹 诛仙弓","⚡ 雷霆锤","🌋 火云扇","🌊 定水珠"
]

// 设置随机颜色
const getRandomColor = () => {
  const allType = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f';
  const allTypeArr = allType.split(',');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    const random = parseInt(Math.random() * allTypeArr.length);
    color += allTypeArr[random];
  }
  return color;
};

// 创建爱心
const createHeart = (e) => {
  const x = e.pageX;
  const y = e.pageY;

  const randContentIndex = Math.floor(Math.random() * content.length);
  const randColor = getRandomColor();

  const span = document.createElement('span');
  span.textContent = content[randContentIndex];
  span.className = 'text';
  span.style.top = `${y - 20}px`;
  span.style.left = `${x - 50}px`;
  span.style.color = randColor;
  span.style.animation = 'remove 2s';

  document.getElementById('heart-container').appendChild(span);

  let i = 0;
  const interval = setInterval(() => {
    span.style.top = `${y - 20 - i}px`;
    i++;
  }, 10);

  setTimeout(() => {
    clearInterval(interval);
    span.remove();
  }, 1900);
};

// 绑定点击事件
const setupHeartClick = () => {
  window.addEventListener('click', createHeart);
};

// 添加响应式数据来控制导航栏的显示状态
const isHeaderVisible = ref(true);
const lastScrollTop = ref(0);
const headerHeight = ref(0);
const scrollThreshold = ref(0);

// 监听窗口滚动事件（用于除首页外的其他页面）
const handleWindowScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // 只有滚动距离超过阈值才触发
  if (Math.abs(scrollTop - lastScrollTop.value) <= scrollThreshold.value) {
    lastScrollTop.value = scrollTop;
    return;
  }

  // 向下滚动且滚动距离大于导航栏高度时隐藏
  if (scrollTop > lastScrollTop.value && scrollTop > headerHeight.value) {
    isHeaderVisible.value = false;
  }
  // 向上滚动或滚动到顶部附近时显示
  else if (scrollTop < lastScrollTop.value || scrollTop < headerHeight.value) {
    isHeaderVisible.value = true;
  }

  lastScrollTop.value = scrollTop;
};

// 处理来自 IndexView 的导航栏显示/隐藏事件
const handleHeaderVisibilityChange = (event: CustomEvent) => {
  isHeaderVisible.value = event.detail;
};

// 组件挂载时绑定事件
onMounted(() => {
  // 监听窗口滚动事件（用于博客列表等页面）
  window.addEventListener('scroll', handleWindowScroll);
  // 监听来自 IndexView 的自定义事件
  window.addEventListener('headerVisibilityChange', handleHeaderVisibilityChange as EventListener);
  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('click', handleClick);
  window.addEventListener('dblclick', handleDoubleClick);
  setupHeartClick();
});

// 组件卸载时移除事件
onUnmounted(() => {
  window.removeEventListener('scroll', handleWindowScroll);
  window.removeEventListener('headerVisibilityChange', handleHeaderVisibilityChange as EventListener);
  window.removeEventListener('contextmenu', handleContextMenu);
  window.removeEventListener('click', handleClick);
  window.removeEventListener('dblclick', handleDoubleClick); // 解绑双击事件
  window.removeEventListener('click', createHeart);

  // 关闭WebSocket连接
  if (websocket.value) {
    websocket.value.close();
  }
});

</script>



<style scoped>
.global-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: transform 0.6s ease-in-out, background-color 0.6s ease-in-out;
}

/* 导航栏隐藏时的样式 */
.header-hidden {
  transform: translateY(-100%);
  background-color: #95a194 !important; /* 隐藏时的背景色 */
}

/* 为 app-content 添加滚动条样式 */
.app-content {
  transition: margin-top 0.6s ease-in-out;
  overflow-y: auto;
}

/* 当导航栏隐藏时减少内容区域的顶部边距 */
.header-hidden + .app-content {
  margin-top: 0;
}

.main-header {
  height: 55px;
  background-color: inherit !important; /* 继承 .global-header 的背景色 */
  border-bottom: none; /* 移除底部边框 */
  display: flex;
  align-items: center;
  z-index: 10; /* 确保导航栏在背景图之上 */
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: 20px;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.logo-container .logo-text {
  margin-left: 10px;
}

.el-menu--horizontal {
  background-color: transparent !important; /* 使 el-menu 透明 */
  border-bottom: none !important; /* 移除底部边框（虚线） */
  display: flex;
  flex-grow: 1;
}

.el-menu--horizontal .el-menu-item {
  color: white;
  font-weight: bold;
  background-color: transparent !important; /* 使 el-menu-item 透明 */
}

.el-menu--horizontal .el-menu-item i {
  margin-right: 5px;
}

.tabs {
  height: 55px;
  gap: 10px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: right;
}

.tab-item {
  padding: 0 10px;
  cursor: default;
}

.eye-protection-text {
  color: #00851d;
  font-size: 15px;
  font-family: "Microsoft Yahei", sans-serif;
  font-weight: 500;
  letter-spacing: 1px;
  border-radius: 4px;
  padding: 0;
  margin: -10px;
}

/* 管理菜单项样式 */
.admin-menu-item {
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: white;
  font-weight: bold;
  height: 100%;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 15px;
}

.admin-menu-item:hover {
  color: #409eff; /* Element Plus 默认主题的深蓝色 */
}

.admin-menu-item i {
  margin-right: 5px;
}

/* 暗黑模式切换按钮样式 */
.dark-mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
}

.dark-mode-toggle:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.dark-mode-toggle .el-icon {
  font-size: 18px;
  color: white;
}
html.dark .global-header {
  background-color: rgba(0, 0, 0, 0.5);
}

html.dark .main-header {
  background-color: rgba(0, 0, 0, 0.5);
}

html.dark .logo-text {
  color: #e0e0e0;
}

html.dark .el-menu--horizontal .el-menu-item {
  color: #e0e0e0;
}

html.dark .eye-protection-text {
  color: #4ade80;
}

html.dark .admin-menu-item {
  color: #e0e0e0;
}

html.dark .admin-menu-item:hover {
  color: #409eff;
}
</style>


<style>
/* 右键菜单样式 */
.context-menu {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
}

/* 点击生成爱心的容器样式 */
#heart-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999999;
}

/* 自定义文字样式 */
.text {
  position: absolute;
  z-index: 9999999;
  font-weight: bold;
  user-select: none;
  animation: remove 2s;
}

@keyframes remove {
  100% {
    opacity: 0;
  }
}

/* 全局鼠标样式 */
body {
  cursor: url("@/img/monse_gif/monse2.gif") 0 50, auto; /* 默认自定义鼠标样式 */
}

/* 导航栏悬停状态 */
.el-menu--horizontal .el-menu-item:hover {
  cursor: url("@/img/monse_gif/monse3.gif"), pointer; /* 自定义鼠标样式或手型样式 */
}
/* 悬停在可点击区域 */
button,
a,
input,
textarea,
select,
[tabindex],
[role="button"],
.el-button,
.el-link {
  cursor: url("@/img/monse_gif/monse3.gif"), pointer; /* 自定义鼠标样式或手型样式 */
}

/* 其他可点击元素 */
.clickable-element {
  cursor: url("@/img/monse_gif/monse3.gif"), pointer; /* 自定义鼠标样式或手型样式 */
}

/* 点击时的鼠标样式 */
button:active,
a:active,
input:active,
textarea:active,
select:active,
[tabindex]:active,
[role="button"]:active,
.el-button:active,
.el-link:active {
  cursor: url("@/img/monse_gif/monse4.gif"), progress; /* 点击时的自定义鼠标样式或其他样式 */
}
/* 导航栏悬停状态 */
.el-menu--horizontal .el-menu-item:active {
  cursor: url("@/img/monse_gif/monse4.gif"), pointer; /* 自定义鼠标样式或手型样式 */
}

/* 全局滚动条样式 - 影响所有滚动条 */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(140, 174, 166, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(188, 169, 169, 0.6);
}

::-webkit-scrollbar-corner {
  background-color: transparent;
}
</style>
