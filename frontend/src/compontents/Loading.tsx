import { Spin, Typography, Flex } from 'antd';
import type { CSSProperties } from 'react';

export function Loading(props: { children: string }) {
  return (
    <Flex gap="small" style={style}>
      <Spin percent="auto" />
      <Typography.Text>{props.children}</Typography.Text>
    </Flex>
  );
}

const style: CSSProperties = {
  padding: 10,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 10,
};
