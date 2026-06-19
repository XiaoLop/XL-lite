/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_PORT: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_API_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: import('vite/types/importMeta').ImportMeta['glob'];
  readonly globEager: import('vite/types/importMeta').ImportMeta['globEager'];
  readonly hot?: import('vite/client').ImportMetaHot;
  readonly readonly: boolean;
  readonly url: string;
}
