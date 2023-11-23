import { api } from "boot/axios";

export async function INDEX({ commit, state }, data) {
  const response = await api.get(state.route.list.path, { params: data });
  if (response.code == "common.success") {
    commit("SET_ADMINS", response);
  }
  return response;
}

export async function CREATE({ commit, state }, data) {
  const response = await api.post(state.route.create.path, data);
  if (response.code == "common.success") {
    commit("ADD_ADMIN", response.data);
  }
  return response;
}

export async function UPDATE_STATUS({ commit, state }, data) {
  const response = await api.put(
    state.route.update_status.path.replace(":id", data.id),
    data.form
  );
  if (response.code == "common.success") {
    commit("EDIT_ADMIN", response.data);
  }
  return response;
}

export async function RESET_PASSWORD({ commit, state }, data) {
  const response = await api.put(
    state.route.reset_password.path.replace(":id", data.id),
    data.form
  );
  if (response.code == "common.success") {
    commit("EDIT_ADMIN", response.data);
  }
  return response;
}


export async function ASSIGN_GROUP({ commit, state}, data) {
  const response = await api.put(
    state.route.assign_group.path.replace(":id", data.id),
    data.form
  );
  if (response.code == "common.success") {
    commit("EDIT_ADMIN", response.data);
  }
  return response;
}
