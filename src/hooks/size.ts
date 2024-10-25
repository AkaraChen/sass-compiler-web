import { useRef } from 'react';

export const useSize = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const getSize = () => ref.current?.getBoundingClientRect();
  return { ref, getSize };
};
