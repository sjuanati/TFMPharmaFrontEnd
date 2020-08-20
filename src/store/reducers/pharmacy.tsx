import * as actionTypes from '../actions/actionTypes';

interface Status {
    pharmacy_id: number,
    token: string,
    status: number,
    pharmacy_code: string,
    pharmacy_desc: string,
    owner_name: string,
    nif: string,
    phone: string,
    street: string,
    zip_code: string,
    locality: string,
    country: string,
    email: string,
    web: string,
    facebook: string,
    instagram: string,
    whatsapp: string,
    eth_address: string,
}

interface Action extends Status {
    type: string,
}

const initialState = {
    pharmacy_id: 0,
    token: '',
    status: 0,
    pharmacy_code: '',
    pharmacy_desc: '',
    owner_name: '',
    nif: '',
    phone: '',
    street: '',
    zip_code: '',
    locality: '',
    country: '',
    email: '',
    web: '',
    facebook: '',
    instagram: '',
    whatsapp: '',
    eth_address: '',
};

const setData = (state: Status, action: Action) => {
    return {
        ...state,
        ...{
            pharmacy_id: action.pharmacy_id,
            token: action.token,
            status: action.status,
            pharmacy_code: action.pharmacy_code,
            pharmacy_desc: action.pharmacy_desc,
            owner_name: action.owner_name,
            nif: action.nif,
            phone: action.phone,
            email: action.email,
            web: action.web,
            street: action.street,
            zip_code: action.zip_code,
            locality: action.locality,
            country: action.country,
            facebook: action.facebook,
            instagram: action.instagram,
            whatsapp: action.whatsapp,
            eth_address: action.eth_address,
        },
    };
};

const setToken = (state: Status, action: Action) => {
    return {
        ...state,
        ...{ token: action.token },
    };
};

const updateData = (state: Status, action: Action) => {
    return {
        ...state,
        ...{
            pharmacy_id: action.pharmacy_id,
            token: action.token,
            pharmacy_desc: action.pharmacy_desc,
            phone: action.phone,
            email: action.email,
        },
    };
};

const reducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.SET_DATA: return setData(state, action);
        case actionTypes.UPDATE_DATA: return updateData(state, action);
        case actionTypes.SET_TOKEN: return setToken(state, action);
        default: return state;
    }
};

export default reducer;
