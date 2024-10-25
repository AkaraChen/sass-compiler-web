import { FC, PropsWithChildren, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export const Providers: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <QueryClientProvider client={useMemo(() => new QueryClient(), [])}>
      <MantineProvider>{children}</MantineProvider>
    </QueryClientProvider>
  );
};
