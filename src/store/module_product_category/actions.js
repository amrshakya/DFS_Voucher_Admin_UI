import { api } from "boot/axios";

export async function INDEX({ commit, state }, data) {
  const response = await api.get(state.route.list.path, { params: data });
  if (response.code == "common.success") {
    commit("SET_CATEGORY", response);
  }
  return response;
}

export async function CREATE({ commit, state }, data) {
  const response = await api.post(state.route.create.path, data);
  if (response.code == "common.success") {
    commit("ADD_CATEGORY", response.data);
  }
  return response;
}

export async function EDIT({ commit, state }, data) {
  const response = await api.put(
    state.route.edit.path.replace(":id", data.id),
    data.form
  );
  if (response.code == "common.success") {
    commit("EDIT_CATEGORY", response.data);
  }
  return response;
}
