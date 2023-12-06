export default function () {
  return {
    currencyList: [],
    currency: [],
    country: [],
    route: {
      currencyList: {
        action: "SETTING/CURRENCY_LIST",
        path: "/system/currency/getList"
      }
    },
  };
}
