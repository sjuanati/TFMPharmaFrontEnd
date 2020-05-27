import * as actionTypes from '../actions/actionTypes';

const initialState = {
  modifiedOrder: false,
  ordersPage: false
};

// Set Modified
const setModifiedOrder = (state, action) => {
  state.modifiedOrder = action.modifiedOrder;
  return state;
};

// Set OrdersPage
const setOrdersPage = (state, action) => {
  state.ordersPage = action.ordersPage;
  return state;
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MODIFIED_ORDER: return setModifiedOrder(state, action);
    case actionTypes.SET_ORDERS_PAGE: return setOrdersPage(state, action);
    default: return state;
  }
};

export default reducer;