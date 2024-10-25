import { FC, useRef, useSyncExternalStore } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SassCompiler } from '@/utils/sass';
import { Editor } from './editor';

export interface SassProps {
  version: string;
  input: string;
}

const useSassCompiler = (version: string) => {
  const compiler = useRef<SassCompiler | null>(null);
  if (!compiler.current) {
    compiler.current = new SassCompiler(version);
    compiler.current!.init();
  }
  return [
    useSyncExternalStore(
      function (callback) {
        const emitter = compiler.current!.emitter;
        emitter.on('*', callback);
        return () => emitter.off('*', callback);
      },
      () => compiler.current?.inited,
    ),
    compiler.current!,
  ] as const;
};

export const Sass: FC<SassProps> = (props) => {
  const { version, input } = props;
  const [inited, compiler] = useSassCompiler(version);
  const compile = useQuery({
    queryKey: ['compile', input],
    queryFn: () => compiler.compile(input, 'scss'),
    enabled: inited && !!input,
  });
  if (!inited) {
    return <div>Initializing Sass compiler...</div>;
  }
  if (!input) {
    return <div>Input is empty</div>;
  }
  if (compile.isLoading) {
    return <div>Compiling...</div>;
  }
  return (
    <Editor readonly value={compile.data!} onChange={() => {}} width="500px" />
  );
};
