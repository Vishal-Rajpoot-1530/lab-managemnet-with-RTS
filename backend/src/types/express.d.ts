export {};

declare global {
  namespace Express {
    interface Request {
      /** Set by the requestContext middleware. */
      requestId: string;
      /** Epoch milliseconds when the request started. */
      startedAt: number;
    }
  }
}
