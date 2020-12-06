import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SearchUsers from "../views/SearchUsers.vue";
import SearchTopics from "../views/SearchTopics.vue";
import User from "../views/User.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/find-user",
    name: "find-user",
    component: SearchUsers
  },
  {
    path: "/find-topic",
    name: "find-topic",
    component: SearchTopics
  },
  {
    path: "/users/:userName",
    name: "users",
    component: User
  },
  {
    // will match everything
    path: "*",
    component: Home
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
