export type investmentProp = {
    _id: string,
    planId: {
        packageName: string,
        duration: number,
        percentage: number,
        payoutPeriod: string,
        withdrawInstallment: number,
        banner: {
            path: string,
        }
    },
    investmentId: string,
    investmentCurrency: string,
    investmentAmount: number,
    percentOfAmountTarget: number,
    created_at: string,
}

export const investmentProps:investmentProp[] = [];

export type detailsProp = {
    data: investmentProp,
    close?: Function
}