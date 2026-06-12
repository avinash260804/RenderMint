import net from "node:net";

let databaseAvailablePromise: Promise<boolean> | null = null;

export function canAttemptDatabaseQuery() {
  databaseAvailablePromise ??= checkDatabaseAvailability();
  return databaseAvailablePromise;
}

async function checkDatabaseAvailability() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return false;
  }

  try {
    const parsed = new URL(databaseUrl);
    const host = parsed.hostname;
    const port = Number(parsed.port || "5432");

    if (!host || !Number.isFinite(port)) {
      return false;
    }

    return await canConnect(host, port);
  } catch {
    return false;
  }
}

function canConnect(host: string, port: number) {
  return new Promise<boolean>((resolve) => {
    const socket = net.createConnection({ host, port });
    const finish = (available: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(available);
    };

    socket.setTimeout(750);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}
