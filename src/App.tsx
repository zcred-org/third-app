import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { EIP1193Adapter, IEIP1193Provider } from "@zcredjs/ethereum";
import { credHolder } from "./backbone/cred-holder.ts";
import { Background } from "./compontents/Background/Background.tsx";
import css from "./App.module.css";
import { Alert, Button, Card, Divider, Flex, notification, Result, Typography } from "antd";
import { useMutation } from "react-query";
import { jalId } from "./jal-id.ts";

type Result = {
  provingResult: {
    signature: string;
    proof: string;
    publicInput: Record<string, any>
    verificationKey?: string;
  }
  jalURL: string;
  jalId: string;
}


export function App() {
  const [toast, toastHolder] = notification.useNotification({ placement: "bottomRight" });
  const [error, setError] = useState<null | Error>(null);

  const [_, setEthWallet] = useState<null | ethers.BrowserProvider>(null);
  const [eip1193Adapter, setEip1193Adapter] = useState<null | EIP1193Adapter>(null);
  const [result, setResult] = useState<null | Result>(null);

  useEffect(() => {
    // Load ethereum wallet
    const ethProvider = "ethereum" in window && window.ethereum as IEIP1193Provider;
    setEip1193Adapter(ethProvider ? new EIP1193Adapter(ethProvider) : null);
    setEthWallet(ethProvider ? new ethers.BrowserProvider(ethProvider) : null);
    if (!ethProvider) setError(new Error("Install ethereum wallet or auro wallet"));
    // Check after-verification artifacts
    const urlParams = new URLSearchParams(window.location.search);
    const provingResultURLStr = urlParams.get("provingResultURL");
    if (provingResultURLStr) {
      fetch(new URL(provingResultURLStr))
        .then<Result>((resp) => resp.json())
        .then((result) => {
          setResult(result);
          console.log(JSON.stringify(result, null, 2));
        });
    }
  }, []);

  const {
    mutate: onEthConnect,
    data: { redirectURL, subjectId } = {},
    isLoading: isEthConnectLoading,
  } = useMutation({
    mutationFn: async () => {
      if (!eip1193Adapter) throw new Error("No EIP1193Adapter");
      const subjectId = await eip1193Adapter.getSubjectId();
      const data = {
        subject: {
          id: subjectId,
        },
        redirectURL: window.location.origin,
        issuer: {
          type: "http",
          uri: new URL("https://api.dev.sybil.center/issuers/passport/").href
        }
      } as const;
      const { openURL, clientSession } = await credHolder.startVerification({
        proposalURL: new URL(`https://dev.verifier.sybil.center/api/v1/verifier/${jalId}/proposal`),
        data: data,
      });
      window.localStorage.setItem(clientSession, JSON.stringify(data));
      return { subjectId, redirectURL: openURL };
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
      subTitle={
        `User with address: ${result?.provingResult.publicInput.credential.attributes.subject.id.key} authenticated`
      }
    />
  );

  return (
    <Background className={css.root}>
      <Typography.Title style={{ color: "white" }}>Third-App</Typography.Title>
      <Card style={{ maxWidth: "500px" }}>
        <Flex justify="center" vertical>
          {!result ? <BeforeVerification/> : <AfterVerification/>}
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
