import "./App.css";
import { CredHolder, Identifier, type UserData } from "@zcredjs/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { EIP1193Adapter, IEIP1193Provider } from "@zcredjs/ethereum";

const credHolder = new CredHolder({
  credentialHolderURL: new URL("http://localhost:5173"),
  userDataHolderURL: new URL("http://localhost:5001/api/v1/secret-data")
});

type EthSybil = {
  address: string;
  sybilId: string;
  signature: string;
}

const contractAddress = "0xf73077e5BDAF0041FB7D70C8CD206C517E83A05C";

function App() {

  const [ethWallet, setEthWallet] = useState<null | ethers.BrowserProvider>(null);
  const [eip1193Adapter, setEip1193Adapter] = useState<null | EIP1193Adapter>(null);
  const [subjectId, setSubjectId] = useState<null | Identifier>(null);
  const [redirectURL, setRedirectURL] = useState<null | URL>(null);
  const [userData, setUserData] = useState<null | UserData>(null);
  const [sybilId, setSybilId] = useState<null | string>(null);

  useEffect(() => {

    const ethProvider = "ethereum" in window && window.ethereum;
    setEip1193Adapter(ethProvider
      ? new EIP1193Adapter(ethProvider as IEIP1193Provider)
      : null
    );
    if (ethProvider) {
      const wallet = new ethers.BrowserProvider(ethProvider as IEIP1193Provider);
      setEthWallet(wallet);
    } else {
      setEthWallet(null);
    }
    if (!ethProvider) throw new Error(
      `Install ethereum wallet or auro wallet`
    );
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("clientSession");
    if (sessionId) {
      const userDataStr = window.localStorage.getItem(sessionId);
      setUserData(userDataStr ? JSON.parse(userDataStr) : null);
    }
  }, []);

  async function onEthConnect() {
    if (eip1193Adapter) {
      const subjectId = await eip1193Adapter.getSubjectId();
      setSubjectId(subjectId);
      const data = {
        subject: {
          id: subjectId
        },
        redirectURL: window.location.origin
      } as const;
      const { openURL, clientSession } = await credHolder.startVerification({
        proposalURL: new URL("https://dev.verifier.sybil.center/zcred/proposal/o1js-ethereum-passport"),
        data: data
      });
      window.localStorage.setItem(clientSession, JSON.stringify(data));
      setRedirectURL(openURL);
    }
  }

  async function setSybilIdOnChain() {
    if (!userData) throw new Error("No user data");
    const signer = await ethWallet!.getSigner();
    const sybilContract = new ethers.Contract(contractAddress, abi, signer) as ethers.Contract & SybilContract;
    const sybilId = await sybilContract.getSybilId(userData.subject.id.key);
    if (ethers.hexlify(new Uint8Array(20).fill(0)) !== sybilId) {
      setSybilId(sybilId);
    } else {
      const { sybilId, signature } = await getEthSybil(userData.subject.id.key);
      const txn = await sybilContract.setSybilId(
        ethers.getBytes(sybilId),
        ethers.getBytes(signature),
        { value: 20000000000000000n }
      );
      await txn.wait();
      setSybilId(sybilId);
    }

  }

  async function getEthSybil(address: string): Promise<EthSybil> {
    const ep = new URL(`https://dev.verifier.sybil.center/api/eth-sybil/${address.toLowerCase()}`);
    const resp = await fetch(ep);
    if (!resp.ok) throw new Error(
      `Resp URL: ${resp.url}, status code: ${resp.status} ,body: ${await resp.text()}`
    );
    return (await resp.json()) as EthSybil;

  }


  const renderBeforeVerification = () => {
    if (!subjectId) return (
      <>
        {eip1193Adapter && <button onClick={onEthConnect}>
          Connect Ethereum Wallet
        </button>}
      </>
    );
    if (redirectURL) return (
      <a href={redirectURL?.href}>
        <button>
          Auth with zCred
        </button>
      </a>
    );
    return (<></>);
  };

  const renderAfterVerification = () => {
    if (sybilId) return (<>${sybilId}</>);
    else if (!sybilId) return (<button onClick={setSybilIdOnChain}>Set Sybil ID on Chain</button>);
  };

  return (
    <>
      {!userData && renderBeforeVerification()}
      {userData && renderAfterVerification()}
    </>
  );
}

export default App;

type SybilContract = {
  getSybilId: (address: string) => Promise<string>;
  setSybilId: (sybilId: Uint8Array, signature: Uint8Array, data: {
    value: BigInt
  }) => Promise<ethers.ContractTransactionResponse>
}

const abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_requireWei",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "ChangeOwner",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newRequireWei",
        "type": "uint256"
      }
    ],
    "name": "ChangeRequireWei",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "subjectId",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes20",
        "name": "sybilId",
        "type": "bytes20"
      }
    ],
    "name": "SybilAdd",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getSybilId",
    "outputs": [
      {
        "internalType": "bytes20",
        "name": "",
        "type": "bytes20"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requireWei",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "setOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_requireWei",
        "type": "uint256"
      }
    ],
    "name": "setRequireWei",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes20",
        "name": "_sybilId",
        "type": "bytes20"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "setSybilId",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];
