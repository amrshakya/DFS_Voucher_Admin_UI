export default function () {
  return {
    admins: [],
    pagination: {
      page: 1,
      rowsPerPage: 50,
    },
    route: {
      list: {
        action: "ADMIN/INDEX",
        path: "/operator",
      },
      create: {
        action: "ADMIN/CREATE",
        path: "/operator",
        permission: "admin.operator.store",
      },
      update_status: {
        action: "ADMIN/UPDATE_STATUS",
        path: "/operator/status/:id",
        permission: "admin.operator.status.edit",
      },
      assign_group: {
        action: "ADMIN/ASSIGN_GROUP",
        path: "/operator/assign/group/:id",
        permission: "admin.operator.assign.group.edit"
      },
      // activity: {
      //   permission: "admin.activity_logs.index",
      // },
      reset_password: {
        action: "ADMIN/RESET_PASSWORD",
        path: "/operator/reset_password/:id",
        permission: "admin.operator.reset_password.edit",
      },
    },
  };
}
