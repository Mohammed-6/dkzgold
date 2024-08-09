import axios from "axios";
const create = axios.create();
import { serverHeaders, serverURL } from "../../stuff";
import { investPlanProp, paymentProp } from "../types/dashboard";

export const clientDashboard = () => {
  return create.get(serverURL + "/c1/dashboard", {
    params: serverHeaders,
  });
};


export const investPlanNow = (data:investPlanProp) => {
    return create.post(serverURL + "/c1/investNow", data, {
      params: serverHeaders,
    });
  };

  export const confirmOrder = (data:paymentProp) => {
      return create.post(serverURL + "/c1/confirmOrder", data, {
        params: serverHeaders,
      });
    };