export default class AuthenticationError extends Error {
  flashMessage?: string;
  error?: unknown;

  constructor(
    message: string,
    flashMessage: string | undefined = undefined,
    error: unknown = undefined,
  ) {
    super(message);
    this.name = "AuthenticationError";
    this.flashMessage = flashMessage;
    this.error = error;
  }
}
