import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Profile from "./components/Profile";
import store from "./store";

Vue.use(VueRouter);


const isLoggedIn = (to, from, next) => {
    if (store.getters["user/isLoggedIn"]) {
        next();
    } else if (store.getters["user/isLoggedIn"] === null) {
        const unsubscribe = store.subscribe(mutation => {
            if (mutation.type === "user/refreshTokenSuccess") {
                next();
            } else if (mutation.type === "user/refreshTokenError") {
                router.push("/signin");
            }
            unsubscribe();
        });
    } else {
        router.push("/signin");
    }
};

const router = new VueRouter({
    mode: "history",
    routes: [
        { path: "/", component: Home },
        { path: "/signup", component: Signup },
        { path: "/signin", component: Signin },
        {
            path: "/profile",
            beforeEnter: isLoggedIn,
            component: Profile
        }
    ]
});


export default router;