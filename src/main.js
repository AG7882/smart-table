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
  sampleTable.pagination.elements,
  (el, page, isCurrent) => {
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

/*const filterContainer = sampleTable.header.elements.filters;
console.log('📦 indexes:', indexes);
console.log('📦 elements:', sampleTable.header.elements); 
const applyFiltering = initFiltering(sampleTable.header.elements, indexes);*/

const filterContainer =
  (sampleTable.filter && sampleTable.filter.container) ||
  (sampleTable.header && sampleTable.header.container) ||
  sampleTable.container;

// 2. Ищем элементы внутри найденного контейнера
const filterElements = {
  seller:
    filterContainer.querySelector('select[name="seller"]') ||
    filterContainer.querySelector('select[name="sellerField"]') ||
    filterContainer.querySelector('[data-field="seller"]'),

  customer:
    filterContainer.querySelector('select[name="customer"]') ||
    filterContainer.querySelector('select[name="customerField"]') ||
    filterContainer.querySelector('[data-field="customer"]'),
};

// 3. Передаем объект в инициализацию фильтрации
const applyFiltering = initFiltering(filterElements, indexes);
render();

const clearButtons = document.querySelectorAll(
  '[data-action="clear"], button[name="clear"]',
);

clearButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const realButton = event.target.closest("button");
    if (!realButton) return;

    if (realButton.name !== "clear" && realButton.dataset.action !== "clear") {
      return;
    }

    const parent = realButton.parentElement;
    const input = parent.querySelector("input");

    if (input) {
      input.value = "";
    }

    render();
  });
});

render();
