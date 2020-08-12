import * as actionTypes from '../actions/actionTypes';

const initialState = {
    pharmacy_id: null,
    token: null,
    status: null,
    pharmacy_code: null,
    pharmacy_desc: null,
    owner_name: null,
    //communication: null,
    nif: null,
    phone_number: null,
    street: null,
    zip_code: null,
    locality: null,
    // municipality: null,
    // province: null,
    country: null,
    email: null,
    web: null,
    facebook: null,
    instagram: null,
    whatsapp: null,
    //icon: null,
    eth_address: null,
};

const setData = (state, action) => {
    return {
        ...state,
        ...{pharmacy_id: action.pharmacy_id, 
            token: action.token, 
            status: action.status, 
            pharmacy_code: action.pharmacy_code, 
            pharmacy_desc: action.pharmacy_desc, 
            owner_name: action.owner_name, 
            nif: action.nif, 
            phone_number: action.phone_number, 
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
        }
    }
}

const setToken = (state, action) => {
    return {
        ...state,
        ...{token: action.token}
    }
}

const updateData = (state, action) => {
    return {
        ...state,
        ...{pharmacy_id: action.pharmacy_id, 
            token: action.token, 
            pharmacy_desc: action.pharmacy_desc, 
            phone_number: action.phone_number, 
            email: action.email, 
        }
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_DATA: return setData(state, action);
        case actionTypes.UPDATE_DATA: return updateData(state, action);
        case actionTypes.SET_TOKEN: return setToken(state, action);
        default: return state;
    }
};

export default reducer;
