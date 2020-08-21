import * as actionTypes from './actionTypes';

export const setData = (
    pharmacy_id: number,
    token: string,
    status: number,
    pharmacy_code: string,
    pharmacy_desc: string,
    owner_name: string,
    nif: string,
    phone: string,
    email: string,
    web: string,
    street: string,
    zip_code: string,
    locality: string,
    country: string,
    eth_address: string) => ({
    type: actionTypes.SET_DATA,
    pharmacy_id: pharmacy_id,
    token: token,
    status: status,
    pharmacy_code: pharmacy_code,
    pharmacy_desc: pharmacy_desc,
    owner_name: owner_name,
    nif: nif,
    phone: phone,
    email: email,
    web: web,
    street: street,
    zip_code: zip_code,
    locality: locality,
    country: country,
    eth_address: eth_address,
});

export const setToken = (token: string) => ({
    type: actionTypes.SET_TOKEN,
    token: token,
});

export const updateData = (
    pharmacy_id: number,
    token: string,
    pharmacy_desc: string,
    phone: string,
    email: string) => ({
    type: actionTypes.UPDATE_DATA,
    pharmacy_id: pharmacy_id,
    token: token,
    pharmacy_desc: pharmacy_desc,
    phone: phone,
    email: email,
});
