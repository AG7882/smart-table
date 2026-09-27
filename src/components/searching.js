import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  return (data, state, action) => {
    const query = (state.query || "").toLowerCase().trim();

    if (!query) {
      return data;
    }

    return data.filter((row) => {
      return Object.values(row).some((value) => {
        const text = String(value).toLowerCase();
        return text.includes(query);
      });
    });
  };
}
