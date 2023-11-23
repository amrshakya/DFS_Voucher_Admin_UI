import { api } from "boot/axios";

export async function INDEX({ commit, state }, data) {
  const response = await api.get(state.route.list.path, { params: data });
  if (response.code == "common.success") {
    commit("SET_MERCHANTS", response);
  }
  return response;
}

export async function CREATE({ commit, state }, data) {
  const response = await api.post(state.route.create.path, data);
  if (response.code == "common.success") {
    commit("ADD_MERCHANT", response.data);
  }
  return response;
}

export async function UPDATE_STATUS({ commit, state }, data) {
  const response = await api.put(
    state.route.update_status.path.replace(":merchant_id", data.id),
    data.form
  );
  if (response.code == "common.success") {
    commit("EDIT_MERCHANT", response.data);
  }
  return response;
}

export async function REVOKE_KEYS({ commit, state }, data) {
  const response = await api.put(
    state.route.revoke_keys.path.replace(":merchant_id", data.id),
    data.form
  );
  if (response.code == "common.success") {
    commit("EDIT_MERCHANT", response.data);
  }
  return response;
}
