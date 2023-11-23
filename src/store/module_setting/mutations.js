export function ADD_SETTING(state, data) {
  state.settings[data.key] = data.data;
}

export function DELETE_SETTING(state, key) {
  delete state.settings[key];
}
