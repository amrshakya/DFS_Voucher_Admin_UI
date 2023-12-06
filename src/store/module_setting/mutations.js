import { map, uniq } from "lodash";

export function ADD_CURRENCY_LIST(state, data) {
  state.currencyList =  map(
    data,
    ele => ({ label: `${ele.Country} - ${ele.Currency}`, value: { Currency: ele.Currency, Country: ele.Country} })
  );

  state.currency = uniq(map(data, 'Currency'));
  state.country = uniq(map(data, 'Country'));
}
