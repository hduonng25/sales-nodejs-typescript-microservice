export interface IPaymentRes {
    bin: string;
    checkoutUrl: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    qrCode: string;
}

export interface IGetOrderRes {
    id: string;
    orderCode: number;
    amount: number;
    amountPaid: number;
    amountRemaining: number;
    status: string;
    createdAt: Date;
}
