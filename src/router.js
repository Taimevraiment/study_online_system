import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login" */ './components/Login.vue')
const Assistant = () => import(/* webpackChunkName: "assistant" */ './components/assistant/Assistant.vue')
const AssisWelcome = () => import(/* webpackChunkName: "assistant" */ './components/assistant/AssisWelcome.vue')
const AssisMarking = () => import(/* webpackChunkName: "assistant" */ './components/assistant/AssisMarking.vue')
const AssisMarked = () => import(/* webpackChunkName: "assistant" */ './components/assistant/AssisMarked.vue')
const AssisPublished = () => import(/* webpackChunkName: "assistant" */ './components/assistant/AssisPublished.vue')
const TeaMarking = () => import(/* webpackChunkName: "teacher" */ './components/teacher/TeaMarking.vue')
const TeaMarked = () => import(/* webpackChunkName: "teacher" */ './components/teacher/TeaMarked.vue')
const TeaScore = () => import(/* webpackChunkName: "teacher" */ './components/teacher/TeaScore.vue')
const Teacher = () => import(/* webpackChunkName: "teacher" */ './components/teacher/Teacher.vue')
const Publish = () => import(/* webpackChunkName: "teacher" */ './components/teacher/Publish.vue')
const TeaWelcome = () => import(/* webpackChunkName: "teacher" */ './components/teacher/TeaWelcome.vue')
const TeaPublished = () => import(/* webpackChunkName: "teacher" */ './components/teacher/TeaPublished.vue')
const Student = () => import(/* webpackChunkName: "student" */ './components/student/Student.vue')
const StuWelcome = () => import(/* webpackChunkName: "student" */ './components/student/StuWelcome.vue')
const Homeworking = () => import(/* webpackChunkName: "student" */ './components/student/Homeworking.vue')
const Homeworked = () => import(/* webpackChunkName: "student" */ './components/student/Homeworked.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/assistant',
    component: Assistant,
    redirect: '/assisWelcome',
    children: [
      { path: '/assisWelcome', component: AssisWelcome },
      { path: '/assismarking', component: AssisMarking },
      { path: '/assismarked', component: AssisMarked },
      { path: '/assispublished', component: AssisPublished }
    ]
  }, {
    path: '/teacher',
    component: Teacher,
    redirect: '/teaWelcome',
    children: [
      { path: '/teaWelcome', component: TeaWelcome },
      { path: '/publish', component: Publish },
      { path: '/teamarking', component: TeaMarking },
      { path: '/teamarked', component: TeaMarked },
      { path: '/teapublished', component: TeaPublished },
      { path: '/teascore', component: TeaScore }
    ]
  },
  {
    path: '/student',
    component: Student,
    redirect: '/stuWelcome',
    children: [
      { path: '/stuWelcome', component: StuWelcome },
      { path: '/homeworking', component: Homeworking },
      { path: '/homeworked', component: Homeworked }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
