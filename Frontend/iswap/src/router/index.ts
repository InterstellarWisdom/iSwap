import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/Home.vue"),
  },
  {
    path: "/pool",
    name: "pool",
    component: () => import("@/views/pool/Pool.vue"),
  },
  {
    path: "/create",
    name: "create",
    component: () => import("@/views/create-pair/CreatePair.vue")
  },
  {
    path: "/add-liquidity",
    name: "addLiquidity",
    component: () => import("@/views/add-liquidity/AddLiquidity.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
