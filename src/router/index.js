import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/recover',
      name: 'recover',
      component: () => import('../views/Recover.vue')
    },
    {
      path: '/reset/:token',
      name: 'reset',
      component: () => import('../views/Reset.vue')
    },

    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true, level: 1 },
    },

    {
      path: '/conductores/:page/:sort?/:dir?/:query?',
      name: 'conductores',
      component: () => import('../views/Conductores.vue'),
      meta: { requiresAuth: true, level: 1 },
    },
    {
      path: '/conductores',
      redirect: '/conductores/1'
    },

    {
      path: '/tarjetas/:page/:sort?/:dir?/:query?',
      name: 'tarjetas',
      component: () => import('../views/Tarjetas.vue'),
      meta: { requiresAuth: true, level: 5 },
    },
    {
      path: '/tarjetas',
      redirect: '/tarjetas/1'
    },

    {
      path: '/dispositivos/:page/:sort?/:dir?/:query?',
      name: 'dispositivos',
      component: () => import('../views/Dispositivos.vue'),
      meta: { requiresAuth: true, level: 5 },
    },
    {
      path: '/dispositivos',
      redirect: '/dispositivos/1'
    },

    {
      path: '/vehiculos/:page/:sort?/:dir?/:query?',
      name: 'vehiculos',
      component: () => import('../views/Vehiculos.vue'),
      meta: { requiresAuth: true, level: 1 },
    },
    {
      path: '/vehiculos',
      redirect: '/vehiculos/1'
    },

    {
      path: '/tipos/:page/:sort?/:dir?/:query?',
      name: 'tipos',
      component: () => import('../views/Tipos.vue'),
      meta: { requiresAuth: true, level: 5 },
    },
    {
      path: '/tipos',
      redirect: '/tipos/1'
    },

    {
      path: '/estados/:page/:sort?/:dir?/:query?',
      name: 'estados',
      component: () => import('../views/Jornadas.vue'),
      meta: { requiresAuth: true, level: 5 },
    },
    {
      path: '/estados',
      redirect: '/estados/1'
    },

    {
      path: '/logs/:page/:sort?/:dir?/:query?',
      name: 'logs',
      component: () => import('../views/Infracciones.vue'),
      meta: { requiresAuth: true, level: 1 },
    },
    {
      path: '/logs',
      redirect: '/logs/1'
    },

    {
      path: '/logsdtl/:id/:page/:sort?/:dir?/:query?',
      name: 'logsdtl',
      component: () => import('../views/EstDet.vue'),
      meta: { requiresAuth: true, level: 1 },
    },
    {
      path: '/logsdtl',
      redirect: '/logs/1'
    },

    {
      path: '/empresas/:page/:sort?/:dir?/:query?',
      name: 'empresas',
      component: () => import('../views/Empresas.vue'),
      meta: { requiresAuth: true, level: 5 },
    },
    {
      path: '/empresas',
      redirect: '/empresas/1'
    },

    {
      path: '/usuarios/:page/:sort?/:dir?/:query?',
      name: 'usuarios',
      component: () => import('../views/Usuarios.vue'),
      meta: { requiresAuth: true, level: 10 },
    },
    {
      path: '/usuarios',
      redirect: '/usuarios/1'
    },
    
    {
      path: '/mapa',
      name: 'mapa',
      component: () => import('../views/Mapa.vue'),
      meta: { requiresAuth: true, level: 1 },
    },
    
    {
      path: '/mapainter',
      name: 'mapainter',
      component: () => import('../views/MapaInt.vue'),
      meta: { requiresAuth: true, level: 1 },
    },
    {
      path: '/horario/:page/:sort?/:dir?/:query?',
      name: 'horario',
      component: () => import('../views/Horario.vue'),
      meta: { requiresAuth: true, },
    },
    {
      path: '/horario',
      redirect: '/horario/'
    },
    {
      path: '/conductoresRegistrados/:page/:sort?/:dir?/:query?',
      name: 'conductoresRegistrados',
      component: () => import('../views/conductoresRegistrados.vue'),
      meta: { requiresAuth: true, },
    },
    {
      path: '/condutoresRegistrados',
      redirect: '/condutoresRegistrados/'
    },
    
  ]
})

export default router
