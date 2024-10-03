import type { CSSProperties } from 'react';
import { Alert, Button, Card, Divider, Flex, Result, Typography } from 'antd';
import { Background } from './compontents/Background/Background.tsx';
import { useWallet } from './hooks/useWallet.ts';
import { useVerification } from './hooks/useVerification.ts';
import { addressShort } from './utils/address-short.ts';
import { Loading } from './compontents/Loading.tsx';


const appBackgroundStyle: CSSProperties = {
  display: 'flex', flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center',
  minHeight: '100vh',
};

export function App() {
  const wallet = useWallet();
  const verification = useVerification();
  const error = wallet.error || verification.error;

  return (
    <Background style={appBackgroundStyle}>
      <Typography.Title style={{ color: 'white' }}>Third-App</Typography.Title>
      <Card style={{ maxWidth: '500px' }}>
        <Flex vertical justify="center" align="center" gap="middle">
          {wallet.address && !verification.data?.isVerified
            ? <Typography.Text>{addressShort(wallet.address)}</Typography.Text>
            : null}
          <MainFlow />
        </Flex>
        {error?.message ? (<>
          <Divider />
          <Alert
            message="Error"
            description={error.message}
            type="error"
            showIcon
          />
        </>) : null}
      </Card>
    </Background>
  );
}


function MainFlow() {
  const wallet = useWallet();
  const verification = useVerification();

  return !wallet.isConnected ? (
    <Button type="primary" onClick={wallet.connect} loading={wallet.isConnecting}>
      Connect Ethereum Wallet
    </Button>
  ) : verification.isFetching ? (
    <Loading>Loading verification result...</Loading>
  ) : verification.data?.verifyURL ? (
    <Button href={verification.data.verifyURL.href}>Auth with zCred</Button>
  ) : verification.data?.isVerified ? (
    <Result
      status="success"
      title="Successful verification"
      subTitle={`User with address: ${verification.data.subjectId.key} authenticated`}
    />
  ) : 'Error: unhandled ui state';
}
