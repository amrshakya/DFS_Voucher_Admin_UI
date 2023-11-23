export function GET_SETTINGS(state) {
  return state.settings;
}

export function GET_KEY(state) {
  return (key) => state.settings[key] || null;
}

export function GET_CURRENCY(state) {
  return Object.keys(state.settings["currency"]?.currency || []);
}

export function GET_ROUTE(state) {
  return state.route;
}
