import { api } from "boot/axios";

export async function INDEX({ commit, state }) {
  const response = await api.get(state.route.index.path);
  if (response.code == "common.success") {
    commit("SET_LOGS", response.data);
  }
  return response;
}

export async function SHOW({ commit, state }, { date, form }) {
  const response = await api.get(state.route.show.path.replace(":log", date), {
    params: form,
  });
  if (response.code == "common.success") {
    commit("SET_LOGITEMS", response.data);
  }
  return response;
}

export async function DESTROY({ commit, state }, date) {
  const response = await api.delete(
    state.route.destroy.path.replace(":log", date)
  );
  if (response.code == "common.success") {
    commit("DELETE_LOGS", date);
  }
  return response;
}
