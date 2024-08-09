
type bannerProp = {
    _id: string,
    path: string
}
export type planProps = {
    _id: string;
    packageName: string,
    duration: number,
    percentage: number,
    payoutPeriod: string,
    capitalReturn: boolean,
    withdrawInstallment: number,
    minAmount: number,
    maxAmount: number,
    terms: string,
    offerClaim: string,
    banner: bannerProp,
    status: boolean,
    created_at: Date;
  };
  
  export type editPlanProps = {
    data: planProps;
    close?: Function;
  }
  export const listplanProps: planProps[] = [];
  
  export type planPropertiesProp = {
    data: planProps
  }

  export type investPlanProp = {
    planId: string,
    amount: number,
    clientId: string
  }
  
  export type paymentProp = {
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string
  }