export {};

declare global {
  namespace Express {
    /** The logged-in user, set by requireAuth. */
    interface AuthUser {
      id: number;
      email: string;
      name: string;
      role: string;
      sessionId: string;
    }

    interface Request {
      /** Set by the requestContext middleware. */
      requestId: string;
      /** Epoch milliseconds when the request started. */
      startedAt: number;
      /** Set by requireAuth on protected routes. */
      auth?: AuthUser;
    }
  }
}
