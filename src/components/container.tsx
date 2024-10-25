import { Box, Paper, Text } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';

interface ContainerProps extends PropsWithChildren {
  title: string;
}

export const Container: FC<ContainerProps> = (props) => {
  const { title, children } = props;
  return (
    <Paper
      w={300}
      h={'100%'}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Text size="xl" fw={500} display={'block'}>
        {title}
      </Text>
      <Box
        my={10}
        style={{
          height: '100%',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};
