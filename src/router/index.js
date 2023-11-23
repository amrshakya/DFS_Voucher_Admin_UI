import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store, ssrContext }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach(async function (to, from, next) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    const value = await store.dispatch("AUTH/CHECK", to);
    if (!value) {
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        return next({ name: "auth.login" });
      } else {
        return next({ name: "admin.home.index" });
      }
    } else {
      return next();
    }
  });

  // add page name to body class, remove previous page name from body class
  // add to to history stack
  Router.afterEach((to, from) => {
    let fromClass = from.path.replaceAll("/", "");
    if (fromClass.length) {
      document.body.classList.remove(fromClass);
    }
    let toClass = to.path.replaceAll("/", "");
    if (toClass) {
      document.body.classList.add(toClass);
    }
    store.commit("UI/ADD_HISTORY_ROUTE", to);
  });

  return Router;
});
