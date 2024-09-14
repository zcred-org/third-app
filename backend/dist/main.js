import createFastify from "fastify";
import cors from "@fastify/cors";
import { Config } from "./config.js";
import crypto from "node:crypto";
import { Controller } from "./controller.js";
import { secp256k1 } from "@noble/curves/secp256k1";
import dotenv from "dotenv";
import * as jose from "jose";
import { O1JS_ETH_DEV } from "@sybil-center/passport";
import { assert, not, toJAL } from "@jaljs/js-zcred";
async function main() {
    try {
        dotenv.config({ override: true });
        const config = new Config({
            host: process.env["HOST"] || "0.0.0.0",
            port: process.env["PORT"] || "8080",
            secret: process.env["SECRET"] || "",
            verifierOrigin: process.env["VERIFIER_ORIGIN"],
            redirectURL: new URL(process.env["REDIRECT_URL"]),
            serverOrigin: new URL(process.env["SERVER_ORIGIN"]),
            issuerURL: new URL(process.env["ISSUER_URL"]),
            credentialHolderURL: new URL(process.env["CREDENTIAL_HOLDER_URL"]),
        });
        const jwk = await createJWK(config.secret);
        const jalId = await createJalProgram({ config, jwk, });
        const fastify = await createFastify({
            disableRequestLogging: true
        });
        await fastify.register(cors, { origin: "*" });
        Controller({ config, fastify, jwk, jalId });
        await fastify.listen({
            port: Number(config.port),
            host: config.host
        });
    }
    catch (e) {
        console.log(e);
    }
}
async function createJWK(secret) {
    const privateKey = crypto.createHash("sha256")
        .update(secret)
        .digest();
    const publicKey = secp256k1.getPublicKey(privateKey, false).slice(1);
    const d = Buffer.from(privateKey).toString("base64url");
    const x = Buffer.from(publicKey.slice(0, 32)).toString("base64url");
    const y = Buffer.from(publicKey.slice(32)).toString("base64url");
    return {
        x: x,
        y: y,
        d: d,
        kty: "EC",
        crv: "secp256k1"
    };
}
async function createJalProgram(input) {
    const jwk = await jose.importJWK(input.jwk);
    const jwt = await new jose.CompactSign(new TextEncoder().encode(JSON.stringify({
        exp: new Date(new Date().getTime() + 1000 * 10 * 60).getTime(),
        aud: input.config.verifierOrigin,
        statement: "create-jal-program",
        jwk: input.jwk
    }))).setProtectedHeader({ alg: "ES256K" })
        .sign(jwk);
    const endpoint = new URL(`/api/v2/jal`, input.config.verifierOrigin);
    const { inputSchema: { credential, context }, olderThanYears, youngerThanYears, fromCountry, genderIs } = O1JS_ETH_DEV;
    const attributes = credential.attributes;
    const jalProgram = toJAL({
        target: "o1js:zk-program.cjs",
        credential: credential,
        publicInput: [
            attributes.subject.id.type,
            attributes.subject.id.key,
            attributes.document.sybilId,
            context.now
        ],
        commands: [
            assert(olderThanYears(18)),
            assert(youngerThanYears(45)),
            assert(not(fromCountry("USA"))),
            assert(genderIs("male"))
        ],
        options: {
            signAlgorithm: "mina:pasta",
            hashAlgorithm: "mina:poseidon"
        }
    });
    const createJalResp = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            comment: "Some comment",
            jalProgram: jalProgram,
        })
    });
    if (!createJalResp.ok) {
        throw new Error(`Can not create JAL program. Response body: ${await createJalResp.text()}`);
    }
    const { id } = await createJalResp.json();
    return id;
}
main()
    .then(() => console.log("Started"))
    .catch((e) => console.log(e));
