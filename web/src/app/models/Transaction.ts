/**
 * Interface definition for the create transaction request.
 */
 export interface CreateTransactionRequest {
     feeCode: string,
     quantity: Number
}

/**
 * Interface definition for the update of transactions.
 */
 export interface UpdateTransactionRequest {
    payResponseUrl: string,
    paymentId: Number,
    requestId: Number
}