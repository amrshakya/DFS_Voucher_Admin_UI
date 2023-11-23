import { api } from "boot/axios";

export async function INDEX({ commit, state }, data) {
  const response = await api.get(state.route.list.path, { params: data });
  if (response.code == "common.success") {
    commit("SET_PRODUCT", response);
  }
  return response;
}

export async function CREATE({ commit, state }, data) {
  const response = await api.post(state.route.create.path, data);
  if (response.code == "common.success") {
    commit("ADD_PRODUCT", response.data);
  }
  return response;
}

export async function EDIT({ commit, state }, data) {
  const response = await api.put(
    state.route.edit.path.replace(":id", data.id),
    data.form
  );
  if (response.code == "common.success") {
    commit("EDIT_PRODUCT", response.data);
  }
  return response;
}

export async function GET_IMAGE({ commit, state}, data) {
  const response = await api.get(state.route.list_image.path, { params: data });
  return response;
}

export async function EDIT_IMAGE({ commit, state}, data) {
  const response = await api.put(
    state.route.edit_image.path.replace(":product_id", data.id),
    data.form
  );
  return response;
}

export async function REMOVE_IMAGE({ commit, state }, id) {
  const response = await api.delete(
    state.route.remove_image.path.replace(":image_id", id)
  );
  return response;
}
