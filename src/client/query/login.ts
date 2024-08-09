import axios from 'axios';
const create = axios.create();
import {serverHeaders, serverURL} from '../../stuff'
import { loginProps } from '../types/login';

export const adminLogin = (data: loginProps) => {
    return create.post(serverURL + '/c1/login', data);
}
export const verifyotp = (data: loginProps) => {
    return create.post(serverURL + '/c1/verifyotp', data);
}
export const changePassword = (data: any) => {
    return create.post(serverURL + '/change-password', data, {params: serverHeaders});
}

export const investGold = (data: any) => {
    return create.post(serverURL + '/c1/investNow', data);
}
export const confirmInvest = (data: any) => {
    return create.post(serverURL + '/c1/confirm-order', data);
}

export const downloadInvoice = (data: string) => {
    return create.get(serverURL + '/c1/get-invoice?id='+ data);
}

export const getGoldPrice = () => {
    return create.get(serverURL + '/get-gold-price');
}

export const sellGold = (data:any) => {
    return create.post(serverURL + '/c1/sell-gold', data);
}