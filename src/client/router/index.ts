import { RouteNameEnum } from '@/enums/router.enum.ts';
import middlewarePipeline from '@/router/middlewarePipeline.ts';
import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw
} from 'vue-router';

interface IContext {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  next: NavigationGuardNext;
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: RouteNameEnum.Home,
    component: () => import('@/views/home.view.vue')
  },
  {
    path: '/contacts',
    name: RouteNameEnum.Contacts,
    component: () => import('@/views/contacts.view.vue')
  },
  {
    path: '/contacts/:id',
    name: RouteNameEnum.Contact,
    component: () => import('@/views/contact.view.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next();
  }
  const middleware: any = to.meta.middleware;

  const context: IContext = {
    to,
    from,
    next
  };

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  });
});

export default router;
