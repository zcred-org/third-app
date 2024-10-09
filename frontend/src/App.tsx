import type { CSSProperties } from 'react';
import { Alert, Button, Card, Divider, Flex, Result, Typography } from 'antd';
import { Background } from './compontents/Background/Background.tsx';
import { useWallet } from './hooks/useWallet.ts';
import { useVerification } from './hooks/useVerification.ts';
import { Loading } from './compontents/Loading.tsx';
import { AccountButton } from './compontents/AccountButton.tsx';


const appBackgroundStyle: CSSProperties = {
  display: 'flex', flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center',
  minHeight: '100vh',
};

export function App() {
  const wallet = useWallet();
  const verification = useVerification();
  const error = wallet.error || verification.error;
  const isVerified = !!verification.data?.isVerified;

  return (
    <Background style={appBackgroundStyle}>
      <Typography.Title style={{ color: 'white' }}>Third-App</Typography.Title>
      <Card style={{ maxWidth: '500px' }}>
        <Flex
          justify="center"
          align="stretch"
          gap="middle"
          style={{ flexDirection: isVerified ? 'column-reverse' : 'column' }}
        >
          <AccountButton />
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
  const verification = useVerification();

  return verification.isFetching ? (
    <Loading>Loading verification result...</Loading>
  ) : verification.data?.verifyURL ? (
    <Button type="primary" href={verification.data.verifyURL.href}>Auth with zCred</Button>
  ) : verification.data?.isVerified ? (
    <Result
      status="success"
      title="Successful verification"
      subTitle={`User with address: ${verification.data.subjectId.key} authenticated`}
    />
  ) : null;
}
