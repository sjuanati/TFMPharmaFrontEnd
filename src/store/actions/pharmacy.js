import * as actionTypes from './actionTypes';

export const setData = (pharmacy_id, token, status, pharmacy_code, pharmacy_desc, owner_name, nif, phone_number, 
                        email, web, street, zip_code, locality, country) => ({
    type: actionTypes.SET_DATA,
    pharmacy_id: pharmacy_id, 
    token: token, 
    status: status, 
    pharmacy_code: pharmacy_code, 
    pharmacy_desc: pharmacy_desc, 
    owner_name: owner_name, 
    nif: nif, 
    phone_number: phone_number, 
    email: email, 
    web: web,
    street: street,
    zip_code: zip_code,
    locality: locality,
    country: country
});

export const updateData = (pharmacy_id, token, pharmacy_desc, phone_number, email) => ({
    type: actionTypes.UPDATE_DATA,
    pharmacy_id: pharmacy_id, 
    token: token,
    pharmacy_desc: pharmacy_desc,
    phone_number: phone_number,
    email: email,
});

