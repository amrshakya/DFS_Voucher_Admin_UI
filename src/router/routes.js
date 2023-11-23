function resource(path, option = {}) {
  let routes = ["index", "show", "store", "update"].filter((v) => {
    if (option?.only?.includes(v) == false) {
      return false;
    }
    if (option?.except?.includes(v) == true) {
      return false;
    }
    return true;
  });

  return routes.map((r) => {
    const filename = r.charAt(0).toUpperCase() + r.slice(1);
    let routePath = path;
    const singular = path.split('/')[1] || path.split('/')[0];
    switch (r) {
      case "show":
        routePath = `${path}/:${singular}`;
        break;
      case "store":
        routePath = `${path}/create`;
        break;
      case "update":
        routePath = `${path}/edit/:${singular}`;
        break;
    }
    return {
      path: routePath,
      name: `admin.${path.replace(/\//g, '.')}.${r}`,
      component: () => import(`pages/${path}/${filename}.vue`),
    };
  });
}

function addRoute(path, filePath, name) {
  return {
    path: path,
    name: name,
    component: () => import(`pages/${filePath}.vue`),
  };
}

const routes = [
  addRoute("/login", "auth/Login", "auth.login"),
  {
    path: "/",
    name: "index",
    redirect: { name: "admin.home.index" },
    meta: {
      requiresAuth: true,
    },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      ...resource("home", { only: ["index"] }),
      ...resource("operator", { except: ["show", "update", "delete"] }),
      ...resource("operator/group", { only: ["index"] }),
      ...resource("merchant", { only: ["index", "store"]}),
      ...resource("merchant/transaction", { only: ["index"]}),
      ...resource("product", { except: ["show", "delete"]}),
      ...resource("product/category", { except: ["show", "delete"]}),

      // ...resource("setting", { only: ["index"] }),
      // ...resource("log", { only: ["index"] }),
      // ...resource("activity_log", { only: ["index"] }),
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/error/Error404.vue"),
  },
];

export default routes;
