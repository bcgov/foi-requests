/**
 * Interface definition for the create transaction request.
 */
 export interface CreateTransactionRequest {
     feeCode: string,
     fee: string,
     requestId: Number
     payReturnUrl: string
}

/**
 * Interface definition for the update of transactions.
 */
 export interface UpdateTransactionRequest {
    payResponseUrl: string,
    transactionId: Number,
    requestId: Number
}