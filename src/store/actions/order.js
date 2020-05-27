import * as actionTypes from './actionTypes';

export const setModifiedOrder = (modifiedOrder) => ({
  type: actionTypes.SET_MODIFIED_ORDER,
  modifiedOrder: modifiedOrder,
});

export const setOrdersPage = (ordersPage) => ({
  type: actionTypes.SET_ORDERS_PAGE,
  ordersPage: ordersPage,
});