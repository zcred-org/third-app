import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { EIP1193Adapter, IEIP1193Provider } from '@zcredjs/ethereum';
import { credHolder } from './backbone/cred-holder.ts';
import { contractAbi } from './backbone/contract.ts';
import type { SybilContract } from './types/sybil-contract.ts';
import type { UserData } from '@zcredjs/core';
import { Background } from './compontents/Background/Background.tsx';
import css from './App.module.css';
import { Button, Card, Typography, notification, Alert, Divider, Flex, Result } from 'antd';
import { useMutation } from 'react-query';
import { getEthSybil } from './utils/get-eth-sybil.ts';
import { config } from './backbone/config.ts';


export function App() {
  const [toast, toastHolder] = notification.useNotification({ placement: 'bottomRight' });
  const [error, setError] = useState<null | Error>(null);

  const [ethWallet, setEthWallet] = useState<null | ethers.BrowserProvider>(null);
  const [eip1193Adapter, setEip1193Adapter] = useState<null | EIP1193Adapter>(null);
  const [userData, setUserData] = useState<null | UserData>(null);

  useEffect(() => {
    // Load ethereum wallet
    const ethProvider = 'ethereum' in window && window.ethereum as IEIP1193Provider;
    setEip1193Adapter(ethProvider ? new EIP1193Adapter(ethProvider) : null);
    setEthWallet(ethProvider ? new ethers.BrowserProvider(ethProvider) : null);
    if (!ethProvider) setError(new Error('Install ethereum wallet or auro wallet'));
    // Check after-verification artifacts
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('clientSession');
    if (sessionId) {
      const userDataStr = window.localStorage.getItem(sessionId);
      setUserData(userDataStr ? JSON.parse(userDataStr) : null);
    }
  }, []);

  const {
    mutate: onEthConnect,
    data: { redirectURL, subjectId } = {},
    isLoading: isEthConnectLoading,
  } = useMutation({
    mutationFn: async () => {
      if (!eip1193Adapter) throw new Error('No EIP1193Adapter');
      const subjectId = await eip1193Adapter.getSubjectId();
      const data = {
        subject: {
          id: subjectId,
        },
        redirectURL: window.location.origin,
      } as const;
      const { openURL, clientSession } = await credHolder.startVerification({
        proposalURL: new URL('https://dev.verifier.sybil.center/zcred/proposal/o1js-ethereum-passport'),
        data: data,
      });
      window.localStorage.setItem(clientSession, JSON.stringify(data));
      return { subjectId, redirectURL: openURL };
    },
    onMutate: async () => setError(null),
    onError: async (error: Error) => {
      setError(error);
      toast.error({ message: 'Error!', description: error.message });
    },
  });

  const {
    mutate: setSybilIdOnChain,
    data: sybilId,
    isLoading: isSetSybilIdOnChainLoading,
  } = useMutation({
    mutationFn: async () => {
      if (!userData) throw new Error('No user data');
      if (!ethWallet) throw new Error('ETH wallet undefined');
      const signer = await ethWallet.getSigner();
      const sybilContract = new ethers.Contract(config.contractAddress, contractAbi, signer) as ethers.Contract & SybilContract;
      const sybilId = await sybilContract.getSybilId(userData.subject.id.key);
      if (ethers.hexlify(new Uint8Array(20).fill(0)) !== sybilId) {
        return sybilId;
      } else {
        const { sybilId, signature } = await getEthSybil(userData.subject.id.key);
        const txn = await sybilContract.setSybilId(
          ethers.getBytes(sybilId),
          ethers.getBytes(signature),
          { value: 20000000000000000n },
        );
        await txn.wait();
        return sybilId;
      }
    },
    onMutate: async () => setError(null),
    onError: async (error: Error) => {
      setError(error);
      toast.error({ message: 'Error!', description: error.message });
    },
  });

  const BeforeVerification = () => {
    if (!subjectId) return (
      <Button disabled={!eip1193Adapter} loading={isEthConnectLoading} onClick={() => onEthConnect()}>
        Connect Ethereum Wallet
      </Button>
    );
    if (redirectURL) return (
      <a href={redirectURL?.href}>
        <Button>
          Auth with zCred
        </Button>
      </a>
    );
    return (<></>);
  };

  const AfterVerification = () => (
    <Result
      status="success"
      title="Successful verification"
      subTitle={sybilId ? `Sybil ID: ${sybilId}` : 'You can have access to your wanted resource now!'}
      extra={!sybilId ? [
        <Button
          loading={isSetSybilIdOnChainLoading}
          onClick={() => setSybilIdOnChain()}
        >Set Sybil ID on Chain</Button>,
      ] : undefined}
    />
  );

  return (
    <Background className={css.root}>
      <Typography.Title style={{ color: 'white' }}>Third-App</Typography.Title>
      <Card style={{ maxWidth: '500px' }}>
        <Flex justify="center" vertical>
          {!userData ? <BeforeVerification /> : <AfterVerification />}
        </Flex>
        {error ? (<>
          <Divider />
          <Alert
            message="Error"
            description={error.message}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        </>) : null}
      </Card>
      {toastHolder}
    </Background>
  );
}
