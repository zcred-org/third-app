import { Dropdown, Button } from 'antd';
import { useWallet } from '../hooks/useWallet.ts';
import { addressShort } from '../utils/address-short.ts';
import { ApiOutlined } from '@ant-design/icons';
import { useWalletInfo } from '@web3modal/wagmi/react';


export function AccountButton() {
  const { walletInfo } = useWalletInfo();
  const wallet = useWallet();

  if (!wallet.isConnected) return (
    <Button type="primary" onClick={wallet.connect} loading={wallet.isLoading}>
      Connect Ethereum Wallet
    </Button>
  );

  const walletIcon = walletInfo?.icon ? <img
    src={walletInfo.icon}
    alt="Wallet Logo"
    style={{ width: 20, height: 20, marginTop: 2 }}
  /> : null;

  return (
    <Dropdown
      menu={{
        items: [{
          key: 'disconnect',
          label: 'Disconnect',
          danger: true,
          icon: <ApiOutlined />,
          onClick: wallet.disconnect,
        }],
      }}
    >
      <Button icon={walletIcon}>{addressShort(wallet.address)}</Button>
    </Dropdown>
  );
}
