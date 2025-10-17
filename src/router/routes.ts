import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('pages/AuthPage.vue'),
      },
      {
        path: '/register/student',
        name: 'register-student',
        component: () => import('pages/RegisterStudentPage.vue'),
      },
      {
        path: '/register/participant',
        name: 'register-participant',
        component: () => import('pages/RegisterParticipantPage.vue'),
      },
      {
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        component: () => import('pages/AdminDashboard.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: '/Estudante/dashboard',
        name: 'Estudante-dashboard',
        component: () => import('pages/EstudanteDashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/participant/dashboard',
        name: 'participant-dashboard',
        component: () => import('pages/ParticipantDashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/surveys',
        name: 'surveys',
        component: () => import('pages/SurveysPage.vue'),
      },
      {
        path: '/pricing',
        name: 'pricing',
        component: () => import('pages/PricingPage.vue'),
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('pages/AboutPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
