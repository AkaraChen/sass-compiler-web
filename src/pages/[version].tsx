import { Sass } from '@/components/sass';
import { FC, useSyncExternalStore } from 'react';
import { useParams } from 'react-router-dom';

let msg: string;

function useWindowMessage() {
  return useSyncExternalStore(
    function subscribe(callback) {
      const controller = new AbortController();
      window.addEventListener(
        'message',
        (e) => {
          if (e.data.type === 'input') {
            msg = e.data.value;
            callback();
          }
        },
        { signal: controller.signal },
      );
      return () => controller.abort();
    },
    () => msg,
  );
}

export const VersionPage: FC = () => {
  const { version } = useParams();
  if (!version) {
    throw new Error('Version not found');
  }
  const input = useWindowMessage();
  return <Sass version={version} input={input} />;
};
