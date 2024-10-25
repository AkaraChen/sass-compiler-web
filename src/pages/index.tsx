import { Group, MultiSelect } from '@mantine/core';
import { useMemo, useRef, useState } from 'react';
import { Container } from '@/components/container';
import { useQuery } from '@tanstack/react-query';
import { sortSemver } from 'fnpm-toolkit';
import { Editor } from '@/components/editor';
import { Layout } from '@/layout';
import { useSize } from '@/hooks/size';

const url = new URL('/v1', 'https://corsmirror.com');
url.searchParams.set('url', new URL('sass', 'https://registry.npmjs.org').href);

export const Index = () => {
  const manifest = useQuery({
    queryKey: ['manifest'],
    queryFn: async () => {
      const result = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
      return sortSemver(Object.keys(result.versions));
    },
  });
  const availableVersions = manifest.data || [];
  const [versions, setVersions] = useState(['1.80.4', '1.61.0']);
  const [input, setInput] = useState('');

  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});
  const onInputChange = (value: string) => {
    setInput(value);
    Object.values(iframeRefs.current).forEach((ref) => {
      ref?.contentWindow?.postMessage(
        {
          type: 'input',
          value,
        },
        '*',
      );
    });
  };
  const leftContainer = useSize<HTMLDivElement>();
  const leftEditorHeight = useMemo(() => {
    if (!leftContainer.getSize()) {
      return 0;
    }
    return leftContainer.getSize()!.height - 70;
  }, [leftContainer]);
  const rightContainer = useSize<HTMLDivElement>();
  const rightEditorHeight = useMemo(() => {
    if (!rightContainer.getSize()) {
      return 0;
    }
    return rightContainer.getSize()!.height - 70;
  }, [rightContainer]);
  return (
    <Layout
      sidebar={
        <Container title="input">
          <MultiSelect
            data={availableVersions}
            value={versions}
            onChange={setVersions}
            placeholder="Select sass versions"
            searchable
            mb={10}
          />
          <div
            ref={leftContainer.ref}
            style={{
              height: '100%',
            }}
          >
            <Editor
              value={input}
              onChange={onInputChange}
              readonly={false}
              height={`${leftEditorHeight}px`}
            />
          </div>
        </Container>
      }
    >
      <Group align="start" ref={rightContainer.ref}>
        {versions.map((version) => (
          <Container key={version} title={`Sass ${version}`}>
              <iframe
                style={{
                  border: 0,
                  width: '100%',
                  height: `${rightEditorHeight}px`,
                }}
                ref={(ref) => {
                  if (ref) {
                    iframeRefs.current[version] = ref;
                    ref.contentWindow?.postMessage(
                      {
                        type: 'input',
                        value: input,
                      },
                      '*',
                    );
                  }
                }}
                src={new URL(`/${version}`, window.location.href).href}
              />
          </Container>
        ))}
      </Group>
    </Layout>
  );
};
