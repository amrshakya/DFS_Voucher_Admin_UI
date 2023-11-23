import { store } from "quasar/wrappers";
import { createStore } from "vuex";

import ADMIN from "./module_admin";
import GROUP from "./module_group";
import AUTH from "./module_auth";
import MERCHANT from "./module_merchant";
import MERCHANT_TRANSACTION from "./module_merchant_transaction";
import PRODUCT from "./module_product";
import PRODUCT_CATEGORY from "./module_product_category";
import SETTING from "./module_setting";
import UI from "./module_ui";
import LOG from "./module_log";
import ACTIVITY_LOG from "./module_activity_log";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      ADMIN,
      GROUP,
      AUTH,
      MERCHANT,
      MERCHANT_TRANSACTION,
      PRODUCT,
      PRODUCT_CATEGORY,
      SETTING,
      UI,
      LOG,
      ACTIVITY_LOG,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
