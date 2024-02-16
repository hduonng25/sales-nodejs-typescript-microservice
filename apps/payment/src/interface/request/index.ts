export interface OrderBodyReq {
    orderCode: number;
    description: string;
    returnUrl: string;
    cancelUrl: string;
    amount: number;
}
