import { ComponentProps, FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sass } from '@codemirror/lang-sass';
import { SassMode } from '@/utils/sass';

export interface EditorProps extends ComponentProps<typeof CodeMirror> {
  readonly: boolean;
  value: string;
  onChange: (value: string) => void;
  mode?: SassMode;
}

export const Editor: FC<EditorProps> = (props) => {
  const { readonly, value, onChange, ...rest } = props;
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[sass()]}
      lang="sass"
      readOnly={readonly}
      height="700px"
      width="auto"
      {...rest}
    />
  );
};
