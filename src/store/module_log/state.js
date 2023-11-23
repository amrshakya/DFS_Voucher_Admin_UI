export default function () {
  return {
    logs: [],
    logItems: [],
    route: {
      index: {
        action: "LOG/INDEX",
        path: "/logs",
      },
      show: {
        action: "LOG/SHOW",
        path: "/logs/:log",
        permission: "admin.logs.show",
      },
      destroy: {
        action: "LOG/DESTROY",
        path: "/logs/:log",
        permission: "admin.logs.destroy",
      },
    },
  };
}
