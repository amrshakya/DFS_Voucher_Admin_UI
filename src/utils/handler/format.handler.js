import { isObject, mapKeys } from "lodash";

export function formatNumber(string, removeDecimal = false) {
  const res =  parseFloat(string).toLocaleString('en', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  if (removeDecimal) {
    return res.split('.')[0];
  }
  return res;
}

export function convertKeysToLowerCase(obj) {
  if (isObject(obj)) {
    return mapKeys(obj, (value, key) => {
      // Check if the key is an acronym (all uppercase)
      if (key === key.toUpperCase()) {
        return key.toLowerCase();
      } else {
        // Convert only the first character to lowercase
        return key.charAt(0).toLowerCase() + key.slice(1);
      }
    });
  }
  return obj;
}
