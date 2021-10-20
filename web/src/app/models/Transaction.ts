/**
 * Interface definition for the create transaction request.
 */
 export interface CreateTransactionRequest {
     fee_code: string,
     quantity: Number,
     requestId: Number
}

/**
 * Interface definition for the update of transactions.
 */
 export interface UpdateTransactionRequest {
    response_url: string,
    paymentId: Number,
    requestId: Number
}