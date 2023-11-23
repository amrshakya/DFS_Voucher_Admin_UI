export default function () {
  return {
    groups: [],
    privilege_list: [],
    allowed_access: [],
    route: {
      index: {
        action: "GROUP/INDEX",
        path: "/operator/group",
      },
      destroy: {
        action: "GROUP/DESTROY",
        path: "/operator/group/:groupIdx",
        permission: "admin.operator.group.destroy",
      },
      get_privilege: {
        actions: "GROUP/GET_PRIVILEGE",
        path: "/operator/privilege?groupIdx=:groupIdx"
      },
      set_privilege: {
        action: "GROUP/SET_PRIVILEGE",
        path: "/operator/privilege/:id",
        permission: "admin.operator.privilege.edit"
      }
    },
  };
}
