/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_TITLE: string;
  readonly VITE_FOOTER: string;
  // more env...
}


declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
