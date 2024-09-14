import { config } from "./config.ts";

type ZcredId = {
  type: string;
  key: string;
}

export const serverApp = {
  startVerification: async (subjectId: ZcredId): Promise<{
    verifyURL: URL;
    sessionId: string
  }> => {
    const endpoint = new URL("/api/start-verification", config.serverAppOrigin);
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...subjectId
      })
    });
    if (!resp.ok) {
      throw new Error(`HTTP POST request ${endpoint.href} error. Status code: ${resp.status}. Body: ${await resp.text()}`);
    }
    const body = await resp.json() as { verifyURL: string; sessionId: string };
    return {
      verifyURL: new URL(body.verifyURL),
      sessionId: body.sessionId
    };
  },

  isVerified: async (subjectId: ZcredId): Promise<boolean> => {
    const endpoint = new URL("/api/is-verified", config.serverAppOrigin);
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subjectId)
    });
    if (!resp.ok) {
      throw new Error(`HTTP POST request ${endpoint.href} error. Status code: ${resp.status}. Body: ${await resp.text()}`);
    }
    const body = await resp.json() as { isVerified: boolean };
    return body.isVerified;
  }
};