export default function () {
  return {
    settings: {},
    route: {
      index: {
        action: "SETTING/INDEX",
        path: "/settings",
      },
      create: {
        action: "SETTING/CREATE",
        path: "/settings",
      },
      edit: {
        action: "SETTING/EDIT",
        path: "/settings/:setting",
        permission: "admin.settings.update",
      },
      destroy: {
        action: "SETTING/DESTROY",
        path: "/settings/:setting",
      },
    },
  };
}
