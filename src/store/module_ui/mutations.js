export function SET_LEFT_DRAWER(state, value) {
  state.leftDrawer = value;
}

export function ADD_HISTORY_ROUTE(state, route) {
  if (
    ["auth.login", "admin.home.index"].includes(
      route.name
    )
  ) {
    return;
  }
  if (route.name.includes(".update")) {
    return;
  }
  let find = false;
  for (let v of state.history_routes) {
    if (v.name == route.name) {
      find = true;
      v.active = true;
      continue;
    }
    v.active = false;
  }
  if (!find) {
    state.history_routes.push({
      name: route.name,
      active: true,
      href: route.href,
    });
  }
}

export function DELETE_HISTORY_ROUTE(state, route) {
  let history_routes = state.history_routes.filter((v) => v.name != route.name);
  state.history_routes = history_routes;
}
