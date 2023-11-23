import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";
import { LocalStorage } from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const baseURL = process.env.NODE_ENV === 'development' ? process.env.API : 'api';
const api = axios.create({ baseURL: baseURL });

export default boot(({ app, router, store }) => {
  api.interceptors.response.use(
    (response) => {
      if (
        response.config.method != "get" &&
        !response.config.url.match(/\/auth\//)
      ) {
        Notify.create({
          message: response.data.message || response.data.msg,
          type: "positive",
        });
      }

      const ls_authorization = LocalStorage.getItem("authorization");
      const ls_refreshtoken = LocalStorage.getItem("refreshtoken");
      const res_authorization = response.headers.authorization;
      const res_refreshtoken = response.headers.refreshtoken;
      if (res_authorization && (res_authorization !== ls_authorization)) {
        store.commit("AUTH/SET_ACCESS_TOKEN", res_authorization);
      }
      if (res_refreshtoken && (res_refreshtoken !== ls_refreshtoken)) {
        store.commit("AUTH/SET_REFRESH_TOKEN", res_refreshtoken);
      }

      return response.data;
    },
    async function (error) {
      const response = { ...error }.response;
      Notify.create({
        message: response.data.message || response.data.msg,
        type: "negative",
      });
      const authRequired = router.currentRoute.value.meta?.requiresAuth;
      if (authRequired && response.data?.code === "common.unauthorized") {
        await store.dispatch("AUTH/RESET_SESSION");
        router.push({ name: "auth.login" });
      }

      return response.data;
    }
  );

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
