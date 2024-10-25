import { PropsWithChildren, ReactNode } from 'react';

import { AppShell, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface LayoutProps extends PropsWithChildren {
  sidebar: ReactNode;
}

export function Layout(props: LayoutProps) {
  const { children, sidebar } = props;
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: { base: 200, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text size="xl" fw={500}>
            Sass
          </Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">{sidebar}</AppShell.Navbar>
      <AppShell.Main display={'flex'}>{children}</AppShell.Main>
    </AppShell>
  );
}
