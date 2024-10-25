import { WebContainer } from '@webcontainer/api';
import consola from 'consola';

let webContainer: WebContainer;
let webContainerPromise: Promise<WebContainer>;

export async function getWebContainer() {
  if (webContainer) {
    return webContainer;
  }
  if (!webContainerPromise) {
    webContainerPromise = WebContainer.boot();
  }
  webContainer = await webContainerPromise;
  consola.info('WebContainer booted');
  return webContainer;
}
