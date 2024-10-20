import { SessionData } from './authenticator';

const MESSAGE_EXPIRATION_TIME = 1000 * 60; // 1 minute

export enum Type {
	Error,
	Warning,
	Info,
	Success,
}

interface FlashMessage {
	message: string;
	type: Type;
}

const flashMessages: Record<string, FlashMessage[]> = {};

export function addMessage(flashMessage: FlashMessage, sessionData: SessionData) {
	if (!Array.isArray(flashMessages[sessionData.sessionId])) {
		flashMessages[sessionData.sessionId] = [];
	}

	flashMessages[sessionData.sessionId].push(flashMessage);

	setTimeout(() => {
    void (() => {
      flashMessages[sessionData.sessionId] = flashMessages[sessionData.sessionId].filter(
        (storedMessage) => storedMessage.message !== flashMessage.message,
      );
    })();
  }, MESSAGE_EXPIRATION_TIME);
}

export function getMessages(sessionData: SessionData) {
	const messages = flashMessages[sessionData.sessionId];
	delete flashMessages[sessionData.sessionId];

	return messages;
}