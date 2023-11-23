export function SET_PRODUCT(state, response) {
  state.products = response.data.records;
  if (response.data.meta != undefined)
    state.pagination = {
      page: response.data.meta.current_page,
      rowsPerPage: response.data.meta.per_page,
      rowsNumber: response.data.meta.total,
    };
}

export function ADD_PRODUCT(state, data) {
  let products = state.products.concat(data);
  state.products = products;
}

export function EDIT_PRODUCT(state, data) {
  let index = state.products.findIndex((p) => p.Id == data.Id);
  if (index != -1) {
    state.products[index] = data;
  }
}
