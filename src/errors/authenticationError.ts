export default class AuthenticationError extends Error {
  flashMessage?: string;
  error?: Error;

  constructor(
    message: string,
    flashMessage: string | undefined = undefined,
    error: Error | undefined = undefined,
  ) {
    super(message);
    this.name = "AuthenticationError";
    this.flashMessage = flashMessage;
    this.error = error;
  }
}
