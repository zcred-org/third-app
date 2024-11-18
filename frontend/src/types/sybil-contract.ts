import type { ethers } from 'ethers';

export type SybilContract = {
  getSybilId(address: string): Promise<string>;
  setSybilId(
    sybilId: Uint8Array,
    signature: Uint8Array,
    data: { value: bigint },
  ): Promise<ethers.ContractTransactionResponse>
}
