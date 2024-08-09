import axios from 'axios';
const create = axios.create();
import {serverHeaders, serverURL} from '../../stuff'
import { ContactSupportProp, profileProps } from '../types/profile';
import { loginProps } from '../types/login';

export const updateProfile = (files: File[]) => {
    const formData = new FormData();
  files.forEach((file) => {
    formData.append("attachment", file);
  });
  const res = create.post(serverURL + "/upload-profile/"+localStorage.getItem("dkz_gold_customer_token"), formData, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
  return res;
}

export const getProfile = () => {
    return create.post(serverURL + '/c1/get-profile/'+localStorage.getItem("dkz_gold_customer_token"));
}

export const profileUpdate = (data: profileProps) => {
    return create.post(serverURL + '/c1/update-profile/'+localStorage.getItem("dkz_gold_customer_token"), data);
}

export const changePhoneOTP = (data: loginProps) => {
    return create.post(serverURL + '/c1/generate-otp', data);
}
export const changePhoneVerifyOTP = (data: loginProps) => {
    return create.post(serverURL + '/c1/verify-change-phone-otp', data);
}

export const submitFeedbackSupport = (data: ContactSupportProp) => {
    return create.post(serverURL + '/c1/contact-support', data);
}

export const uploadSingle = (files: File[]) => {
    const formData = new FormData();
  files.forEach((file) => {
    formData.append("attachment", file);
  });
  const res = create.post(serverURL + "/upload-single", formData, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
  return res;
}

export const addMoneyToWallet = (data: any) => {
    return create.post(serverURL + '/c1/investNow', data);
}

export const confirmWalletOrder = (data: any) => {
    return create.post(serverURL + '/c1/confirm-wallet-order', data);
}

export const updateProfileSIP = (data: any) => {
    return create.post(serverURL + '/c1/update-sip', data, {headers: serverHeaders});
}