export default class AuthenticationError extends Error {
  flashMessage?: string;
  error?: Error;

  constructor(
    message: string,
    error: Error | undefined = undefined,
    flashMessage: string | undefined = undefined,
  ) {
    super(message);
    this.name = "AuthenticationError";
    this.error = error;
    this.flashMessage = flashMessage;
  }
}
