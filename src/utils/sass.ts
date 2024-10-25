import { WebContainer } from '@webcontainer/api';
import mitt from 'mitt';
import { getWebContainer } from './webcontainer';
import type { PackageJson } from 'type-fest';
import consola from 'consola';

type UnionToMap<T extends string, R = void> = {
  [K in T]: R;
};
type SassCompilerEvents = 'init' | 'destroy';
export type SassMode = 'sass' | 'scss';

export class SassCompiler {
  constructor(private version: string) {}

  emitter = mitt<UnionToMap<SassCompilerEvents>>();
  webContainer!: WebContainer;
  decoder = new TextDecoder();

  inited = false;
  async init() {
    consola.info('Initializing Sass compiler');
    this.webContainer = await getWebContainer();
    await this.webContainer.mount({
      'package.json': {
        file: {
          contents: JSON.stringify({
            name: `sass-compiler-${this.version}`,
          } satisfies PackageJson),
        },
      },
    });
    consola.info('Installing Sass compiler');
    await this.webContainer.spawn('npm', ['install', `sass@${this.version}`]);

    consola.success('Sass compiler initialized');
    this.inited = true;
    this.emitter.emit('init');
  }

  async compile(input: string, mode: SassMode) {
    consola.info('Compiling Sass');
    const inputFile = mode === 'sass' ? 'input.sass' : 'input.scss';
    await this.webContainer.fs.writeFile(inputFile, input);
    consola.info('Running Sass compiler');
    const process = await this.webContainer.spawn('npx', [
      '-y',
      '--',
      'sass',
      inputFile,
      'output.css',
      '--no-source-map',
    ]);
    consola.info('waiting for Sass to compile');
    const code = await process.exit;
    consola.success('Sass compiled with code', code);
    const output = await this.webContainer.fs.readFile('output.css');
    consola.success('reading output');
    return this.decoder.decode(output);
  }

  async destroy() {
    this.emitter.emit('destroy');
  }
}
