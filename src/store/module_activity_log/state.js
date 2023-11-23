export default function () {
  return {
    activity_logs: [],
    pagination: {
      sortBy: "id",
      descending: true,
      page: 1,
      rowsPerPage: 50,
    },
    filter: {},
    types: [],
    route: {
      list: {
        action: "ACTIVITY_LOG/INDEX",
        path: "/activity_logs",
      },
      destroy: {
        action: "ACTIVITY_LOG/DESTROY",
        path: "/activity_logs/:activity_log",
        permission: "admin.activity_logs.destroy",
      },
      type: {
        action: "ACTIVITY_LOG/TYPE",
        path: "/activity_logs/type",
      },
    },
  };
}
