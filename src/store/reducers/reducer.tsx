import { useSelector, TypedUseSelectorHook } from 'react-redux';

// export interface RootStateOrderItems {
//   item_id: number,
//   product_id: number,
//   product_desc: string,
//   price: number,
//   dose_qty: string,
//   dose_form: string,
//   leaflet_url: string,
//   screen: string,
//   max_date: Date,
//   prescription: boolean
// }

export interface RootState {
  order: {
    comments: string,
    creation_date: Date,
    dose_form: string,
    dose_qty: string,
    item_desc: string,
    leaflet_url: string,
    name: string,
    order_id: string,
    order_id_app: number,
    order_item: number,
    pharmacy_desc: string,
    pharmacy_id: number,
    photo: string,
    prescription: true,
    price: number,
    product_desc: string,
    status: number,
    status_desc: string,
    total_price: number,
    user_id: number,
    modifiedOrder: boolean,
    ordersPage: boolean
  },
  pharmacy: {
    favPharmacyID: number,
    favPharmacyDesc: string,
    favPharmacyEthAddress: string,
    id: number,
    token: string,
    birthday: Date,
    email: string,
    gender: string,
    name: string,
    phone: string,
    address_id: number,
    user_status: number,
    address_status: number,
    street: string,
    locality: string,
    province: string,
    zip_code: string,
    country: string,
    photo: string,
    eth_address: string,
    type: string,  //redux action type
    pharmacy_desc: string, //should be <favPharmacyDesc>
    pharmacy_id: number, //should be <favPharmacyId>
    pharmacy_code: number, //should be <favPharmacyId>
    web: string,
    owner_name: string,
  },
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
