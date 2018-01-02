import Vue from 'vue';
import Router from 'vue-router';

import Recommend from '@/components/recommend/main';
import Singer from '@/components/singer/main';
import Rank from '@/components/rank/main';
import Search from '@/components/search/main';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend',
    },
    {
      path: '/recommend',
      component: Recommend,
    },
    {
      path: '/singer',
      component: Singer,
    },
    {
      path: '/rank',
      component: Rank,
    },
    {
      path: '/search',
      component: Search,
    },
  ],
});
