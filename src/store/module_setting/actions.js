import { api } from "boot/axios";

export async function CURRENCY_LIST({ commit, state}, data) {
  const response = await api.get(state.route.currencyList.path);
  if (response.code === "common.success") {
    commit("ADD_CURRENCY_LIST", response.data);
  }
  return response;
}
