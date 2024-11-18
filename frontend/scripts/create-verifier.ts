import fs from "node:fs";
import { assert, not, toJAL } from "@jaljs/js-zcred";
import { O1JS_ETH_DEV } from "@sybil-center/passport";


async function main() {
  const {
    inputSchema: {
      credential,
      context
    },
    olderThanYears, // check that user older than defined year
    youngerThanYears, // check that user younger than defined year
    fromCountry, // check that user from specific country
    passportNotExpired, // check that passport not expired
    genderIs // check user gender
  } = O1JS_ETH_DEV;
  const jalProgram = toJAL({
    target: "o1js:zk-program.cjs",
    credential: credential,
    publicInput: [
      credential.attributes.document.sybilId,
      context.now
    ],
    commands: [
      assert(olderThanYears(18)),
      assert(youngerThanYears(45)),
      assert(not(fromCountry("USA"))),
      assert(not(fromCountry("PRK"))),
      assert(passportNotExpired()),
      assert(genderIs("male"))
    ],
    options: {
      signAlgorithm: "mina:pasta",
      hashAlgorithm: "mina:poseidon"
    }
  });
  await createJAL(jalProgram);
}

async function createJAL(jalProgram: ReturnType<typeof toJAL>) {
  const createJalResp = await fetch(new URL("https://dev.verifier.sybil.center/api/v1/jal"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jalProgram)
  });
  if (createJalResp.ok) {
    const { id: jalId } = await createJalResp.json() as { id: string };
    fs.writeFileSync(
      new URL("../src/jal-id.ts", import.meta.url),
      `export const jalId = "${jalId}"`
    );
    console.log(`JAL program created, JAL id: ${jalId}`);
  } else throw new Error(
    `Create JAL response error. Status code: ${createJalResp.status}; body: ${await createJalResp.text()}`
  );
}

main()
  .then()
  .catch((e) => console.log(e.message));
