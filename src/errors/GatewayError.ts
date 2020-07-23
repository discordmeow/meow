export class GatewayError extends Error {
  constructor(public code: number, reason?: string) {
    super(reason);

    Error.captureStackTrace(this);
  }
}
