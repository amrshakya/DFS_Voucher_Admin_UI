import { LocalStorage } from "quasar";
import { api } from "boot/axios";
import { ability, defineAbilityForUser } from "boot/casl";

export function SET_LOGGEDIN(state, data) {
  state.loggedIn = data;
}

export function SET_ACCESS_TOKEN(state, token) {
  state.authorization = token;
  LocalStorage.set("authorization", token);
  api.defaults.headers.common["authorization"] = token;
}

export function SET_REFRESH_TOKEN(state, token) {
  state.refreshtoken = token;
  LocalStorage.set("refreshtoken", token);
  api.defaults.headers.common["refreshtoken"] = token;
}

export function DEL_TOKEN(state) {
  console.log('DELTOKEN');
  LocalStorage.remove("authorization");
  LocalStorage.remove("refreshtoken");
}

export function SET_ME(state, data) {
  state.me = { ...data };
  ability.update(defineAbilityForUser(state.me));
}

export function SET_PERMISSION(state, data) {
  if (data.name != state.me.role) return;
  state.me.permissions = data.permissions;
  ability.update(defineAbilityForUser(state.me));
}
