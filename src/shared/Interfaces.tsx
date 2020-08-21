
export interface Pharmacy {
    communication: string,
    country: string,
    creation_date: Date,
    email: string,
    facebook: string,
    gps_latitude: number,
    gps_longitude: number,
    instagram: string,
    locality: string,
    municipality: string,
    nif: string,
    opening_hours: string,
    owner_name: string,
    password: string,
    pharmacy_code: string,
    pharmacy_desc: string,
    pharmacy_id: number,
    phone: string,
    street: string,
    province: string,
    status: number,
    token: string,
    update_date: Date,
    web: string,
    whatsapp: string,
    zip_code: string,
    eth_address: string
    /* extra */
    favPharmacyID: number,
    favPharmacyDesc: string,
    favPharmacyEthAddress: string,
}

export interface Filter {
    grey: boolean,
    red: boolean,
    yellow: boolean,
    green: boolean
}

export interface Order {
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
}
