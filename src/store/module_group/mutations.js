export function SET_GROUP(state, response) {
  state.groups = response.data.records;
}

export function ADD_GROUP(state, data) {
  let groups = state.groups.concat(data);
  state.groups = groups;
}

export function DELETE_GROUP(state, id) {
  let groups = state.groups.filter((v) => v.id != id);
  state.groups = groups;
}

export function EDIT_GROUP(state, data) {
  let index = state.groups.findIndex((p) => p.id == data.id);
  if (index != -1) {
    state.groups[index] = data;
  }
}

export function ADD_ALLOWED_PRIVILEGE(state, data) {
  state.allowed_access = data;
}

export function ADD_PRIVILEGE_LIST(state, data) {
  state.privilege_list = data;
}
