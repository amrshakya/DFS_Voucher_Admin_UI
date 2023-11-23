import { boot } from "quasar/wrappers";

const env = {
  APP_NAME: process.env.APP_NAME,
};

export default boot(({ app }) => {
  app.config.globalProperties.$env = env;
});

export { env };
