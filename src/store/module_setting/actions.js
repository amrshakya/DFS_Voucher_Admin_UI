import { api } from "boot/axios";

export async function INDEX({ commit, state }, data) {
  const response = await api.get(state.route.index.path, { params: data });
  if (response.code == "common.success") {
    if (data?.key) {
      commit("ADD_SETTING", { key: data.key, data: response.data });
    } else {
      for (let s of response.data) {
        commit("ADD_SETTING", { key: s.key, data: s.value });
      }
    }
  }
  return response;
}

export async function CREATE({ commit, state }, data) {
  const response = await api.post(state.route.create.path, data);
  if (response.code == "common.success") {
    commit("ADD_SETTING", response.data);
  }
  return response;
}

export async function EDIT({ commit, state }, data) {
  const response = await api.put(
    state.route.edit.path.replace(":setting", data.key),
    data.form
  );
  if (response.code == "common.success") {
    commit("ADD_SETTING", { key: data.key, data: response.data });
  }
  return response;
}

export async function DESTROY({ commit, state }, key) {
  const response = await api.delete(
    state.route.destroy.path.replace(":setting", key)
  );
  if (response.code == "common.success") {
    commit("DELETE_SETTING", key);
  }
  return response;
}
