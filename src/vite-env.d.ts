/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BULLX_API_URL?: string;
  readonly VITE_BULLX_EMBED_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
