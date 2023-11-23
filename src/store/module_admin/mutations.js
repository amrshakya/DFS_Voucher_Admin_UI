export function SET_ADMINS(state, response) {
  state.admins = response.data.records;
  if (response.data.meta != undefined)
    state.pagination = {
      page: response.data.meta.current_page,
      rowsPerPage: response.data.meta.per_page,
      rowsNumber: response.data.meta.total,
    };
}

export function ADD_ADMIN(state, data) {
  let admins = state.admins.concat(data);
  state.admins = admins;
}

export function EDIT_ADMIN(state, data) {
  let index = state.admins.findIndex((p) => p.Id == data.Id);
  if (index != -1) {
    state.admins[index] = data;
  }
}
