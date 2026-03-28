import { createRouter, createWebHistory } from 'vue-router'
import BlogListView from "@/views/components/card/BlogListView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            redirect: '/index',
        }, {
            path: '/index',
            name: 'index',
            component: () => import('@/views/IndexView.vue'),
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('@/views/components/AdminView.vue'),
            beforeEnter: (to, from, next) => {
                if (sessionStorage.getItem('adminAuth') === 'true') {
                    next();
                } else {
                    next('/index');
                }
            }
        }, {
            path: '/blogs',
            name: 'BlogList',
            component: BlogListView
        }, {
            path: '/blog/:id',
            name: 'BlogDetail',
            component: () => import('@/views/components/card/ArticleDetail.vue'),
            props: true
        }, {
            path: '/message',
            name: 'MessageCloud',
            component: () => import('@/views/components/card/WordCloud.vue')
        },
        {
            path: '/links',
            name: 'Links',
            component: () => import('@/views/components/card/Links.vue')
        },
        {
            path: '/talks',
            name: 'Talks',
            component: () => import('@/views/components/card/Talks.vue')
        },
        {
            path: '/job',
            name: 'Job',
            component: () => import('@/views/components/card/ResumeBuilder.vue')
        }
    ]
})

export default router
