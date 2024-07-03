import type { EthSybil } from '../types/eth-sybil.ts';

export async function getEthSybil(address: string): Promise<EthSybil> {
  const ep = new URL(`https://dev.verifier.sybil.center/api/eth-sybil/${address.toLowerCase()}`);
  const resp = await fetch(ep);
  if (!resp.ok) {
    throw new Error(`Resp URL: ${resp.url}, status code: ${resp.status}, body: ${await resp.text()}`);
  }
  return await resp.json();
}
