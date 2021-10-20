/**
 * Interface definition for the create transaction request.
 */
 export interface CreateTransactionRequest {
     feeCode: string,
     quantity: Number,
     requestId: Number
}

/**
 * Interface definition for the update of transactions.
 */
 export interface UpdateTransactionRequest {
    responseUrl: string,
    paymentId: Number,
    requestId: Number
}