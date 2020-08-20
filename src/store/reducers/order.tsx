import * as actionTypes from '../actions/actionTypes';

interface Status {
  modifiedOrder: boolean,
  ordersPage: boolean,
}

interface Action extends Status {
  type: string
}

const initialState = {
  modifiedOrder: false,
  ordersPage: false,
};

// Set Modified
const setModifiedOrder = (state: Status, action: Action) => {
  state.modifiedOrder = action.modifiedOrder;
  return state;
};

// Set OrdersPage
const setOrdersPage = (state: Status, action: Action) => {
  state.ordersPage = action.ordersPage;
  return state;
};

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_MODIFIED_ORDER: return setModifiedOrder(state, action);
    case actionTypes.SET_ORDERS_PAGE: return setOrdersPage(state, action);
    default: return state;
  }
};

export default reducer;
