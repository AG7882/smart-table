import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение
import { initSorting } from "./components/sorting.js";
import { initPagination } from "./components/pagination.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";
// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));

  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */

function render(action) {
  let state = collectState();
  let result = [...data];
  if (action && action.name === "sort") {
    const clickedField = action.dataset.field;

    if (state.field === clickedField) {
      state.order = state.order === "asc" ? "desc" : "asc";
    } else {
      state.field = clickedField;
      state.order = "asc";
    }

    columns.forEach((col) => {
      if (col.dataset.field === clickedField) {
        const current = col.dataset.value;
        let nextValue;

        if (current === "asc") {
          nextValue = "desc";
        } else if (current === "desc") {
          nextValue = "none";
        } else {
          nextValue = "asc";
        }

        col.dataset.value = nextValue;
      } else {
        col.dataset.value = "none";
      }
    });
  }

  result = applySorting(result, state, action);

  result = applyPagination(result, state, action);

  sampleTable.render(result);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render,
);

// @todo: инициализация
const columns = [
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
];

const applySorting = initSorting(columns);

const applyPagination = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  },
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

const searchInput = sampleTable.header.elements.searchField;
const applySearching = initSearching(searchInput);

const filterContainer = sampleTable.header.elements.filters;

const applyFiltering = initFiltering(sampleTable.header.elements, indexes);

render();
