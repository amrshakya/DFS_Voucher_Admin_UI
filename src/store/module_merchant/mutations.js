export function SET_MERCHANTS(state, response) {
  state.merchants = response.data.records;
  if (response.data.meta != undefined)
    state.pagination = {
      page: response.data.meta.current_page,
      rowsPerPage: response.data.meta.per_page,
      rowsNumber: response.data.meta.total,
    };
}

export function ADD_MERCHANT(state, data) {
  let merchants = state.merchants.concat(data);
  state.merchants = merchants;
}

export function EDIT_MERCHANT(state, data) {
  let index = state.merchants.findIndex((p) => p.Id == data.Id);
  if (index != -1) {
    state.merchants[index] = data;
  }
}
