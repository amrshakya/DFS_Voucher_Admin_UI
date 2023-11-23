import { api } from "boot/axios";

export async function INDEX({ commit, state }) {
  const response = await api.get(state.route.index.path);
  if (response.code == "common.success") {
    commit("SET_GROUP", response);
  }
  return response;
}

export async function CREATE({ commit, state }, data) {
  const response = await api.post(state.route.create.path, data);
  if (response.code == "common.success") {
    commit("ADD_GROUP", response.data);
  }
  return response;
}

export async function EDIT({ commit, state }, data) {
  const response = await api.put(
    state.route.edit.path.replace(":permission", data.id),
    data.form
  );
  if (response.code == "common.success") {
    commit("EDIT_GROUP", response.data);
  }
  return response;
}

export async function DESTROY({ commit, state }, id) {
  const response = await api.delete(
    state.route.destroy.path.replace(":groupIdx", id)
  );
  if (response.code == "common.success") {
    commit("DELETE_GROUP", id);
  }
  return response;
}

export async function GET_PRIVILEGE ({ commit, state}, groupIdx) {
  const response = await api.get(
    state.route.get_privilege.path.replace(":groupIdx", groupIdx)
  );
  if (response.code == "common.success") {
    commit("ADD_ALLOWED_PRIVILEGE", response.data.allowedAccess);
    commit("ADD_PRIVILEGE_LIST", response.data.list);
  }
  return response;
}

export async function SET_PRIVILEGE({ commit, state}, data) {
  const response = await api.put(
    state.route.set_privilege.path.replace(":id", data.id),
    data.form
  )
  if (response.code == "common.success") {
    commit("ADD_ALLOWED_PRIVILEGE", response.data);
  }
  return response
}
