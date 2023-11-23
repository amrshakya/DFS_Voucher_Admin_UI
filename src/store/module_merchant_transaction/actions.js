import { api } from "boot/axios";

export async function INDEX({ commit, state }, data) {
  const response = await api.get(state.route.list.path, { params: data });
  if (response.code == "common.success") {
    commit("SET_MERCHANTS_TRANSACTION", response);
  }
  return response;
}

export async function UPDATE_STATUS({ commit, state }, data) {
  const response = await api.put(
    state.route.update_status.path.replace(":merchant_id", data.id),
    data.form
  );
  if (response.code == "common.success") {
    commit("EDIT_MERCHANTS_TRANSACTION", response.data);
  }
  return response;
}

export async function EXPORT({ commit, state}, data) {
  const response = await api.get(state.route.export.path, {
    params: data
  });
  return response;
}
