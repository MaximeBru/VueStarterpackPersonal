import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Profile from "./components/Profile";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        { path: "/", component: Home },
        { path: "/signup", component: Signup },
        { path: "/signin", component: Signin },
        { path: "/profile", component: Profile }
    ]
});

export default router;