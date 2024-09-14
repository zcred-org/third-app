import { Type } from "@sinclair/typebox";
import sortKeys from "sort-keys";
import * as u8a from "uint8arrays";
import * as jose from "jose";
import { Value } from "@sinclair/typebox/value";
const Es256kJwk = Type.Object({
    x: Type.String(),
    y: Type.String(),
    crv: Type.Enum({ secp256k1: "secp256k1" }),
    kty: Type.Enum({ ES: "EC" })
});
const ZcredException = Type.Object({
    code: Type.Number(),
    message: Type.String()
});
export const ProvingResult = Type.Object({
    signature: Type.String(),
    message: Type.String(),
    proof: Type.String(),
    publicInput: Type.Object({
        credential: Type.Object({
            attributes: Type.Object({
                subject: Type.Object({
                    id: Type.Object({
                        type: Type.String(),
                        key: Type.String()
                    })
                })
            })
        })
    }, { additionalProperties: true }),
    publicOutput: Type.Optional(Type.Object({}, { additionalProperties: true })),
    verificationKey: Type.Optional(Type.String()),
    provingKey: Type.Optional(Type.String())
});
const WebhookDto = Type.Object({
    sessionId: Type.String(),
    status: Type.Enum({ exception: "exception", success: "success" }),
    jalId: Type.String(),
    jalURL: Type.String(),
    verificationResultId: Type.String(),
    verificationResultURL: Type.String(),
    result: Type.Union([
        ZcredException,
        ProvingResult
    ])
});
const ZcredId = Type.Object({
    type: Type.String(),
    key: Type.String()
});
export function Controller({ config, fastify, jwk, jalId }) {
    const verifiedStore = {};
    function idToString(id) {
        return `${id.type}:${id.key}`;
    }
    fastify.post(`/api/start-verification`, {
        schema: { body: ZcredId }
    }, async (req) => {
        const subjectId = req.body;
        const jwt = await new jose.CompactSign(new TextEncoder().encode(JSON.stringify({
            exp: new Date(new Date().getTime() + 1000 * 10 * 60).getTime(),
            aud: config.verifierOrigin,
            statement: "create-session",
            jwk: jwk
        }))).setProtectedHeader({ alg: "ES256K" })
            .sign(await jose.importJWK(jwk));
        const webhookURL = new URL("/api/webhook", config.serverOrigin.href);
        const initSessionResp = await fetch(new URL(`/api/v2/verifier/${jalId}/session`, config.verifierOrigin), {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subject: {
                    id: subjectId
                },
                webhookURL: webhookURL.href,
                redirectURL: config.redirectURL,
                issuer: {
                    type: "http",
                    uri: config.issuerURL,
                },
                credentialHolderURL: config.credentialHolderURL
            })
        });
        if (!initSessionResp.ok) {
            throw new Error(`Init verifier session response error. Resp body: ${initSessionResp.body}`);
        }
        return await initSessionResp.json();
    });
    fastify.post("/api/webhook", {
        schema: { body: WebhookDto }
    }, async (req, resp) => {
        if (!req.headers?.authorization) {
            resp.statusCode = 403;
            return { message: "Authorization header is not defined" };
        }
        const jws = req.headers.authorization.slice(7);
        const isBodyVerified = await isWebhookBodyVerified({ jws, body: req.body });
        if (!isBodyVerified) {
            resp.statusCode = 403;
            return { message: "Access denied" };
        }
        const result = req.body.result;
        if (req.body.status === "success" && Value.Check(ProvingResult, result)) {
            const subjectId = idToString(result.publicInput.credential.attributes.subject.id);
            verifiedStore[subjectId] = true;
            return { message: "ok" };
        }
        if (req.body.status === "exception") {
            return { message: "ok" };
        }
        resp.statusCode = 400;
        return { message: "Bad request" };
    });
    fastify.post("/api/is-verified", {
        schema: {
            body: ZcredId
        }
    }, async (req) => {
        console.log(req.body);
        const subjectId = idToString(req.body);
        return { isVerified: verifiedStore[subjectId] };
    });
    async function isWebhookBodyVerified(input) {
        const detachedJWS = input.jws;
        const strPayload = JSON.stringify(sortKeys(input.body, { deep: true }));
        const jwsPayload = Buffer.from(new TextEncoder().encode(strPayload)).toString("base64url");
        const [head, _, signature] = detachedJWS.split(".");
        const jws = `${head}.${jwsPayload}.${signature}`;
        const jwsDecodedHeed = JSON.parse(u8a.toString(u8a.fromString(head, "base64url")));
        const kidURL = new URL(jwsDecodedHeed.kid);
        if (kidURL.origin !== new URL(config.verifierOrigin).origin) {
            return false;
        }
        const jwkResp = await fetch(jwsDecodedHeed.kid);
        if (!jwkResp.ok) {
            throw new Error("Can not get verifier JWK");
        }
        const jwk = await jwkResp.json();
        try {
            await jose.compactVerify(jws, await jose.importJWK(jwk));
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
