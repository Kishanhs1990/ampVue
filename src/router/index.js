import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/storage",
    name: "Storage",
    component: () => import("../views/Storage.vue"),
  },
  {
    path: "/dataStore",
    name: "DataStore",
    component: () => import("../views/DataStore.vue"),
  },
  {
    path: "/authentication",
    name: "Authentication",
    component: () => import("../views/Authentication.vue"),
  },
  {
    path: "/restApi",
    name: "RestApi",
    component: () => import("../views/RestApi.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
