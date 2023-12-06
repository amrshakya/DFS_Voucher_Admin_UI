import { api } from "boot/axios";
import { LocalStorage } from "quasar";
import { ability, defineAbilityForGuest } from "boot/casl";

export async function LOGIN({ commit }, data) {
  const response = await api.post("/operator/authenticate/login", data);
  if (response.code == "common.success") {
    commit("SET_ACCESS_TOKEN", response.data.authorization);
    commit("SET_REFRESH_TOKEN", response.data.refreshtoken);
  } else {
    commit("SET_LOGGEDIN", false);
    return response;
  }
  commit("SET_LOGGEDIN", true);
  commit("SET_ME", response.data.admin);
  return response;
}

export async function LOGOUT({ dispatch }) {
  const response = await api.post("/operator/authenticate/logout");
  if (response.code == "common.success") {
    dispatch("RESET_SESSION");
  }
  return response;
}

export async function RESET_SESSION({ commit }) {
  commit("SET_LOGGEDIN", false);
  commit("DEL_TOKEN");
  ability.update(defineAbilityForGuest());
}

export async function ME({ commit, state }) {
  const response = await api.post("/operator/authenticate/checkLogin");
  if (response.code == "common.success") {
    commit("SET_ME", response.data);
    commit("SET_LOGGEDIN", true);
    return response;
  }

  commit("SET_LOGGEDIN", false);
  return response;
}

export async function CHECK({ commit, state, getters }, to) {
  const authorization = LocalStorage.getItem("authorization");
  const refreshtoken = LocalStorage.getItem("refreshtoken");
  if (!state.loggedIn && authorization != null && refreshtoken != null) {
    commit("SET_ACCESS_TOKEN", authorization);
    commit("SET_REFRESH_TOKEN", refreshtoken);
    await ME({ commit, state });
  }
  return ability.can("read", to.name);
}

export async function UPDATE({ commit }, data) {
  const response = await api.put("/auth/update", data);
  if (response.code == "common.success") {
    commit("SET_ME", response.data);
  }
  return response;
}

export async function RESET_PASSWORD({ commit }, data) {
  const response = await api.put("/auth/reset_password", data);
  if (response.code == "common.success") {
    commit("SET_ME", response.data);
  }
  return response;
}

export async function ONESIGNAL({}, data) {
  const response = await api.post("/auth/onesignal", data);
  return response;
}
