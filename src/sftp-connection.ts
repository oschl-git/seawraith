import SftpClient from "ssh2-sftp-client";
import { SessionData } from "./authentication";
import logger from "./logger";

const CLIENT_EXPIRATION_TIME = 15 * 60 * 1000; // 15 minutes

const clients: Record<string, SftpClient> = {};
const timeouts: Record<string, NodeJS.Timeout> = {};

export async function getClientForSession(
  sessionData: SessionData,
): Promise<SftpClient> {
  if (sessionData.sessionId in clients) {
    renewClient(sessionData);
    return clients[sessionData.sessionId];
  } else {
    return await createNewClient(sessionData);
  }
}

async function createNewClient(sessionData: SessionData): Promise<SftpClient> {
  const newClient = new SftpClient();

  await newClient.connect({
    host: sessionData.hostname,
    port: sessionData.port,
    username: sessionData.username,
    password: sessionData.password,
  });

  clients[sessionData.sessionId] = newClient;
  setClientTimeout(sessionData);

  logger.info(
    `Created new client for client sessionId: ${sessionData.sessionId}`,
  );

  return newClient;
}

async function closeClient(sessionData: SessionData): Promise<void> {
  deleteClientTimeout(sessionData);

  if (sessionData.sessionId in clients) {
    const client = clients[sessionData.sessionId];
    await client.end();
    delete clients[sessionData.sessionId];
  }

  logger.info(
    `Closed client sessionId: ${sessionData.sessionId}`,
  );
}

function renewClient(sessionData: SessionData): void {
  deleteClientTimeout(sessionData);
  setClientTimeout(sessionData);
  logger.info(
    `Renewed expiration for client sessionId: ${sessionData.sessionId}`,
  );
}

function setClientTimeout(sessionData: SessionData): void {
  const timeoutId = setTimeout(() => {
    void (async () => {
      await closeClient(sessionData);
    })();
  }, CLIENT_EXPIRATION_TIME);

  timeouts[sessionData.sessionId] = timeoutId;
}

function deleteClientTimeout(sessionData: SessionData): void {
  if (sessionData.sessionId in timeouts) {
    const timeoutId = timeouts[sessionData.sessionId];
    clearTimeout(timeoutId);
    delete timeouts[sessionData.sessionId];
  }
}
