import { api } from "boot/axios";

export async function INDEX({ commit, state }, data) {
  const response = await api.get(state.route.list.path, { params: data });
  if (response.code == "common.success") {
    commit("SET_ACTIVITY_LOGS", response);
  }
  return response;
}

export async function TYPE({ commit, state }) {
  const response = await api.get(state.route.type.path);
  if (response.code == "common.success") {
    commit("SET_TYPE", response.data);
  }
  return response;
}

export async function DESTROY({ commit, state }, id) {
  const response = await api.delete(
    state.route.destroy.path.replace(":activity_log", id)
  );
  if (response.code == "common.success") {
    commit("DELETE_ACTIVITY_LOG", id);
  }
  return response;
}
