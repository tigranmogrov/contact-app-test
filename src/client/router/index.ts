import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

export enum RouteName {
  Home = 'home',
  Contacts = 'contacts',
  Contact = 'contact'
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: RouteName.Home,
    component: () => import('@/views/home.view.vue')
  },
  {
    path: '/contacts',
    name: RouteName.Contacts,
    component: () => import('@/views/contacts.view.vue')
  },
  {
    path: '/contacts/:id',
    name: RouteName.Contact,
    component: () => import('@/views/contact.view.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
