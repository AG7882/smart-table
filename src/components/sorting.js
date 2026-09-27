import { sortCollection } from "../lib/sort.js";

export function initSorting(columns) {

  
  return (data, state, action) => {

    let field = state.field; 
    let order = state.order;

    if (action && action.name === "sort") {
     
      
      field = action.field;
      
    
      if (state.field === field) {
        order = state.order === 'asc' ? 'desc' : 'asc';
      } else {
       
        order = 'asc';
      }
    }

   
    return sortCollection(data, field, order);
  };
}