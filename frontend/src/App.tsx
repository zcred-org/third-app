import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { EIP1193Adapter, IEIP1193Provider } from "@zcredjs/ethereum";
import { serverApp } from "./backbone/server-app.ts";
import { Background } from "./compontents/Background/Background.tsx";
import css from "./App.module.css";
import { Alert, Button, Card, Divider, Flex, notification, Result, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";


export function App() {
  const [toast, toastHolder] = notification.useNotification({ placement: "bottomRight" });
  const [error, setError] = useState<null | Error>(null);

  const [, setEthWallet] = useState<null | ethers.BrowserProvider>(null);
  const [eip1193Adapter, setEip1193Adapter] = useState<null | EIP1193Adapter>(null);

  useEffect(() => {
    // Load ethereum wallet
    const ethProvider = "ethereum" in window && window.ethereum as IEIP1193Provider;
    setEip1193Adapter(ethProvider ? new EIP1193Adapter(ethProvider) : null);
    setEthWallet(ethProvider ? new ethers.BrowserProvider(ethProvider) : null);
    if (!ethProvider) setError(new Error("Install ethereum wallet wallet"));
  }, []);

  const {
    mutate: onEthConnect,
    data: { verifyURL, subjectId, isVerified } = {},
    isPending: isEthConnectLoading,
  } = useMutation({
    mutationFn: async () => {
      if (!eip1193Adapter) throw new Error("No EIP1193Adapter");
      const subjectId = await eip1193Adapter.getSubjectId();
      const isVerified = await serverApp.isVerified(subjectId);
      if (isVerified) {
        return { isVerified, subjectId };
      } else {
        const { verifyURL } = await serverApp.startVerification(subjectId);
        return { verifyURL, subjectId };
      }
    },
    onMutate: async () => setError(null),
    onError: async (error: Error) => {
      setError(error);
      toast.error({ message: "Error!", description: error.message });
    },
  });

  const BeforeVerification = () => {
    if (!subjectId) return (
      <Button disabled={!eip1193Adapter} loading={isEthConnectLoading} onClick={() => onEthConnect()}>
        Connect Ethereum Wallet
      </Button>
    );
    if (verifyURL) return (
      <a href={verifyURL?.href}>
        <Button>
          Auth with zCred
        </Button>
      </a>
    );
    return (<></>);
  };

  const AfterVerification = () => {
    if (isVerified && subjectId) return (
      <Result
        status="success"
        title="Successful verification"
        subTitle={
          `User with address: ${subjectId.key} authenticated`
        }
      />
    );
  };

  return (
    <Background className={css.root}>
      <Typography.Title style={{ color: "white" }}>Third-App</Typography.Title>
      <Card style={{ maxWidth: "500px" }}>
        <Flex justify="center" vertical>
          {!isVerified ? <BeforeVerification/> : <AfterVerification/>}
        </Flex>
        {error ? (<>
          <Divider/>
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
